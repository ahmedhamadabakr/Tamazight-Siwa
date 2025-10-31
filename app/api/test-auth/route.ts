import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/models';
import { validateLoginData } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Test validation
    const validatedData = validateLoginData({
      email: body.email,
      password: body.password,
      rememberMe: false
    });
    
    // Test database user lookup
    const user = await database.findUserByEmail(validatedData.email);
    
    return NextResponse.json({
      success: true,
      message: 'Auth test completed',
      validatedData,
      userFound: !!user,
      userRole: user?.role || null,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Auth test error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown auth error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}