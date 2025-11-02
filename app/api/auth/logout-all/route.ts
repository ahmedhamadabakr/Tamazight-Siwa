import { NextRequest, NextResponse } from 'next/server';
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

    if (!token) {
      return NextResponse.json(
        { 
          success: false, 
          error: {
            code: SecurityErrorCodes.TOKEN_INVALID,
            message: 'No active session found'
          }
        },
        { status: 401 }
      );
    }

    const userId = token.sub;

    if (!userId) {
      return NextResponse.json(
        { 
          success: false, 
          error: {
            code: SecurityErrorCodes.TOKEN_INVALID,
            message: 'Invalid user session'
          }
        },
        { status: 401 }
      );
    }

    // Remove all refresh tokens for this user
    try {
      await database.removeAllRefreshTokens(userId as any);
    } catch (error) {
      console.error('Error removing all refresh tokens:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: {
            code: 'SERVER_ERROR',
            message: 'Failed to logout from all devices'
          }
        },
        { status: 500 }
      );
    }

    // Log security event
    await database.logSecurityEvent({
      userId: userId as any,
      eventType: 'LOGIN_SUCCESS', // We'll use this for logout tracking
      ipAddress: clientIP,
      userAgent,
      details: { action: 'logout', type: 'all_sessions' }
    });

    // Create response and clear cookies
    const response = NextResponse.json({
      success: true,
      message: 'Logged out from all devices successfully'
    });

    const secure = isSecureCookie();

    // Clear refresh token cookie
    response.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      path: '/',
      expires: new Date(0), // Expire immediately
    });

    // Clear NextAuth session cookies
    const cookiePrefix = secure ? '__Secure-' : '';
    const sessionCookieName = `${cookiePrefix}next-auth.session-token`;
    const csrfCookieName = secure ? '__Host-next-auth.csrf-token' : 'next-auth.csrf-token';

    response.cookies.set(sessionCookieName, '', {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      path: '/',
      expires: new Date(0),
    });

    response.cookies.set(csrfCookieName, '', {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      path: '/',
      expires: new Date(0),
    });

    // Also clear misc cookie
    response.cookies.set('next-auth.callback-url', '', {
      httpOnly: false,
      secure,
      sameSite: 'lax',
      path: '/',
      expires: new Date(0),
    });

    return response;

  } catch (error) {
    console.error('Logout all error:', error);
    
    // Log security event for unexpected errors
    try {
      const clientIP = rateLimitService.getClientIP(request);
      await database.logSecurityEvent({
        eventType: 'LOGIN_FAILED', // Using for error tracking
        ipAddress: clientIP,
        details: { 
          action: 'logout_all_error', 
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