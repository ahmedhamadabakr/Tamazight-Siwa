import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { getAuthOptions } from '@/lib/auth'

export async function POST(req: Request) {
  console.log('=== TEST BOOKING API CALLED ===')
  
  try {
    const session = await getServerSession(await getAuthOptions()) as any
    console.log('Session in test API:', session ? 'exists' : 'null')
    
    const data = await req.json()
    console.log('Data received in test API:', data)
    
    return NextResponse.json({
      success: true,
      message: 'Test API working',
      receivedData: data,
      sessionExists: !!session,
      userId: session?.user?.id || null
    })
    
  } catch (error) {
    console.error('Test API error:', error)
    return NextResponse.json(
      { success: false, message: 'Test API failed', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}