import { NextRequest, NextResponse } from 'next/server'
import { getServerAuthSession } from '@/lib/server-auth';



import { getFolderStats } from '@/lib/cloudinary'

export async function GET(request: NextRequest) {
  try {
    // Skip build time check in development
    if (process.env.NODE_ENV !== 'development') {
      // Check if we're in build time only in production
      const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build';
      
      if (isBuildTime) {
        return NextResponse.json({
          success: false,
          error: 'API routes are not available during build time'
        }, { status: 503 });
      }
    }

    // Only connect to DB if not in build time
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({
        success: false,
        error: 'Database connection not configured'
      }, { status: 503 });
    }

    const session = await getServerAuthSession() as any
    
    if (!session?.user || session.user.role !== 'manager') {
      return NextResponse.json(
        { success: false, message: 'You do not have permission to access this data' },
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
      { success: false, message: 'Error fetching Cloudinary stats' },
      { status: 500 }
    )
  }
}