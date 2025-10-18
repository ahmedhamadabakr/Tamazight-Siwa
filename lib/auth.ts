import { Session } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { JWT } from "next-auth/jwt"
import { getMongoClient } from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

// Type alias for NextAuth configuration
type NextAuthOptions = {
  providers: any[]
  session?: { strategy: "jwt" | "database" }
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
              image: user.image || null,
              role: user.role,
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
      async jwt({ token, user, account }: { token: JWT; user?: any; account?: any }): Promise<JWT> {
        if (user) {
          token.role = user.role
          token.image = user.image
          // Generate a persistent access token
          token.accessToken = jwt.sign(
            {
              userId: user.id,
              email: user.email,
              role: user.role
            },
            process.env.JWT_SECRET || 'fallback-secret',
            { expiresIn: '30d' } // Long-lived token
          )
        }
        return token
      },
      async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
        if (token && session.user) {
          (session.user as any).id = token.sub!
          ;(session.user as any).role = token.role
          ;(session.user as any).image = token.image
          ;(session.user as any).accessToken = token.accessToken as string
          session.accessToken = token.accessToken as string
        }
        return session
      },
    },
    pages: {
      signIn: '/login',
    },
  }
}
