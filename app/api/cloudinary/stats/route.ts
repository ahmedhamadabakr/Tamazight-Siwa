import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { getAuthOptions } from '@/lib/auth'
import { getFolderStats } from '@/lib/cloudinary'

export async function GET(request: NextRequest) {
  try {
    // Check if we're in build time - use multiple indicators
    const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' ||
                       process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === undefined;

    if (isBuildTime) {
      return NextResponse.json({
        success: false,
        error: 'API routes are not available during build time'
      }, { status: 503 });
    }

    // Only connect to DB if not in build time
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({
        success: false,
        error: 'Database connection not configured'
      }, { status: 503 });
    }

    const authOptions = await getAuthOptions()
    const session = await getServerSession(authOptions) as any
    
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