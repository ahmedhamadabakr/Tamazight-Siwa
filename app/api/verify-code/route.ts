import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
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
        { success: false, error: 'جميع الحقول مطلوبة' },
        { status: 400 }
      );
    }

    console.log('Verification attempt:', { 
      email, 
      name: name ? 'provided' : 'missing',
      password: password ? 'provided' : 'missing'
    });

    // Find verification code (case insensitive)
    const verificationCode = await prisma.findVerificationCode(code);
    
    if (!verificationCode) {
      console.log('No matching verification code found');
      return NextResponse.json(
        { error: 'Invalid or expired verification code' },
        { status: 400 }
      );
    }
    
    // Check if the email matches (case insensitive)
    if (verificationCode.email.toLowerCase() !== email.toLowerCase()) {
      console.log('Email does not match verification code');
      return NextResponse.json(
        { error: 'Invalid email for this verification code' },
        { status: 400 }
      );
    }
    
    // Debug log
    console.log('Matching verification code:', {
      code: verificationCode.code,
      email: verificationCode.email,
      expires: verificationCode.expires,
      used: verificationCode.used,
      now: new Date().toISOString(),
      isExpired: verificationCode ? new Date() > new Date(verificationCode.expires) : 'N/A'
    });

    // Check if code exists
    if (!verificationCode) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'رمز التحقق غير صحيح',
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
          error: 'انتهت صلاحية رمز التحقق. يرجى طلب رمز جديد.',
        },
        { status: 400 }
      );
    }

    // Check if code has already been used
    if (verificationCode.used) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'هذا الرمز مستخدم بالفعل. يرجى طلب رمز جديد إذا كنت بحاجة إلى التحقق مرة أخرى.',
        },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'هذا البريد الإلكتروني مستخدم بالفعل' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await hash(password, 12);

    // Create the user account
    const user = await prisma.createUser({
      name,
      email,
      password: hashedPassword,
      emailVerified: new Date(),
      isActive: true,
    });

    // Mark verification code as used
    await prisma.updateVerificationCode(verificationCode.code, { used: true });

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.',
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
      error: 'حدث خطأ أثناء التحقق من الرمز',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}
