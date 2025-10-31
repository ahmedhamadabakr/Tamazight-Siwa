import { NextRequest, NextResponse } from 'next/server'

export async function PUT(_req: NextRequest) {
  return NextResponse.json(
    { success: false, message: 'Authentication is disabled' },
    { status: 404 }
  )
}

export async function GET(_req: NextRequest) {
  return NextResponse.json(
    { success: false, message: 'Authentication is disabled' },
    { status: 404 }
  )
}
