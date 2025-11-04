// Import NextAuth types
import CredentialsProvider from 'next-auth/providers/credentials';
import { database } from '@/lib/models';
import { comparePassword } from '@/lib/security/password';

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
            return null;
          }

          const email = String(credentials.email).trim().toLowerCase();
          const password = String(credentials.password);

          // Find user by email
          const user = await database.findUserByEmail(email);
          if (!user) {
            return null;
          }

          // Block login if user is not active
          if (!user.isActive) {
            // Optionally, you could throw an error with a specific message
            // throw new Error('account_not_activated');
            return null; 
          }

          // Verify password
          const isPasswordValid = await comparePassword(password, user.password);
          if (!isPasswordValid) {
            return null;
          }

          // Return minimal user object for session/jwt
          return {
            id: user._id!.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image,
            fullName: user.fullName,
          };

        } catch (error) {
          console.error('Credentials provider error:', error);
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
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
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

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  trustHost: true, // Important for Vercel deployments
};

// Export function for backward compatibility
// Validate environment variables (warn instead of throwing to avoid hard crashes in serverless)
if (!process.env.NEXTAUTH_SECRET) {
  console.warn('Warning: NEXTAUTH_SECRET is not defined');
}

if (!process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET is not defined');
}

export async function getAuthOptions() {
  return authOptions;
}
