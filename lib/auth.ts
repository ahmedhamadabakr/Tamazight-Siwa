// Import NextAuth types
import CredentialsProvider from 'next-auth/providers/credentials';
import { database } from '@/lib/models';
import { comparePassword } from '@/lib/security/password';
import { rateLimitService } from '@/lib/security/rate-limit';
import { validateLoginData, SecurityErrorCodes } from '@/lib/security';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        rememberMe: { label: 'Remember Me', type: 'checkbox' }
      },
      async authorize(credentials, req) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Email and password are required');
          }

          // Get client IP for rate limiting
          const clientIP = req?.headers?.get?.('x-forwarded-for') ||
            req?.headers?.get?.('x-real-ip') ||
            '127.0.0.1';
          const userAgent = req?.headers?.get?.('user-agent') || 'Unknown';

          // Validate input data
          const validatedData = validateLoginData({
            email: credentials.email,
            password: credentials.password,
            rememberMe: credentials.rememberMe === 'true'
          });

          // Check rate limiting
          const [ipRateLimit, emailRateLimit] = await Promise.all([
            rateLimitService.checkLoginAttempts(clientIP),
            rateLimitService.checkLoginAttempts(validatedData.email),
          ]);

          if (!ipRateLimit.allowed || !emailRateLimit.allowed) {
            await database.logSecurityEvent({
              eventType: 'RATE_LIMIT_EXCEEDED',
              ipAddress: clientIP,
              details: {
                identifier: !ipRateLimit.allowed ? clientIP : validatedData.email,
                type: !ipRateLimit.allowed ? 'ip' : 'email'
              }
            });
            throw new Error('Too many login attempts. Please try again later.');
          }

          // Find user
          const user = await database.findUserByEmail(validatedData.email);
          if (!user) {
            await Promise.allSettled([
              rateLimitService.recordLoginAttempt(clientIP, false),
              rateLimitService.recordLoginAttempt(validatedData.email, false),
              database.logSecurityEvent({
                eventType: 'LOGIN_FAILED',
                ipAddress: clientIP,
                userAgent,
                details: { reason: 'user_not_found', email: validatedData.email }
              })
            ]);
            throw new Error('Invalid email or password');
          }

          // Check if account is locked
          if (user.lockoutUntil && user.lockoutUntil > new Date()) {
            await database.logSecurityEvent({
              userId: user._id,
              eventType: 'ACCOUNT_LOCKED',
              ipAddress: clientIP,
              userAgent,
              details: { lockoutUntil: user.lockoutUntil }
            });
            throw new Error('Account is temporarily locked. Please try again later.');
          }

          // Verify password
          const isPasswordValid = await comparePassword(validatedData.password, user.password);
          if (!isPasswordValid) {
            await Promise.allSettled([
              rateLimitService.recordLoginAttempt(clientIP, false),
              rateLimitService.recordLoginAttempt(validatedData.email, false),
              database.incrementLoginAttempts(validatedData.email),
              database.logSecurityEvent({
                userId: user._id,
                eventType: 'LOGIN_FAILED',
                ipAddress: clientIP,
                userAgent,
                details: { reason: 'invalid_password' }
              })
            ]);
            throw new Error('Invalid email or password');
          }

          // Check if user is active
          if (!user.isActive) {
            await database.logSecurityEvent({
              userId: user._id,
              eventType: 'LOGIN_FAILED',
              ipAddress: clientIP,
              userAgent,
              details: { reason: 'account_inactive' }
            });
            throw new Error('Account is not active. Please verify your email address.');
          }

          // Success - reset rate limits and update login info
          await Promise.allSettled([
            rateLimitService.recordLoginAttempt(clientIP, true),
            rateLimitService.recordLoginAttempt(validatedData.email, true),
            database.resetLoginAttempts(validatedData.email),
            database.updateLastLogin(user._id!, clientIP),
            database.logSecurityEvent({
              userId: user._id,
              eventType: 'LOGIN_SUCCESS',
              ipAddress: clientIP,
              userAgent,
              details: { rememberMe: validatedData.rememberMe }
            })
          ]);

          const userResponse = {
            id: user._id!.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image,
            fullName: user.fullName,
          };

          console.log('Credentials provider - Returning user:', {
            id: userResponse.id,
            email: userResponse.email,
            role: userResponse.role
          });

          return userResponse;

        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.error('Credentials provider error:', errorMessage);

          // Return null instead of throwing to prevent NextAuth from crashing
          return null;
        }
      }
    })
  ],

  pages: {
    signIn: '/login',
    error: '/login',
  },

  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // Update session every 24 hours
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    // Let NextAuth use NEXTAUTH_SECRET automatically
  },

  // Remove custom cookie config - let NextAuth handle it automatically
  // cookies: {
  //   sessionToken: {
  //     name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
  //     options: {
  //       httpOnly: true,
  //       sameSite: 'lax',
  //       path: '/',
  //       secure: process.env.NODE_ENV === 'production',
  //     }
  //   }
  // },

  callbacks: {
    async jwt({ token, user, account }: any) {
      // Initial sign in - cache user data in token
      if (account && user) {
        console.log('JWT: Creating token for user:', user.email);
        return {
          ...token,
          id: user.id,
          role: user.role,
          fullName: user.fullName,
        };
      }

      // Return existing token
      return token;
    },

    async session({ session, token }: any) {
      if (token) {
        console.log('Session: Creating session for token:', token.id);
        session.user = {
          id: token.id,
          name: token.name,
          email: token.email,
          role: token.role,
          fullName: token.fullName,
          image: token.image,
        };
      }
      return session;
    },

    async redirect({ url, baseUrl }: any) {
      console.log('Redirect callback:', { url, baseUrl });

      // Allows relative callback URLs
      if (url.startsWith('/')) {
        const redirectUrl = `${baseUrl}${url}`;
        console.log('Redirecting to:', redirectUrl);
        return redirectUrl;
      }

      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) {
        console.log('Same origin redirect:', url);
        return url;
      }

      console.log('Default redirect to baseUrl:', baseUrl);
      return baseUrl;
    }
  },

  events: {
    async signIn({ user, account, profile, isNewUser }: any) {
      console.log('User signed in:', { userId: user.id, email: user.email });
    },

    async signOut({ session, token }: any) {
      console.log('User signed out:', { userId: token?.id });
    },
  },

  debug: true, // Enable debug in production temporarily
  trustHost: true, // Important for Vercel deployments
};

// Export function for backward compatibility
// Validate environment variables
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET is not defined');
}

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}

export async function getAuthOptions() {
  return authOptions;
}
