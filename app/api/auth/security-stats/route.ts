import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { database } from '@/lib/models';
import { SecurityErrorCodes } from '@/lib/security';

export async function GET(request: NextRequest) {
  try {
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

    // Get user data
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

    // Clean expired tokens first
    await database.cleanExpiredRefreshTokens();

    // Get updated user data
    const updatedUser = await database.findUserById(userId as any);
    if (!updatedUser) {
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

    // Get security events for analysis
    const securityEvents = await database.getSecurityEvents(userId as any, 100);
    
    // Calculate statistics
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Count recent events
    const recentLogins = securityEvents.filter(event => 
      event.eventType === 'LOGIN_SUCCESS' && 
      event.timestamp >= last7Days &&
      !event.details?.action // Exclude logout events
    ).length;

    const failedAttempts = securityEvents.filter(event => 
      event.eventType === 'LOGIN_FAILED' && 
      event.timestamp >= last24Hours
    ).length;

    // Active sessions count
    const activeSessions = updatedUser.refreshTokens.length;
    const totalSessions = activeSessions; // For now, same as active

    // Calculate security score
    let securityScore = 100;
    
    // Deduct points for security issues
    if (failedAttempts > 0) securityScore -= Math.min(failedAttempts * 5, 20);
    if (activeSessions > 5) securityScore -= 10;
    if (!updatedUser.emailVerified) securityScore -= 15;
    if (updatedUser.loginAttempts > 0) securityScore -= updatedUser.loginAttempts * 3;
    
    // Ensure score is between 0 and 100
    securityScore = Math.max(0, Math.min(100, securityScore));

    // Determine account status
    let accountStatus: 'active' | 'locked' | 'inactive' = 'active';
    if (updatedUser.lockoutUntil && updatedUser.lockoutUntil > now) {
      accountStatus = 'locked';
    } else if (!updatedUser.isActive) {
      accountStatus = 'inactive';
    }

    const stats = {
      totalSessions,
      activeSessions,
      recentLogins,
      failedAttempts,
      accountStatus,
      lastLogin: updatedUser.lastLogin?.toISOString() || new Date().toISOString(),
      securityScore: Math.round(securityScore),
    };

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
          message: 'Failed to fetch security statistics'
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}