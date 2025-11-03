import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { database } from '@/lib/models';
import { SecurityErrorCodes } from '@/lib/security';

export async function GET(request: NextRequest) {
  try {
    // Get session token from NextAuth
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !token.sub) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: SecurityErrorCodes.TOKEN_INVALID,
            message: 'Authentication required',
          },
        },
        { status: 401 }
      );
    }

    const userId = token.sub;

    // Get user data
    const user = await database.findUserById(userId as any);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: SecurityErrorCodes.TOKEN_INVALID,
            message: 'User not found',
          },
        },
        { status: 404 }
      );
    }

    // Clean expired tokens
    await database.cleanExpiredRefreshTokens();

    // Get updated user data
    const updatedUser = await database.findUserById(userId as any);
    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: SecurityErrorCodes.TOKEN_INVALID,
            message: 'User not found',
          },
        },
        { status: 404 }
      );
    }

    // Count active sessions
    const activeSessions = updatedUser.refreshTokens.length;
    const totalSessions = activeSessions;

    // Calculate basic security score
    let securityScore = 100;

    // Deduct points for inactive email or too many sessions
    if (!updatedUser.emailVerified) securityScore -= 15;
    if (activeSessions > 5) securityScore -= 10;

    // Ensure score is within range
    securityScore = Math.max(0, Math.min(100, securityScore));

    // Determine account status
    let accountStatus: 'active' | 'locked' | 'inactive' = 'active';
    const now = new Date();

    if (updatedUser.lockoutUntil && updatedUser.lockoutUntil > now) {
      accountStatus = 'locked';
    } else if (!updatedUser.isActive) {
      accountStatus = 'inactive';
    }

    // Build stats object
    const stats = {
      totalSessions,
      activeSessions,
      accountStatus,
      lastLogin:
        updatedUser.lastLogin?.toISOString() || new Date().toISOString(),
      securityScore: Math.round(securityScore),
    };

    // Return response
    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('Security stats fetch error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to fetch security statistics',
        },
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}