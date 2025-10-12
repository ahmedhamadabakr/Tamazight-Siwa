import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const db = await dbConnect();
    const body = await request.json();

    const {
      fullName,
      email,
      password,
      phone,
      confirmPassword
    } = body;

    // Validation
    if (!fullName || !email || !password || !phone) {
      return NextResponse.json(
        { success: false, error: 'جميع الحقول مطلوبة' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'كلمات المرور غير متطابقة' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'البريد الإلكتروني موجود بالفعل' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user data
    const userData = {
      fullName,
      email,
      password: hashedPassword,
      phone,
      role: 'user', // Default role for new registrations
      status: 'active', // Auto-activate new users, or you can set to 'pending' for admin approval
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save to database
    const result = await db.collection('users').insertOne(userData);
    const newUser = { _id: result.insertedId, ...userData };

    // Return user data (without password)
    const userResponse = {
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      createdAt: newUser.createdAt
    };

    return NextResponse.json({
      success: true,
      data: userResponse,
      message: 'تم إنشاء الحساب بنجاح'
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في إنشاء الحساب' },
      { status: 500 }
    );
  }
}
