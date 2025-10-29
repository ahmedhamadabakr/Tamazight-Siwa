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
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    // Validate limit
    const maxLimit = 100;
    const validLimit = Math.min(Math.max(1, limit), maxLimit);

    // Get security events for the user
    const events = await database.getSecurityEvents(userId as any, validLimit + offset);
    
    // Apply offset manually (since our database method doesn't support it yet)
    const paginatedEvents = events.slice(offset, offset + validLimit);

    // Transform events for frontend
    const transformedEvents = paginatedEvents.map(event => ({
      _id: event._id?.toString(),
      eventType: event.eventType,
      ipAddress: event.ipAddress,
      userAgent: event.userAgent,
      details: event.details,
      timestamp: event.timestamp.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      events: transformedEvents,
      pagination: {
        limit: validLimit,
        offset,
        total: events.length,
        hasMore: events.length > offset + validLimit,
      },
    });

  } catch (error) {
    console.error('Security events fetch error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to fetch security events'
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