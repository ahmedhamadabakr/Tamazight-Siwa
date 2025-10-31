import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Get token from JWT
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });

    // Get session from NextAuth
    const session = await getServerSession(authOptions);

    return NextResponse.json({
      success: true,
      data: {
        token: token ? {
          id: token.id,
          email: token.email,
          role: token.role,
          name: token.name
        } : null,
        session: session ? {
          user: session.user
        } : null,
        cookies: request.cookies.getAll(),
        headers: {
          authorization: request.headers.get('authorization'),
          cookie: request.headers.get('cookie')
        }
      }
    });
  } catch (error) {
    console.error('Debug session error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}