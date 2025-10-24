import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { getAuthOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(await getAuthOptions()) as any

    return NextResponse.json({
      success: true,
      debug: {
        hasSession: !!session,
        hasUser: !!session?.user,
        userId: session?.user?.id,
        userEmail: session?.user?.email,
        userRole: session?.user?.role,
        userName: session?.user?.name,
        allUserFields: session?.user ? Object.keys(session.user) : []
      }
    })

  } catch (error) {
    console.error('Debug session error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}