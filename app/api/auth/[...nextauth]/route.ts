import NextAuth from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const handler = NextAuth(authOptions);

export const GET = handler;
export const POST = handler;
