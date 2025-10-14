import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id: string
      role: string
      image?: string | null
      name?: string | null
      email?: string | null
      picture?: string | null
    } & DefaultSession['user'];
  }

  interface User {
    id: string
    role: string
    image?: string | null
    name?: string | null
    email?: string | null
    picture?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    image?: string | null;
    email?: string | null;
    name?: string | null;
    picture?: string | null;
  }
}
