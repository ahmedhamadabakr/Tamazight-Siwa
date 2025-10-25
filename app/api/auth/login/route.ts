import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/models';
import { 
  validateLoginData, 
  comparePassword, 
  generateTokenPair,
  SecurityErrorCodes
} from '@/lib/security';
import { rateLimitService } from '@/lib/security/rate-limit';
import { SECURITY_CONFIG } from '@/lib/security/config';

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting and logging
    const clientIP = rateLimitService.getClientIP(request);
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    // Parse and validate request body
    const body = await request.json();
    
    let validatedData;
    try {
      validatedData = validateLoginData(body);
    } catch (error) {
      return NextResponse.json(
        { 
          success: false, 
          error: {
            code: SecurityErrorCodes.INVALID_INPUT,
            message: 'Invalid input data',
            details: error instanceof Error ? error.message : 'Validation failed'
          }
        },
        { status: 400 }
      );
    }

    const { email, password, rememberMe } = validatedData;

    // Check rate limiting for IP
    const ipRateLimit = await rateLimitService.checkLoginAttempts(clientIP);
    if (!ipRateLimit.allowed) {
      await database.logSecurityEvent({
        eventType: 'RATE_LIMIT_EXCEEDED',
        ipAddress: clientIP,
        details: { identifier: clientIP, type: 'ip', retryAfter: ipRateLimit.retryAfter }
      });

      return NextResponse.json(
        { 
          success: false, 
          error: {
            code: SecurityErrorCodes.RATE_LIMIT_EXCEEDED,
            message: `Too many login attempts. Try again in ${ipRateLimit.retryAfter} seconds.`,
            details: { retryAfter: ipRateLimit.retryAfter }
          }
        },
        { 
          status: 429,
          headers: {
            'Retry-After': ipRateLimit.retryAfter?.toString() || '600'
          }
        }
      );
    }

    // Check rate limiting for email
    const emailRateLimit = await rateLimitService.checkLoginAttempts(email);
    if (!emailRateLimit.allowed) {
      await database.logSecurityEvent({
        eventType: 'RATE_LIMIT_EXCEEDED',
        ipAddress: clientIP,
        details: { identifier: email, type: 'email', retryAfter: emailRateLimit.retryAfter }
      });

      return NextResponse.json(
        { 
          success: false, 
          error: {
            code: SecurityErrorCodes.RATE_LIMIT_EXCEEDED,
            message: `Too many login attempts for this account. Try again in ${emailRateLimit.retryAfter} seconds.`,
            details: { retryAfter: emailRateLimit.retryAfter }
          }
        },
        { 
          status: 429,
          headers: {
            'Retry-After': emailRateLimit.retryAfter?.toString() || '600'
          }
        }
      );
    }

    // Find user by email
    const user = await database.findUserByEmail(email);
    if (!user) {
      await rateLimitService.recordLoginAttempt(clientIP, false);
      await rateLimitService.recordLoginAttempt(email, false);
      await database.logSecurityEvent({
        eventType: 'LOGIN_FAILED',
        ipAddress: clientIP,
        userAgent,
        details: { reason: 'user_not_found', email }
      });

      return NextResponse.json(
        { 
          success: false, 
          error: {
            code: SecurityErrorCodes.INVALID_CREDENTIALS,
            message: 'Invalid email or password'
          }
        },
        { status: 401 }
      );
    }

    // Check if account is locked
    if (user.lockoutUntil && user.lockoutUntil > new Date()) {
      const lockoutRemaining = Math.ceil((user.lockoutUntil.getTime() - Date.now()) / 1000);
      await database.logSecurityEvent({
        userId: user._id,
        eventType: 'ACCOUNT_LOCKED',
        ipAddress: clientIP,
        userAgent,
        details: { lockoutUntil: user.lockoutUntil, remainingSeconds: lockoutRemaining }
      });

      return NextResponse.json(
        { 
          success: false, 
          error: {
            code: SecurityErrorCodes.ACCOUNT_LOCKED,
            message: `Account is temporarily locked. Try again in ${lockoutRemaining} seconds.`,
            details: { retryAfter: lockoutRemaining }
          }
        },
        { 
          status: 423,
          headers: {
            'Retry-After': lockoutRemaining.toString()
          }
        }
      );
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      await rateLimitService.recordLoginAttempt(clientIP, false);
      await rateLimitService.recordLoginAttempt(email, false);
      await database.incrementLoginAttempts(email);
      
      // Check if account should be locked
      if (await rateLimitService.shouldLockAccount(email)) {
        await database.lockAccount(email, SECURITY_CONFIG.LOGIN_LOCKOUT_DURATION);
        await database.logSecurityEvent({
          userId: user._id,
          eventType: 'ACCOUNT_LOCKED',
          ipAddress: clientIP,
          userAgent,
          details: { reason: 'max_attempts_exceeded' }
        });
      }

      await database.logSecurityEvent({
        userId: user._id,
        eventType: 'LOGIN_FAILED',
        ipAddress: clientIP,
        userAgent,
        details: { reason: 'invalid_password' }
      });

      return NextResponse.json(
        { 
          success: false, 
          error: {
            code: SecurityErrorCodes.INVALID_CREDENTIALS,
            message: 'Invalid email or password'
          }
        },
        { status: 401 }
      );
    }

    // Check if user account is active
    if (!user.isActive) {
      await database.logSecurityEvent({
        userId: user._id,
        eventType: 'LOGIN_FAILED',
        ipAddress: clientIP,
        userAgent,
        details: { reason: 'account_inactive' }
      });

      return NextResponse.json(
        { 
          success: false, 
          error: {
            code: SecurityErrorCodes.EMAIL_NOT_VERIFIED,
            message: 'Account is not active. Please verify your email address.'
          }
        },
        { status: 401 }
      );
    }

    // Successful login - reset rate limits and login attempts
    await rateLimitService.recordLoginAttempt(clientIP, true);
    await rateLimitService.recordLoginAttempt(email, true);
    await database.resetLoginAttempts(email);
    await database.updateLastLogin(user._id!, clientIP);

    // Generate tokens
    const tokenPair = generateTokenPair(
      { id: user._id!.toString(), email: user.email, role: user.role },
      rememberMe
    );

    // Store refresh token
    await database.addRefreshToken(user._id!, {
      token: tokenPair.refreshToken,
      expiresAt: tokenPair.expiresAt,
      deviceInfo: userAgent,
      ipAddress: clientIP,
      createdAt: new Date()
    });

    await database.logSecurityEvent({
      userId: user._id,
      eventType: 'LOGIN_SUCCESS',
      ipAddress: clientIP,
      userAgent,
      details: { rememberMe }
    });

    // Prepare user response (without sensitive data)
    const userResponse = {
      id: user._id!.toString(),
      name: user.name,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      image: user.image,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt
    };

    // Set refresh token as HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      data: {
        user: userResponse,
        accessToken: tokenPair.accessToken,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
      }
    });

    // Set secure HTTP-only cookie for refresh token
    response.cookies.set('refreshToken', tokenPair.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: rememberMe ? 90 * 24 * 60 * 60 : 30 * 24 * 60 * 60, // 90 days or 30 days
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    
    // Log security event for unexpected errors
    try {
      const clientIP = rateLimitService.getClientIP(request);
      await database.logSecurityEvent({
        eventType: 'LOGIN_FAILED',
        ipAddress: clientIP,
        details: { reason: 'server_error', error: error instanceof Error ? error.message : 'Unknown error' }
      });
    } catch (logError) {
      console.error('Failed to log security event:', logError);
    }

    return NextResponse.json(
      { 
        success: false, 
        error: {
          code: 'SERVER_ERROR',
          message: 'An unexpected error occurred. Please try again.'
        }
      },
      { status: 500 }
    );
  }
}
