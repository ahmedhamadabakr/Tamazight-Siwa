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
        console.log('Attempting to authorize user...');
        try {
          

          if (!credentials?.email || !credentials?.password) {
            console.log('Authorization failed: Missing email or password.');
            return null;
          }

          const email = String(credentials.email).trim().toLowerCase();
          const password = String(credentials.password);

          const user = await database.findUserByEmail(email);
          if (!user) {
            console.log(`Authorization failed: User with email ${email} not found.`);
            return null;
          }

          if (!user.isActive) {
            console.log(`Authorization failed: User ${email} account is not activated.`);
            throw new Error('Your account is not activated. Please check your email.');
          }

          const isPasswordValid = await comparePassword(password, user.password);
          if (!isPasswordValid) {
            console.log(`Authorization failed: Invalid password for user ${email}.`);
            return null;
          }

          console.log(`User ${email} authorized successfully.`);
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
      console.log('Redirecting...');
      console.log('URL:', url);
      console.log('Base URL:', baseUrl);
      if (url.startsWith('/')) {
        console.log('Redirecting to absolute path:', `${baseUrl}${url}`);
        return `${baseUrl}${url}`;
      }
      else if (new URL(url).origin === baseUrl) {
        console.log('Redirecting to same origin URL:', url);
        return url;
      }
      console.log('Redirecting to base URL:', baseUrl);
      return baseUrl;
    }
  },

  events: {
    async signIn({ user}: any) {
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
