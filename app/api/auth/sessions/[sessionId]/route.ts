import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { database } from '@/lib/models';
import { SecurityErrorCodes } from '@/lib/security';
import { rateLimitService } from '@/lib/security/rate-limit';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params;
    
    // Get client IP for logging
    const clientIP = rateLimitService.getClientIP(request);
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    // Get session token from NextAuth
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    if (!token || !token.sub) {
      return NextResponse.json(
        { 
          success: false, 
          error: {
            code: SecurityErrorCodes.TOKEN_INVALID,
            message: 'Authentication required'
          }
        },
        { status: 401 }
      );
    }

    const userId = token.sub;

    // Get user with refresh tokens
    const user = await database.findUserById(userId as any);
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          error: {
            code: SecurityErrorCodes.TOKEN_INVALID,
            message: 'User not found'
          }
        },
        { status: 404 }
      );
    }

    // Parse session ID to get token index
    const sessionParts = sessionId.split('_');
    if (sessionParts.length !== 2 || sessionParts[0] !== userId) {
      return NextResponse.json(
        { 
          success: false, 
          error: {
            code: SecurityErrorCodes.INVALID_INPUT,
            message: 'Invalid session ID'
          }
        },
        { status: 400 }
      );
    }

    const tokenIndex = parseInt(sessionParts[1]);
    if (isNaN(tokenIndex) || tokenIndex < 0 || tokenIndex >= user.refreshTokens.length) {
      return NextResponse.json(
        { 
          success: false, 
          error: {
            code: SecurityErrorCodes.INVALID_INPUT,
            message: 'Session not found'
          }
        },
        { status: 404 }
      );
    }

    const targetToken = user.refreshTokens[tokenIndex];
    const currentRefreshToken = request.cookies.get('refreshToken')?.value;

    // Prevent users from logging out their current session via this endpoint
    if (targetToken.token === currentRefreshToken) {
      return NextResponse.json(
        { 
          success: false, 
          error: {
            code: SecurityErrorCodes.INVALID_INPUT,
            message: 'Cannot logout current session. Use regular logout instead.'
          }
        },
        { status: 400 }
      );
    }

    // Remove the specific refresh token
    await database.removeRefreshToken(userId as any, targetToken.token);

    // Log security event
    await database.logSecurityEvent({
      userId: userId as any,
      eventType: 'LOGIN_SUCCESS', // Using for session management tracking
      ipAddress: clientIP,
      userAgent,
      details: { 
        action: 'session_terminated',
        targetDevice: targetToken.deviceInfo,
        targetIP: targetToken.ipAddress
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Session terminated successfully'
    });

  } catch (error) {
    console.error('Session termination error:', error);
    
    // Log security event for unexpected errors
    try {
      const clientIP = rateLimitService.getClientIP(request);
      await database.logSecurityEvent({
        eventType: 'LOGIN_FAILED', // Using for error tracking
        ipAddress: clientIP,
        details: { 
          action: 'session_termination_error',
          sessionId: params.sessionId,
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
          message: 'Failed to terminate session'
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
      'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}