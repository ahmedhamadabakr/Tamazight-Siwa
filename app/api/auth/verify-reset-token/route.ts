import { NextResponse } from 'next/server'
import { getMongoClient } from '@/lib/mongodb'

export async function POST(req: Request) {
  try {
    const { token } = await req.json()

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'الرمز المميز مطلوب' },
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

    return NextResponse.json({
      success: true,
      message: 'الرمز المميز صالح'
    })

  } catch (error) {
    console.error('Verify reset token error:', error)
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في التحقق من الرمز المميز' },
      { status: 500 }
    )
  }
}