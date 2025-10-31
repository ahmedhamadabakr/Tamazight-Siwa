import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
      fullName?: string | null
    }
    accessToken?: string
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
    fullName?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    role?: string
    fullName?: string
    accessToken?: string
  }
}