import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/models';
import { 
  generateAccessToken,
  generateRefreshToken,
  SecurityErrorCodes 
} from '@/lib/security';
import { rateLimitService } from '@/lib/security/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting and logging
    const clientIP = rateLimitService.getClientIP(request);
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    // Check rate limiting for token refresh (10 requests per minute per IP)
    const ipRateLimit = await rateLimitService.checkLoginAttempts(`refresh_${clientIP}`);
    if (!ipRateLimit.allowed) {
      await database.logSecurityEvent({
        eventType: 'RATE_LIMIT_EXCEEDED',
        ipAddress: clientIP,
        userAgent,
        details: { identifier: `refresh_${clientIP}`, type: 'token_refresh', retryAfter: ipRateLimit.retryAfter }
      });

      return NextResponse.json(
        { 
          success: false, 
          error: {
            code: SecurityErrorCodes.RATE_LIMIT_EXCEEDED,
            message: `Too many token refresh attempts. Try again in ${ipRateLimit.retryAfter} seconds.`,
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

    // Get refresh token from HTTP-only cookie
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
      await rateLimitService.recordLoginAttempt(`refresh_${clientIP}`, false);
      return NextResponse.json(
        { 
          success: false, 
          error: {
            code: SecurityErrorCodes.TOKEN_INVALID,
            message: 'Refresh token not found'
          }
        },
        { status: 401 }
      );
    }

    // Find user by refresh token
    const user = await database.findUserByRefreshToken(refreshToken);
    if (!user) {
      await rateLimitService.recordLoginAttempt(`refresh_${clientIP}`, false);
      await database.logSecurityEvent({
        eventType: 'TOKEN_REFRESH',
        ipAddress: clientIP,
        userAgent,
        details: { success: false, reason: 'invalid_refresh_token' }
      });

      return NextResponse.json(
        { 
          success: false, 
          error: {
            code: SecurityErrorCodes.TOKEN_INVALID,
            message: 'Invalid refresh token'
          }
        },
        { status: 401 }
      );
    }

    // Check if user account is still active
    if (!user.isActive) {
      await rateLimitService.recordLoginAttempt(`refresh_${clientIP}`, false);
      await database.logSecurityEvent({
        userId: user._id,
        eventType: 'TOKEN_REFRESH',
        ipAddress: clientIP,
        userAgent,
        details: { success: false, reason: 'account_inactive' }
      });

      return NextResponse.json(
        { 
          success: false, 
          error: {
            code: SecurityErrorCodes.EMAIL_NOT_VERIFIED,
            message: 'Account is not active'
          }
        },
        { status: 401 }
      );
    }

    // Find the specific refresh token in user's tokens array
    const tokenData = user.refreshTokens.find(rt => rt.token === refreshToken);
    if (!tokenData) {
      await rateLimitService.recordLoginAttempt(`refresh_${clientIP}`, false);
      await database.logSecurityEvent({
        userId: user._id,
        eventType: 'TOKEN_REFRESH',
        ipAddress: clientIP,
        userAgent,
        details: { success: false, reason: 'token_not_found_in_user' }
      });

      return NextResponse.json(
        { 
          success: false, 
          error: {
            code: SecurityErrorCodes.TOKEN_INVALID,
            message: 'Refresh token not found'
          }
        },
        { status: 401 }
      );
    }

    // Check if refresh token has expired
    if (tokenData.expiresAt < new Date()) {
      // Remove expired token
      await database.removeRefreshToken(user._id!, refreshToken);
      await rateLimitService.recordLoginAttempt(`refresh_${clientIP}`, false);
      await database.logSecurityEvent({
        userId: user._id,
        eventType: 'TOKEN_REFRESH',
        ipAddress: clientIP,
        userAgent,
        details: { success: false, reason: 'token_expired' }
      });

      return NextResponse.json(
        { 
          success: false, 
          error: {
            code: SecurityErrorCodes.TOKEN_EXPIRED,
            message: 'Refresh token has expired'
          }
        },
        { status: 401 }
      );
    }

    // Generate new access token
    const newAccessToken = generateAccessToken({
      userId: user._id!.toString(),
      email: user.email,
      role: user.role
    });

    // Optionally rotate refresh token for enhanced security
    const shouldRotateToken = Math.random() < 0.1; // 10% chance to rotate
    let newRefreshToken = refreshToken;
    let newExpiresAt = tokenData.expiresAt;

    if (shouldRotateToken) {
      // Remove old refresh token
      await database.removeRefreshToken(user._id!, refreshToken);
      
      // Generate new refresh token
      const refreshTokenData = generateRefreshToken(30); // 30 days
      refreshTokenData.ipAddress = clientIP;
      refreshTokenData.deviceInfo = userAgent;
      
      // Store new refresh token
      await database.addRefreshToken(user._id!, refreshTokenData);
      
      newRefreshToken = refreshTokenData.token;
      newExpiresAt = refreshTokenData.expiresAt;
    }

    // Record successful token refresh
    await rateLimitService.recordLoginAttempt(`refresh_${clientIP}`, true);
    await database.logSecurityEvent({
      userId: user._id,
      eventType: 'TOKEN_REFRESH',
      ipAddress: clientIP,
      userAgent,
      details: { success: true, tokenRotated: shouldRotateToken }
    });

    // Prepare response
    const response = NextResponse.json({
      success: true,
      data: {
        accessToken: newAccessToken,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        user: {
          id: user._id!.toString(),
          name: user.name,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          image: user.image
        }
      }
    });

    // Update refresh token cookie if rotated
    if (shouldRotateToken) {
      response.cookies.set('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        expires: newExpiresAt,
      });
    }

    return response;

  } catch (error) {
    console.error('Token refresh error:', error);
    
    // Log security event for unexpected errors
    try {
      const clientIP = rateLimitService.getClientIP(request);
      await database.logSecurityEvent({
        eventType: 'TOKEN_REFRESH',
        ipAddress: clientIP,
        details: { success: false, reason: 'server_error', error: error instanceof Error ? error.message : 'Unknown error' }
      });
    } catch (logError) {
      console.error('Failed to log security event:', logError);
    }

    return NextResponse.json(
      { 
        success: false, 
        error: {
          code: 'SERVER_ERROR',
          message: 'An unexpected error occurred during token refresh. Please try again.'
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