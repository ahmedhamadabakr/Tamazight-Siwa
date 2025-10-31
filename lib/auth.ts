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

          return {
            id: user._id!.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image,
            fullName: user.fullName,
          };

        } catch (error) {
          console.error('Authentication error:', error);
          console.error('Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            credentials: { email: credentials?.email, hasPassword: !!credentials?.password }
          });
          throw error;
        }
      }
    })
  ],
  
  pages: {
    signIn: '/login',
    error: '/login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async jwt({ token, user, account }: any) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          id: user.id,
          role: (user as any).role,
          fullName: (user as any).fullName,
        };
      }

      // Return previous token if the access token has not expired yet
      return token;
    },

    async session({ session, token }: any) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          role: token.role as string,
          fullName: token.fullName as string,
        };
      }
      return session;
    },

    async redirect({ url, baseUrl }: any) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
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

  debug: process.env.NODE_ENV === 'development',
};

// Export function for backward compatibility
export async function getAuthOptions() {
  return authOptions;
}
