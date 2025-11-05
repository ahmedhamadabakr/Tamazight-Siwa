import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/models';
import { SecurityErrorCodes } from '@/lib/security';

// Simple function to get client IP
function getClientIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for') || 
         request.headers.get('x-real-ip') || 
         '127.0.0.1';
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for logging
    const clientIP = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    // Parse request body
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { 
          success: false, 
          error: {
            code: SecurityErrorCodes.INVALID_INPUT,
            message: 'Verification token is required'
          }
        },
        { status: 400 }
      );
    }

    // Verify email using the token
    const verifiedUser = await database.verifyEmail(token);

    if (!verifiedUser) {
      await database.logSecurityEvent({
        eventType: 'LOGIN_FAILED',
        details: { action: 'email_verification', reason: 'invalid_or_expired_token' }
      });

      return NextResponse.json(
        { 
          success: false, 
          error: {
            code: SecurityErrorCodes.TOKEN_INVALID,
            message: 'Invalid or expired verification token'
          }
        },
        { status: 400 }
      );
    }

    // Record successful verification
    await database.logSecurityEvent({
      userId: verifiedUser._id,
      eventType: 'LOGIN_SUCCESS',
      details: { action: 'email_verification', success: true }
    });

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully! Your account is now active.',
      data: {
        user: {
          id: verifiedUser._id!.toString(),
          name: verifiedUser.name,
          fullName: verifiedUser.fullName,
          email: verifiedUser.email,
          role: verifiedUser.role,
          isActive: verifiedUser.isActive,
          emailVerified: verifiedUser.emailVerified
        }
      }
    });

  } catch (error) {
    console.error('Email verification error:', error);
    
    // Log security event for unexpected errors
    try {
      const clientIP = getClientIP(request);
      await database.logSecurityEvent({
        eventType: 'LOGIN_FAILED',
        details: { action: 'email_verification', reason: 'server_error', error: error instanceof Error ? error.message : 'Unknown error' }
      });
    } catch (logError) {
      console.error('Failed to log security event:', logError);
    }

    return NextResponse.json(
      { 
        success: false, 
        error: {
          code: 'SERVER_ERROR',
          message: 'An unexpected error occurred during email verification. Please try again.'
        }
      },
      { status: 500 }
    );
  }
}

// Handle GET request for email verification via URL
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(new URL('/login?error=invalid_token', request.url));
    }

    // Get client IP for logging
    const clientIP = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    // Verify email using the token
    const verifiedUser = await database.verifyEmail(token);

    if (!verifiedUser) {
      await database.logSecurityEvent({
        eventType: 'LOGIN_FAILED',
        details: { action: 'email_verification_get', reason: 'invalid_or_expired_token' }
      });

      return NextResponse.redirect(new URL('/login?error=verification_failed', request.url));
    }

    // Log successful verification
    await database.logSecurityEvent({
      userId: verifiedUser._id,
      eventType: 'LOGIN_SUCCESS',
      details: { action: 'email_verification_get', success: true }
    });

    // Redirect to login page with success message
    return NextResponse.redirect(new URL('/login?verified=true', request.url));

  } catch (error) {
    console.error('Email verification GET error:', error);
    return NextResponse.redirect(new URL('/login?error=server_error', request.url));
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}