import { NextResponse } from 'next/server'
import { getMongoClient } from '@/lib/mongodb'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json()

    if (!token || !password) {
      return NextResponse.json(
        { success: false, message: 'الرمز المميز وكلمة المرور مطلوبان' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' },
        { status: 400 }
      )
    }

    const client = await getMongoClient()
    const db = client.db()

    // Find user with valid reset token
    const user = await db.collection('users').findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() } // Token not expired
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'الرابط غير صالح أو منتهي الصلاحية' },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Update user password and remove reset token
    await db.collection('users').updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date()
        },
        $unset: {
          resetToken: '',
          resetTokenExpiry: ''
        }
      }
    )

    return NextResponse.json({
      success: true,
      message: 'تم تغيير كلمة المرور بنجاح'
    })

  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في تغيير كلمة المرور' },
      { status: 500 }
    )
  }
}