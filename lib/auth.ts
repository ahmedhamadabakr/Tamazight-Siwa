import { Session } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { JWT } from "next-auth/jwt"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import { getMongoClient } from "@/lib/mongodb"
import { database } from "@/lib/models"
import { comparePassword, generateAccessToken, generateRefreshToken } from "@/lib/security"
import { SECURITY_CONFIG, validateSecurityEnv } from "@/lib/security/config"
import { rateLimitService } from "@/lib/security/rate-limit"

// Validate environment variables on startup
validateSecurityEnv()

// Type alias for NextAuth configuration
type NextAuthOptions = {
  adapter?: any
  providers: any[]
  session?: { strategy: "jwt" | "database"; maxAge?: number }
  callbacks?: any
  pages?: { signIn?: string }
  cookies?: any
  events?: any
}

export async function getAuthOptions(): Promise<NextAuthOptions> {
  // Only connect to database during runtime, not build time
  let adapter = undefined
  if (process.env.NODE_ENV !== 'production' || process.env.VERCEL_ENV === 'production') {
    try {
      const client = await getMongoClient()
      adapter = MongoDBAdapter(client)
    } catch (error) {
      console.warn('Database connection not available during build time')
    }
  }

  return {
    adapter,
    providers: [
      CredentialsProvider({
        name: "credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
          rememberMe: { label: "Remember Me", type: "checkbox" }
        },
        async authorize(credentials, req) {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          try {
            // Get client IP for rate limiting
            const clientIP = req?.headers?.['x-forwarded-for'] ||
              req?.headers?.['x-real-ip'] ||
              '127.0.0.1'
            const ip = Array.isArray(clientIP) ? clientIP[0] : clientIP.toString().split(',')[0]

            // Check rate limiting for IP
            const ipRateLimit = await rateLimitService.checkLoginAttempts(ip)
            if (!ipRateLimit.allowed) {
              await database.logSecurityEvent({
                eventType: 'RATE_LIMIT_EXCEEDED',
                ipAddress: ip,
                details: { identifier: ip, type: 'ip' }
              })
              return null
            }

            // Check rate limiting for email
            const emailRateLimit = await rateLimitService.checkLoginAttempts(credentials.email)
            if (!emailRateLimit.allowed) {
              await database.logSecurityEvent({
                eventType: 'RATE_LIMIT_EXCEEDED',
                ipAddress: ip,
                details: { identifier: credentials.email, type: 'email' }
              })
              return null
            }

            // Find user by email
            const user = await database.findUserByEmail(credentials.email)
            if (!user) {
              await rateLimitService.recordLoginAttempt(ip, false)
              await rateLimitService.recordLoginAttempt(credentials.email, false)
              await database.logSecurityEvent({
                eventType: 'LOGIN_FAILED',
                ipAddress: ip,
                details: { reason: 'user_not_found', email: credentials.email }
              })
              return null
            }

            // Check if account is locked
            if (user.lockoutUntil && user.lockoutUntil > new Date()) {
              await database.logSecurityEvent({
                userId: user._id,
                eventType: 'ACCOUNT_LOCKED',
                ipAddress: ip,
                details: { lockoutUntil: user.lockoutUntil }
              })
              return null
            }

            // Verify password
            const isPasswordValid = await comparePassword(credentials.password, user.password)
            if (!isPasswordValid) {
              await rateLimitService.recordLoginAttempt(ip, false)
              await rateLimitService.recordLoginAttempt(credentials.email, false)
              await database.incrementLoginAttempts(credentials.email)

              // Check if account should be locked
              if (await rateLimitService.shouldLockAccount(credentials.email)) {
                await database.lockAccount(credentials.email, SECURITY_CONFIG.LOGIN_LOCKOUT_DURATION)
                await database.logSecurityEvent({
                  userId: user._id,
                  eventType: 'ACCOUNT_LOCKED',
                  ipAddress: ip,
                  details: { reason: 'max_attempts_exceeded' }
                })
              }

              await database.logSecurityEvent({
                userId: user._id,
                eventType: 'LOGIN_FAILED',
                ipAddress: ip,
                details: { reason: 'invalid_password' }
              })
              return null
            }

            // Check if user account is active
            if (!user.isActive) {
              await database.logSecurityEvent({
                userId: user._id,
                eventType: 'LOGIN_FAILED',
                ipAddress: ip,
                details: { reason: 'account_inactive' }
              })
              return null
            }

            // Successful login - reset rate limits and login attempts
            await rateLimitService.recordLoginAttempt(ip, true)
            await rateLimitService.recordLoginAttempt(credentials.email, true)
            await database.resetLoginAttempts(credentials.email)
            await database.updateLastLogin(user._id!, ip)

            // Generate and store refresh token
            const rememberMe = credentials.rememberMe === 'true'
            const refreshTokenData = generateRefreshToken(rememberMe ? 90 : 30)
            refreshTokenData.ipAddress = ip
            refreshTokenData.deviceInfo = req?.headers?.['user-agent'] || 'Unknown'

            await database.addRefreshToken(user._id!, refreshTokenData)

            await database.logSecurityEvent({
              userId: user._id,
              eventType: 'LOGIN_SUCCESS',
              ipAddress: ip,
              details: { rememberMe }
            })

            return {
              id: user._id!.toString(),
              email: user.email,
              name: user.name,
              image: user.image || null,
              role: user.role,
              refreshToken: refreshTokenData.token,
              rememberMe
            }
          } catch (error) {
            console.error('Auth error:', error)
            return null
          }
        }
      })
    ],
    session: {
      strategy: "jwt",
      maxAge: 24 * 60 * 60, // 24 hours for session token
    },
    callbacks: {
      async jwt({ token, user }: { token: JWT; user?: any }): Promise<JWT> {
        if (user) {
          token.role = user.role
          token.image = user.image
          token.refreshToken = user.refreshToken

          // Generate access token with longer expiry
          token.accessToken = generateAccessToken({
            userId: user.id,
            email: user.email,
            role: user.role
          })
          
          // Set token expiry time
          token.exp = Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
        }
        
        // Check if token is expired and refresh if needed
        const now = Math.floor(Date.now() / 1000)
        if (token.exp && typeof token.exp === 'number' && token.exp < now) {
          try {
            // Try to refresh the token using refresh token
            if (token.refreshToken) {
              const user = await database.findUserByRefreshToken(token.refreshToken as string)
              if (user && user.isActive) {
                // Generate new access token
                token.accessToken = generateAccessToken({
                  userId: user._id!.toString(),
                  email: user.email,
                  role: user.role
                })
                token.exp = Math.floor(Date.now() / 1000) + (24 * 60 * 60)
              } else {
                // Invalid refresh token, force logout
                return {} as JWT
              }
            }
          } catch (error) {
            console.error('Token refresh error:', error)
            return {} as JWT
          }
        }
        
        return token
      },
      async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
        if (token && session.user) {
          (session.user as any).id = token.sub!
            ; (session.user as any).role = token.role
            ; (session.user as any).image = token.image
            ; (session.user as any).accessToken = token.accessToken as string
          session.accessToken = token.accessToken as string
        }
        return session
      },
      async signIn({ user, account, profile }: { user: any; account: any; profile?: any }) {
        // Allow sign in
        return true
      },
      async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
        // Allows relative callback URLs
        if (url.startsWith("/")) return `${baseUrl}${url}`
        // Allows callback URLs on the same origin
        else if (new URL(url).origin === baseUrl) return url
        return baseUrl
      },
    },
    cookies: {
      sessionToken: {
        name: process.env.NODE_ENV === 'production'
          ? '__Secure-next-auth.session-token'
          : 'next-auth.session-token',
        options: {
          ...SECURITY_CONFIG.COOKIE_CONFIG,
          secure: process.env.NODE_ENV === 'production',
        }
      },
      callbackUrl: {
        name: process.env.NODE_ENV === 'production'
          ? '__Secure-next-auth.callback-url'
          : 'next-auth.callback-url',
        options: {
          ...SECURITY_CONFIG.COOKIE_CONFIG,
          secure: process.env.NODE_ENV === 'production',
        }
      },
      csrfToken: {
        name: process.env.NODE_ENV === 'production'
          ? '__Host-next-auth.csrf-token'
          : 'next-auth.csrf-token',
        options: {
          ...SECURITY_CONFIG.COOKIE_CONFIG,
          secure: process.env.NODE_ENV === 'production',
        }
      }
    },
    events: {
      async signOut({ token }: { token: JWT }) {
        if (token?.refreshToken) {
          try {
            const user = await database.findUserByRefreshToken(token.refreshToken as string)
            if (user) {
              await database.removeRefreshToken(user._id!, token.refreshToken as string)
            }
          } catch (error) {
            console.error('Error removing refresh token on signout:', error)
          }
        }
      }
    },
    pages: {
      signIn: '/login',
    },
  }
}
