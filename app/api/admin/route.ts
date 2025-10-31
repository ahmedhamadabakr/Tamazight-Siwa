import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';

// GET /api/admins - Get all admins with optional search
export async function GET(request: NextRequest) {
  try {
    // Skip build time check in development
    if (process.env.NODE_ENV !== 'development') {
      // Check if we're in build time only in production
      const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build';
      
      if (isBuildTime) {
        return NextResponse.json({
          success: false,
          error: 'API routes are not available during build time'
        }, { status: 503 });
      }
    }

    // Only connect to DB if not in build time
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({
        success: false,
        error: 'Database connection not configured'
      }, { status: 503 });
    }

    const db = await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    // Build query for admins only
    const query: any = {
      role: { $in: ['manager', 'admin'] }
    };

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const admins = await db.collection('users')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: admins
    });
  } catch (error) {
    console.error('Error fetching admins:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch admins'
    }, { status: 500 });
  }
}

// POST /api/admins - Create new admin
export async function POST(request: NextRequest) {
  try {
    // Skip build time check in development
    if (process.env.NODE_ENV !== 'development') {
      // Check if we're in build time only in production
      const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build';
      
      if (isBuildTime) {
        return NextResponse.json({
          success: false,
          error: 'API routes are not available during build time'
        }, { status: 503 });
      }
    }

    // Only connect to DB if not in build time
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({
        success: false,
        error: 'Database connection not configured'
      }, { status: 503 });
    }

    const db = await dbConnect();
    
    const body = await request.json();
    const { fullName, email, password, role, permissions } = body;

    // Validate required fields
    if (!fullName || !email || !password || !role) {
      return NextResponse.json({
        success: false,
        error: 'All fields are required'
      }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: 'Email already exists'
      }, { status: 400 });
    }

    // Create new admin
    const newAdmin = {
      fullName,
      email,
      password, // Note: In production, hash the password
      role,
      status: 'active',
      permissions: permissions || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('users').insertOne(newAdmin);

    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...newAdmin },
      message: 'Admin created successfully'
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create admin'
    }, { status: 500 });
  }
}
