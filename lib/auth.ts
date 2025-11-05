// Import NextAuth types
import GoogleProvider from 'next-auth/providers/google';
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
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const email = String(credentials.email).trim().toLowerCase();
        const password = String(credentials.password);
        const user = await database.findUserByEmail(email);
        if (!user) return null;
        if (!user.isActive) {
          throw new Error('Your account is not activated. Please check your email.');
        }
        const ok = await comparePassword(password, (user as any).password);
        if (!ok) return null;
        return {
          id: (user as any)._id?.toString(),
          name: user.name,
          email: user.email,
          role: (user as any).role,
          image: (user as any).image,
          fullName: (user as any).fullName,
        } as any;
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: false,
      profile(profile) {
        return {
          id: profile.sub || profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        } as any;
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
    async jwt({ token, user, account }: any) {
      // On initial sign-in, attach user data to token and persist a custom session
      if (user) {
        token.id = (user as any).id || token.id;
        token.role = (user as any).role || token.role;
        token.fullName = (user as any).fullName || token.fullName;
        // Generate a tokenId to link custom session records (not used by NextAuth internally)
        token.tokenId = token.tokenId || crypto.randomUUID();

        // Persist a custom session record (hybrid approach)
        try {
          const now = new Date();
          const exp = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
          await database.createCustomSession({
            userId: String(token.id),
            provider: account?.provider || 'credentials',
            tokenId: token.tokenId,
            issuedAt: now,
            expiresAt: exp,
            userAgent: null,
            ip: null,
          });
        } catch (e) {
          // swallow errors to avoid breaking login
          if (process.env.NODE_ENV === 'development') {
            console.warn('Custom session create failed', e);
          }
        }
      }
      return token;
    },
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

    async signOut({ token }: any) {
      try {
        const userId = token?.id;
        if (userId) {
          await database.deleteCustomSessionsByUser(String(userId));
        }
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Custom session delete failed', e);
        }
      }
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
