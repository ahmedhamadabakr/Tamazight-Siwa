import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/models';
import {
  validateRegistrationData,
  hashPassword,
  validatePasswordStrength,
  generateEmailVerificationToken,
  SecurityErrorCodes
} from '@/lib/security';
import { rateLimitService } from '@/lib/security/rate-limit';
import { SECURITY_CONFIG } from '@/lib/security/config';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = rateLimitService.getClientIP(request);
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    // Check rate limiting for registration (3 attempts per hour per IP)
    const ipRateLimit = await rateLimitService.checkLoginAttempts(`register_${clientIP}`);
    if (!ipRateLimit.allowed) {
      await database.logSecurityEvent({
        eventType: 'RATE_LIMIT_EXCEEDED',
        ipAddress: clientIP,
        userAgent,
        details: { identifier: `register_${clientIP}`, type: 'registration', retryAfter: ipRateLimit.retryAfter }
      });

      return NextResponse.json(
        {
          success: false,
          error: {
            code: SecurityErrorCodes.RATE_LIMIT_EXCEEDED,
            message: `Too many registration attempts. Try again in ${ipRateLimit.retryAfter} seconds.`,
            details: { retryAfter: ipRateLimit.retryAfter }
          }
        },
        {
          status: 429,
          headers: {
            'Retry-After': ipRateLimit.retryAfter?.toString() || '3600'
          }
        }
      );
    }

    // Parse and validate request body
    const body = await request.json();

    let validatedData;
    try {
      validatedData = validateRegistrationData(body);
    } catch (error) {
      await rateLimitService.recordLoginAttempt(`register_${clientIP}`, false);
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

    const { name, email, password } = validatedData;

    // Additional password strength validation with user context
    const passwordStrength = validatePasswordStrength(password, [name, email]);
    if (!passwordStrength.isValid) {
      await rateLimitService.recordLoginAttempt(`register_${clientIP}`, false);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: SecurityErrorCodes.WEAK_PASSWORD,
            message: 'Password is too weak',
            details: {
              score: passwordStrength.score,
              feedback: passwordStrength.feedback
            }
          }
        },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await database.findUserByEmail(email);
    if (existingUser) {
      await rateLimitService.recordLoginAttempt(`register_${clientIP}`, false);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: SecurityErrorCodes.INVALID_INPUT,
            message: 'This email is already registered'
          }
        },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate email verification token
    const verificationToken = generateEmailVerificationToken();
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user (inactive until email verification)
    const newUser = await database.createUser({
      name,
      email,
      password: hashedPassword,
      isActive: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpiry: verificationExpiry,
    });

    // Create verification link
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const verificationLink = `${baseUrl}/verify-email?token=${verificationToken}`;

    // Send verification email
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      const mailOptions = {
        from: `"Tamazight Siwa" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Verify your email address - Tamazight Siwa',
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px solid #f0f0f0;">
              <h1 style="color: #2d3748; margin-bottom: 10px;">Welcome to Tamazight Siwa</h1>
              <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">Thank you for registering with us. Please verify your email address to activate your account.</p>
            </div>
            
            <div style="margin: 30px 0; padding: 20px; background-color: #f8f9fa; border-radius: 8px; text-align: center;">
              <p style="color: #2d3748; font-size: 16px; margin-bottom: 20px;">Click the button below to verify your email:</p>
              <a href="${verificationLink}" style="display: inline-block; background-color: #4299e1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Verify Email Address</a>
            </div>
            
            <div style="margin: 30px 0; padding: 15px; background-color: #f0f9ff; border-radius: 6px; border-left: 4px solid #4299e1;">
              <p style="color: #0369a1; margin: 0; font-size: 14px; line-height: 1.6;">
                <strong>Security Note:</strong> This verification link will expire in 24 hours. If you didn't create this account, please ignore this email.
              </p>
            </div>
            
            <div style="margin: 30px 0; padding: 15px; background-color: #fff3cd; border-radius: 6px; border-left: 4px solid #ffc107;">
              <p style="color: #856404; margin: 0; font-size: 14px; line-height: 1.6;">
                <strong>Can't click the button?</strong> Copy and paste this link into your browser:
                <br>
                <a href="${verificationLink}" style="color: #4299e1; word-break: break-all;">${verificationLink}</a>
              </p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="color: #718096; font-size: 14px; line-height: 1.6;">
                If you have any questions, please contact our support team:
                <br>
                <a href="mailto:support@tamazight-siwa.com" style="color: #4299e1; text-decoration: none;">support@tamazight-siwa.com</a>
              </p>
              <p style="color: #a0aec0; font-size: 12px; margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 15px;">
                © ${new Date().getFullYear()} Tamazight Siwa. All rights reserved.
              </p>
            </div>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);

      // Clean up the created user if email fails
      await database.updateUser(newUser._id!, {
        emailVerificationToken: undefined,
        emailVerificationExpiry: undefined
      });

      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'EMAIL_SEND_FAILED',
            message: 'Failed to send verification email. Please try again.'
          }
        },
        { status: 500 }
      );
    }

    // Record successful registration attempt
    await rateLimitService.recordLoginAttempt(`register_${clientIP}`, true);

    // Log security event
    await database.logSecurityEvent({
      userId: newUser._id,
      eventType: 'LOGIN_SUCCESS', // Using LOGIN_SUCCESS for registration success
      ipAddress: clientIP,
      userAgent,
      details: { action: 'registration', emailSent: true }
    });

    return NextResponse.json({
      success: true,
      message: 'Registration successful! Please check your email to verify your account.',
      data: {
        email: email,
        verificationRequired: true
      }
    });

  } catch (error) {
    console.error('Registration error:', error);

    // Log security event for unexpected errors
    try {
      const clientIP = rateLimitService.getClientIP(request);
      await database.logSecurityEvent({
        eventType: 'LOGIN_FAILED',
        ipAddress: clientIP,
        details: { action: 'registration', reason: 'server_error', error: error instanceof Error ? error.message : 'Unknown error' }
      });
    } catch (logError) {
      console.error('Failed to log security event:', logError);
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'An unexpected error occurred during registration. Please try again.'
        }
      },
      { status: 500 }
    );
  }
}