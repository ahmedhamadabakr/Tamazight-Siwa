import { NextRequest, NextResponse } from 'next/server';

function isSecureCookie(): boolean {
  try {
    const url = process.env.NEXTAUTH_URL || '';
    return url.startsWith('https://');
  } catch {
    return process.env.NODE_ENV === 'production';
  }
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { success: false, error: { code: 'DEPRECATED', message: 'Authentication is disabled.' } },
    { status: 410 }
  );
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}