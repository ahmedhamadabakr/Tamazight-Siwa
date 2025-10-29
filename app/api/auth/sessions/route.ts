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
    const currentRefreshToken = request.cookies.get('refreshToken')?.value;

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

    // Transform refresh tokens to session format
    const sessions = updatedUser.refreshTokens.map((token, index) => ({
      id: `${userId}_${index}`,
      deviceInfo: token.deviceInfo || 'Unknown Device',
      ipAddress: token.ipAddress || 'Unknown IP',
      lastActive: token.createdAt,
      isCurrent: token.token === currentRefreshToken,
      expiresAt: token.expiresAt,
    }));

    // Sort sessions by last active (current session first, then by date)
    sessions.sort((a, b) => {
      if (a.isCurrent) return -1;
      if (b.isCurrent) return 1;
      return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
    });

    return NextResponse.json({
      success: true,
      sessions,
      totalSessions: sessions.length,
    });

  } catch (error) {
    console.error('Sessions fetch error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to fetch sessions'
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