import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/models';
import { hashPassword } from '@/lib/security/password';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email = 'test@example.com', password = 'Test123!', role = 'user' } = body;
    
    // Check if user already exists
    const existingUser = await database.findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: 'User already exists',
        user: {
          email: existingUser.email,
          role: existingUser.role,
          isActive: existingUser.isActive,
        }
      });
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Create test user
    const newUser = await database.createUser({
      name: 'Test User',
      fullName: 'Test User Full Name',
      email,
      password: hashedPassword,
      country: 'Test Country',
      role: role as 'user' | 'manager' | 'admin',
      isActive: true,
    });
    
    return NextResponse.json({
      success: true,
      message: 'Test user created successfully',
      user: {
        id: (newUser as any).insertedId || 'created',
        email,
        role,
        isActive: true,
      },
      credentials: {
        email,
        password, // Only for testing!
      }
    });
  } catch (error) {
    console.error('Create test user error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}