import { Session } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { JWT } from "next-auth/jwt"
import { getMongoClient } from "@/lib/mongodb"
import bcrypt from "bcryptjs"

// Type alias for NextAuth configuration
type NextAuthOptions = {
  providers: any[]
  session?: { strategy: string }
  callbacks?: any
  pages?: { signIn?: string }
}

export async function getAuthOptions(): Promise<NextAuthOptions> {
  return {
    providers: [
      CredentialsProvider({
        name: "credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          try {
            const client = await getMongoClient()
            const db = client.db()
            const user = await db.collection('users').findOne({
              email: credentials.email
            })

            if (!user) {
              return null
            }

            const isPasswordValid = await bcrypt.compare(
              credentials.password,
              user.password
            )

            if (!isPasswordValid) {
              return null
            }

            // Check if user is active
            if (!user.isActive) {
              return null
            }

            return {
              id: user._id.toString(),
              email: user.email,
              name: user.name,
              role: 'user',
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
    },
    callbacks: {
      async jwt({ token, user }: { token: JWT; user?: any }): Promise<JWT> {
        if (user) {
          token.role = user.role
        }
        return token
      },
      async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
        if (token && session.user) {
          (session.user as any).id = token.sub!
          ;(session.user as any).role = token.role
        }
        return session
      },
    },
    pages: {
      signIn: '/login',
    },
  }
}
