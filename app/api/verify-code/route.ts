import { NextResponse } from 'next/server';
import { database } from '@/lib/models';
import { ObjectId } from 'mongodb';

interface VerificationRequest {
  email: string;
  code: string;
}

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json() as VerificationRequest;

    // Input validation
    if (!email || !code) {
      return NextResponse.json(
        { success: false, error: 'Email and verification code are required' },
        { status: 400 }
      );
    }
    // Find verification code
    const verificationCode = await database.findVerificationCode(code);

    if (!verificationCode) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired verification code' },
        { status: 400 }
      );
    }

    // Check if the email matches (case insensitive)
    if (verificationCode.email.toLowerCase() !== email.toLowerCase()) {

      return NextResponse.json(
        { success: false, error: 'Invalid email for this verification code' },
        { status: 400 }
      );
    }

    // Check if code is expired
    if (new Date() > new Date(verificationCode.expires)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Verification code expired. Please request a new code.',
        },
        { status: 400 }
      );
    }

    // Check if code has already been used
    if (verificationCode.used) {
      return NextResponse.json(
        {
          success: false,
          error: 'This verification code has already been used. Please request a new code if you need to verify again.',
        },
        { status: 400 }
      );
    }

    // Find existing user created during registration
    const user = await database.findUserByEmail(email);
    if (!user || !user._id) {
      return NextResponse.json(
        { success: false, error: 'User not found. Please register again.' },
        { status: 404 }
      );
    }

    // Activate the user and mark email as verified
    await database.updateUser(user._id as unknown as ObjectId, {
      isActive: true,
      emailVerified: new Date(),
    });

    // Mark verification code as used
    await database.updateVerificationCode(verificationCode.code, { used: true });

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully! You can now log in.'
    });

  } catch (error: any) {
    console.error('Verification error:', error);
    return NextResponse.json({
      success: false,
      error: 'An error occurred while verifying the code',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}
