import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/models';
import {
  hashPassword,
  validatePasswordStrength,
  SecurityErrorCodes
} from '@/lib/security';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, email, phone, country, password } = body;
    if (!name || !email || !password || !country) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'All fields are required' } },
        { status: 400 }
      );
    }

    const passwordStrength = validatePasswordStrength(password, [name, email]);
    if (!passwordStrength.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: SecurityErrorCodes.WEAK_PASSWORD,
            message: 'Password is too weak',
            details: passwordStrength.feedback
          }
        },
        { status: 400 }
      );
    }

    const existingUser = await database.findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: { code: 'EMAIL_EXISTS', message: 'Email already registered' } },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);
    // Generate a 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    const newUser = await database.createUser({
      name,
      email,
      phone,
      country,
      password: hashedPassword,
      isActive: false,
    });

    if (!newUser._id) {
      throw new Error('Failed to create user: No user ID returned');
    }

    // Create a verification code entry
    await database.createVerificationCode({
      code: verificationCode,
      email,
      expires: expiry,
      used: false
    });

    // Send verification email with code
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Tamazight Siwa" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Your verification code - Tamazight Siwa',
      html: `
        <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; max-width: 560px; margin: 0 auto;">
          <h2 style="color:#111827;">Welcome ${name}!</h2>
          <p style="color:#374151;">Use the code below to verify your email. It is valid for 10 minutes.</p>
          <div style="margin:20px 0; font-size:28px; font-weight:700; letter-spacing:6px; text-align:center; color:#111827;">
            ${verificationCode}
          </div>
          <p style="color:#6B7280; font-size:14px;">If you didn’t request this, you can ignore this email.</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: 'Registration successful! Please verify your email.',
      data: { email, verificationRequired: true },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Something went wrong' } },
      { status: 500 }
    );
  }
}
