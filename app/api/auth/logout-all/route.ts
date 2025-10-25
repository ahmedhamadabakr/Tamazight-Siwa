import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getAuthOptions } from '@/lib/auth';
import { database } from '@/lib/models';
import { rateLimitService } from '@/lib/security/rate-limit';
import { SecurityErrorCodes } from '@/lib/security';
import { ObjectId } from 'mongodb';

interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for logging
    const clientIP = rateLimitService.getClientIP(request);
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    // Check rate limiting for logout requests (10 requests per minute)
    const ipRateLimit = await rateLimitService.checkLoginAttempts(`logout_all_${clientIP}`);
    if (!ipRateLimit.allowed) {
      await database.logSecurityEvent({
        eventType: 'RATE_LIMIT_EXCEEDED',
        ipAddress: clientIP,
        userAgent,
        details: { identifier: `logout_all_${clientIP}`, type: 'logout_all', retryAfter: ipRateLimit.retryAfter }
      });

      return NextResponse.json(
        { 
          success: false, 
          error: {
            code: SecurityErrorCodes.RATE_LIMIT_EXCEEDED,
            message: `Too many logout requests. Try again in ${ipRateLimit.retryAfter} seconds.`,
            details: { retryAfter: ipRateLimit.retryAfter }
          }
        },
        { 
          status: 429,
          headers: {
            'Retry-After': ipRateLimit.retryAfter?.toString() || '60'
          }
        }
      );
    }

    // Get current session
    const session = await getServerSession(await getAuthOptions());
    if (!session?.user) {
      await rateLimitService.recordLoginAttempt(`logout_all_${clientIP}`, false);
      return NextResponse.json(
        { 
          success: false, 
          error: {
            code: SecurityErrorCodes.TOKEN_INVALID,
            message: 'Not authenticated'
          }
        },
        { status: 401 }
      );
    }

    const userId = (session.user as SessionUser).id;
    const userObjectId = new ObjectId(userId);

    // Remove all refresh tokens for the user
    await database.removeAllRefreshTokens(userObjectId);

    // Log security event
    await database.logSecurityEvent({
      userId: userObjectId,
      eventType: 'LOGIN_SUCCESS', // Using LOGIN_SUCCESS for logout success
      ipAddress: clientIP,
      userAgent,
      details: { action: 'logout_all_devices', success: true }
    });

    // Record successful logout request
    await rateLimitService.recordLoginAttempt(`logout_all_${clientIP}`, true);

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Successfully logged out from all devices'
    });

    // Clear all authentication cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 0, // Expire immediately
    };

    // Clear refresh token cookie
    response.cookies.set('refreshToken', '', cookieOptions);
    
    // Clear NextAuth cookies
    response.cookies.set('next-auth.session-token', '', cookieOptions);
    response.cookies.set('__Secure-next-auth.session-token', '', cookieOptions);
    response.cookies.set('next-auth.callback-url', '', cookieOptions);
    response.cookies.set('__Secure-next-auth.callback-url', '', cookieOptions);
    response.cookies.set('next-auth.csrf-token', '', cookieOptions);
    response.cookies.set('__Host-next-auth.csrf-token', '', cookieOptions);

    return response;

  } catch (error) {
    console.error('Logout all devices error:', error);
    
    // Log security event for unexpected errors
    try {
      const clientIP = rateLimitService.getClientIP(request);
      await database.logSecurityEvent({
        eventType: 'LOGIN_FAILED',
        ipAddress: clientIP,
        details: { action: 'logout_all_devices', reason: 'server_error', error: error instanceof Error ? error.message : 'Unknown error' }
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