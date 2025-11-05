// Import NextAuth types
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import { getMongoClient } from '@/lib/mongodb';
import { database } from '@/lib/models';
import { comparePassword } from '@/lib/security/password';

export const authOptions = {
  adapter: MongoDBAdapter(getMongoClient() as any),
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
    strategy: 'database' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async session({ session }: any) {
      try {
        if (session?.user?.email) {
          const user = await database.findUserByEmail(session.user.email);
          if (user && session.user) {
            (session.user as any).id = user._id?.toString();
            (session.user as any).role = user.role;
            (session.user as any).fullName = user.fullName;
          }
        }
      } catch (e) {
        // noop
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

export async function getAuthOptions() {
  return authOptions;
}
