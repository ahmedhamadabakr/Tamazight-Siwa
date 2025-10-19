import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { getAuthOptions } from '@/lib/auth'
import { getFolderStats } from '@/lib/cloudinary'

export async function GET(request: NextRequest) {
  try {
    const authOptions = await getAuthOptions()
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'manager') {
      return NextResponse.json(
        { success: false, message: 'غير مصرح لك بتنفيذ هذا الإجراء' },
        { status: 403 }
      )
    }

    const stats = await getFolderStats('siwa/gallery')

    return NextResponse.json({
      success: true,
      stats
    })

  } catch (error) {
    console.error('Error fetching Cloudinary stats:', error)
    return NextResponse.json(
      { success: false, message: 'فشل في جلب إحصائيات Cloudinary' },
      { status: 500 }
    )
  }
}