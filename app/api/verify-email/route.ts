import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'رمز التحقق مطلوب' },
        { status: 400 }
      );
    }

    // Find the verification token
    const verificationToken = await prisma.findVerificationToken(token);

    if (!verificationToken) {
      return NextResponse.json(
        { success: false, error: 'رابط التفعيل غير صالح أو منتهي الصلاحية' },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (new Date() > verificationToken.expires) {
      return NextResponse.json(
        { success: false, error: 'انتهت صلاحية رابط التفعيل' },
        { status: 400 }
      );
    }

    // Hash the password if provided
    let hashedPassword = null;
    if (password) {
      hashedPassword = await hash(password, 12);
    }

    // Find the user by ID and update
    const user = await prisma.findUserById(verificationToken.userId);
    if (user) {
      await prisma.updateUser(verificationToken.userId, {
        emailVerified: new Date(),
        isActive: true,
        ...(hashedPassword && { password: hashedPassword })
      });
    }

    // Delete the used verification token
    await prisma.deleteVerificationToken(token);

    return NextResponse.json({
      success: true,
      message: 'تم تفعيل الحساب بنجاح! يمكنك الآن تسجيل الدخول.'
    });

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء التحقق من البريد الإلكتروني' },
      { status: 500 }
    );
  }
}
