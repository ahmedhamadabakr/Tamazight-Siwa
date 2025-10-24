import { NextResponse } from 'next/server'
import { getMongoClient } from '@/lib/mongodb'

export async function POST(req: Request) {
  try {
    const { token } = await req.json()

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token is required' },
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
        { success: false, message: 'Invalid or expired token' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Token is valid'
    })

  } catch (error) {
    console.error('Verify reset token error:', error)
    return NextResponse.json(
      { success: false, message: 'An error occurred while verifying reset token' },
      { status: 500 }
    )
  }
}