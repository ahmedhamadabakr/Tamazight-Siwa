import { NextRequest, NextResponse } from 'next/server';



export async function POST(request: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      error: { code: 'DEPRECATED', message: 'This endpoint is disabled. Use NextAuth credentials signIn.' }
    },
    { status: 410 }
  );
}
