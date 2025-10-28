import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/models';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const user = await database.findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Generate a new 6-digit code and store it
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    await database.createVerificationCode({
      code: verificationCode,
      email,
      expires: expiry,
      used: false,
    });

    // Send email
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
      subject: 'Your new verification code - Tamazight Siwa',
      html: `
        <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; max-width: 560px; margin: 0 auto;">
          <h2 style="color:#111827;">Email verification</h2>
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
      message: 'Verification code resent successfully.',
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
