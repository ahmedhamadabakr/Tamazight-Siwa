// Import NextAuth types
import CredentialsProvider from 'next-auth/providers/credentials';
import { database } from '@/lib/models';
import { comparePassword } from '@/lib/security/password';

// In-memory store for login attempts.
// NOTE: This is not suitable for production at scale.
// A more robust solution would use a database or a service like Redis.
const loginAttempts: { [ip: string]: { count: number; lastAttempt: number } } = {};

/* const handleFailedAttempt = (ip: string | undefined | null) => {
    if (!ip) return;
    const now = Date.now();
    const attempts = loginAttempts[ip] || { count: 0, lastAttempt: now };
    if ((now - attempts.lastAttempt) > 60 * 1000 * 5) { // Reset after 5 minutes
        loginAttempts[ip] = { count: 1, lastAttempt: now };
    } else {
        loginAttempts[ip] = { count: attempts.count + 1, lastAttempt: now };
    }
}; */

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
        const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress;
        try {
          if (ip) {
            const now = Date.now();
            const attempts = loginAttempts[ip];
            if (attempts && attempts.count > 5 && (now - attempts.lastAttempt) < 60 * 1000 * 5) { // 5 attempts in 5 minutes
                throw new Error('Too many login attempts. Please try again in 5 minutes.');
            }
          }

          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const email = String(credentials.email).trim().toLowerCase();
          const password = String(credentials.password);

          const user = await database.findUserByEmail(email);
          if (!user) {
         /*    handleFailedAttempt(ip); */
            return null;
          }

          if (!user.isActive) {
            throw new Error('Your account is not activated. Please check your email.');
          }

          const isPasswordValid = await comparePassword(password, user.password);
          if (!isPasswordValid) {
            // handleFailedAttempt(ip);
            return null;
          }

          if (ip) {
            delete loginAttempts[ip];
          }

          return {
            id: user._id!.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image,
            fullName: user.fullName,
          };

        } catch (error: any) {
            // Log the error and re-throw it to be handled by NextAuth
            console.error('Credentials provider error:', {
                message: error.message,
                ip,
                email: credentials?.email,
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
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.fullName = user.fullName;
      }
      return token;
    },

    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.fullName = token.fullName;
      }
      return session;
    },

    async redirect({ url, baseUrl }: any) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
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

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  trustHost: true,
};

if (!process.env.NEXTAUTH_SECRET) {
  console.warn('Warning: NEXTAUTH_SECRET is not defined');
}

if (!process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET is not defined');
}

export async function getAuthOptions() {
  return authOptions;
}
