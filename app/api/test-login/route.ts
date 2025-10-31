import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/models';
import { comparePassword } from '@/lib/security/password';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    console.log('Test login attempt for:', email);
    
    // Find user
    const user = await database.findUserByEmail(email);
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }
    
    console.log('User found:', { id: user._id, email: user.email, role: user.role });
    
    // Check password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({
        success: false,
        error: 'Invalid password'
      }, { status: 401 });
    }
    
    console.log('Password valid for user:', user.email);
    
    return NextResponse.json({
      success: true,
      user: {
        id: user._id?.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        isActive: user.isActive
      }
    });
    
  } catch (error) {
    console.error('Test login error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}