import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getAuthOptions } from '@/lib/auth';
import { database } from '@/lib/models';
import { SecurityErrorCodes } from '@/lib/security';
import { ObjectId } from 'mongodb';

interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function GET(request: NextRequest) {
  try {
    // Get current session
    const session = await getServerSession(await getAuthOptions());
    if (!session?.user) {
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

    // Get user with refresh tokens
    const user = await database.findUserById(userObjectId);
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
    const updatedUser = await database.findUserById(userObjectId);
    const activeSessions = updatedUser?.refreshTokens || [];

    // Format session data for response
    const sessions = activeSessions.map((token, index) => ({
      id: `session_${index}`,
      deviceInfo: token.deviceInfo || 'Unknown Device',
      ipAddress: token.ipAddress || 'Unknown IP',
      createdAt: token.createdAt,
      expiresAt: token.expiresAt,
      isCurrentSession: false, // We'll determine this on the client side
    }));

    return NextResponse.json({
      success: true,
      data: {
        totalSessions: sessions.length,
        sessions: sessions.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
      }
    });

  } catch (error) {
    console.error('Get sessions error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: {
          code: 'SERVER_ERROR',
          message: 'An unexpected error occurred while fetching sessions.'
        }
      },
      { status: 500 }
    );
  }
}

// Revoke a specific session
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { 
          success: false, 
          error: {
            code: SecurityErrorCodes.INVALID_INPUT,
            message: 'Session ID is required'
          }
        },
        { status: 400 }
      );
    }

    // Get current session
    const session = await getServerSession(await getAuthOptions());
    if (!session?.user) {
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

    // Get user with refresh tokens
    const user = await database.findUserById(userObjectId);
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

    // Find the session to revoke
    const sessionIndex = parseInt(sessionId.replace('session_', ''));
    const refreshTokens = user.refreshTokens || [];
    
    if (sessionIndex < 0 || sessionIndex >= refreshTokens.length) {
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

    const tokenToRevoke = refreshTokens[sessionIndex];
    
    // Remove the specific refresh token
    await database.removeRefreshToken(userObjectId, tokenToRevoke.token);

    // Log security event
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    '127.0.0.1';
    
    await database.logSecurityEvent({
      userId,
      eventType: 'LOGIN_SUCCESS', // Using LOGIN_SUCCESS for session revoke success
      ipAddress: clientIP,
      userAgent: request.headers.get('user-agent') || 'Unknown',
      details: { 
        action: 'revoke_session', 
        revokedSession: {
          deviceInfo: tokenToRevoke.deviceInfo,
          ipAddress: tokenToRevoke.ipAddress,
          createdAt: tokenToRevoke.createdAt
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Session revoked successfully'
    });

  } catch (error) {
    console.error('Revoke session error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: {
          code: 'SERVER_ERROR',
          message: 'An unexpected error occurred while revoking session.'
        }
      },
      { status: 500 }
    );
  }
}
