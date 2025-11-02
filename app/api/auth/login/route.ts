import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/models';
import { 
  validateLoginData, 
  comparePassword, 
  generateTokenPair,
  SecurityErrorCodes
} from '@/lib/security';
import { rateLimitService } from '@/lib/security/rate-limit';
import { SECURITY_CONFIG } from '@/lib/security/config';


export async function POST(request: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      error: { code: 'DEPRECATED', message: 'This endpoint is disabled. Use NextAuth credentials signIn.' }
    },
    { status: 410 }
  );
}
