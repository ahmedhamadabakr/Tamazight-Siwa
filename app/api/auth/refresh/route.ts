import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/models';
import { 
  generateAccessToken,
  generateRefreshToken,
  SecurityErrorCodes 
} from '@/lib/security';
import { rateLimitService } from '@/lib/security/rate-limit';

export async function POST(request: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      error: { code: 'DEPRECATED', message: 'This endpoint is disabled. Use NextAuth session instead.' }
    },
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