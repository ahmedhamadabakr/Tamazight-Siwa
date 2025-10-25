import { NextResponse } from 'next/server';
import { database } from '@/lib/models';
import { hash } from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Verification code is required' },
        { status: 400 }
      );
    }

    // Find the verification token
    const verificationToken = await database.findVerificationToken(token);

    if (!verificationToken) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired verification code' },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (new Date() > verificationToken.expires) {
      return NextResponse.json(
        { success: false, error: 'Verification code expired' },
        { status: 400 }
      );
    }

    // Hash the password if provided
    let hashedPassword = null;
    if (password) {
      hashedPassword = await hash(password, 12);
    }

    // Find the user by ID and update
    const user = await database.findUserById(verificationToken.userId);
    if (user) {
      await database.updateUser(verificationToken.userId, {
        emailVerified: new Date(),
        isActive: true,
        ...(hashedPassword && { password: hashedPassword })
      });
    }

    // Delete the used verification token
    await database.deleteVerificationToken(token);

    return NextResponse.json({
      success: true,
      message: 'Account activated successfully! You can now log in.'
    });

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred while verifying the email' },
      { status: 500 }
    );
  }
}
