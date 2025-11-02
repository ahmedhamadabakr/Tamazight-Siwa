import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { getToken } from 'next-auth/jwt';
import { database } from '@/lib/models';
import { rateLimitService } from '@/lib/security/rate-limit';
import { SecurityErrorCodes } from '@/lib/security';

function isSecureCookie(): boolean {
  try {
    const url = process.env.NEXTAUTH_URL || '';
    return url.startsWith('https://');
  } catch {
    return process.env.NODE_ENV === 'production';
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for logging
    const clientIP = rateLimitService.getClientIP(request);
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    // Get session token from NextAuth
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    // We'll proceed to clear cookies even if token is missing to ensure client is fully logged out

    const userId = token?.sub;

    const refreshToken = request.cookies.get('refreshToken')?.value;

    // Remove specific refresh token if provided
    if (refreshToken && userId) {
      try {
        await database.removeRefreshToken(userId as any, refreshToken);
      } catch (error) {
        console.error('Error removing refresh token:', error);
      }
    }

    // Log security event
    if (userId) {
      await database.logSecurityEvent({
        userId: userId as any,
        eventType: 'LOGIN_SUCCESS', // We'll use this for logout tracking
        ipAddress: clientIP,
        userAgent,
        details: { action: 'logout', type: 'single_session' }
      });
    }

    // Create response and clear cookies
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

    // Decide cookie security based on NEXTAUTH_URL scheme for local prod testing
    const secure = isSecureCookie();

    // Clear refresh token cookie
    response.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      path: '/',
      expires: new Date(0), // Expire immediately
    });

    // Clear NextAuth session cookies (cover both dev and prod names)
    const sessionCookieNames = [
      'next-auth.session-token',
      '__Secure-next-auth.session-token',
    ];
    const csrfCookieNames = [
      'next-auth.csrf-token',
      '__Host-next-auth.csrf-token',
    ];
    const miscCookieNames = [
      'next-auth.callback-url',
    ];

    sessionCookieNames.forEach((name) => {
      response.cookies.set(name, '', {
        httpOnly: true,
        secure,
        sameSite: 'lax',
        path: '/',
        expires: new Date(0),
      });
    });

    csrfCookieNames.forEach((name) => {
      response.cookies.set(name, '', {
        httpOnly: true,
        secure,
        sameSite: 'lax',
        path: '/',
        expires: new Date(0),
      });
    });

    // Clear non-HTTPOnly misc cookies as well
    miscCookieNames.forEach((name) => {
      response.cookies.set(name, '', {
        httpOnly: false,
        secure,
        sameSite: 'lax',
        path: '/',
        expires: new Date(0),
      });
    });

    // Always return 200 with cleared cookies; include info if no token was found
    if (!token) {
      return new NextResponse(
        JSON.stringify({ success: true, message: 'Logged out (no active session)' }),
        { status: 200, headers: response.headers }
      );
    }

    return response;

  } catch (error) {
    console.error('Logout error:', error);
    
    // Log security event for unexpected errors
    try {
      const clientIP = rateLimitService.getClientIP(request);
      await database.logSecurityEvent({
        eventType: 'LOGIN_FAILED', // Using for error tracking
        ipAddress: clientIP,
        details: { 
          action: 'logout_error', 
          error: error instanceof Error ? error.message : 'Unknown error' 
        }
      });
    } catch (logError) {
      console.error('Failed to log security event:', logError);
    }

    return NextResponse.json(
      { 
        success: false, 
        error: {
          code: 'SERVER_ERROR',
          message: 'An unexpected error occurred during logout. Please try again.'
        }
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}