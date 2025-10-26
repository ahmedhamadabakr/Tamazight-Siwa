import { NextResponse } from 'next/server';
import { database } from '@/lib/models';
import { hash } from 'bcryptjs';

interface VerificationRequest {
  email: string;
  code: string;
  name: string;
  password: string;
}

interface VerificationCode {
  code: string;
  email: string;
  expires: Date;
  used: boolean;
  _id?: string;
}

export async function POST(req: Request) {
  try {
    const { email, code, name, password } = await req.json() as VerificationRequest;

    // Input validation
    if (!email || !code || !name || !password) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }
    // Find verification code (case insensitive)
    const verificationCode = await database.findVerificationCode(code);

    if (!verificationCode) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code' },
        { status: 400 }
      );
    }

    // Check if the email matches (case insensitive)
    if (verificationCode.email.toLowerCase() !== email.toLowerCase()) {

      return NextResponse.json(
        { error: 'Invalid email for this verification code' },
        { status: 400 }
      );
    }

    // Check if code exists
    if (!verificationCode) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid verification code',
          debug: 'Could not fetch verification codes'
        },
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

    // Check if email already exists
    const existingUser = await database.findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'This email is already in use' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await hash(password, 12);

    // Create the user account
    const user = await database.createUser({
      name,
      email,
      password: hashedPassword,
      emailVerified: new Date(),
      isActive: true,
    });

    // Mark verification code as used
    await database.updateVerificationCode(verificationCode.code, { used: true });

    return NextResponse.json({
      success: true,
      message: 'Account created successfully! You can now log in.',
      user: {
        id: user._id?.toString() || null,
        name: user.name,
        email: user.email
      }
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
