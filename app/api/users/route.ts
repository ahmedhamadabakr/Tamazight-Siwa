import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';

// GET all join requests (for admin purposes)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const status = searchParams.get('status');

    const db = await dbConnect();

    const query: any = {};
    if (name) {
      query.$or = [
        { fullName: { $regex: name, $options: 'i' } },
        { email: { $regex: name, $options: 'i' } },
        { phone: { $regex: name, $options: 'i' } },
      ];
    }
    if (status) {
      query.status = status;
    }

    const applications = await db
      .collection('users')
      .find(query)
      .sort({ createdAt: 1 })
      .toArray();

    return NextResponse.json({ success: true, data: applications });
  } catch (error) {
    console.error('Error fetching join applications:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch join applications' },
      { status: 500 }
    );
  }
}

// POST a new join application
export async function POST(request: NextRequest) {
  try {
    const db = await dbConnect();
    const body = await request.json();

    const {
      fullName,
      email,
      phone,
      studentId,
      year,
      major,
      specialization,
      experience,
      motivation,
      portfolio,
      availability,
      agreeTerms
    } = body;

    // Basic validation
    if (!fullName || !email || !phone || !studentId || !year || !major || !specialization || !experience || !motivation || !agreeTerms) {
      return NextResponse.json(
        { success: false, error: 'all fields are required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingApplication = await db.collection('users').findOne({ email });
    if (existingApplication) {
      return NextResponse.json(
        { success: false, error: 'email already exists' },
        { status: 400 }
      );
    }

    const userData = {
      fullName,
      email,
      phone,
      studentId,
      year,
      major,
      specialization,
      experience,
      motivation,
      portfolio: portfolio || '', // Optional field
      availability,
      agreeTerms,
      status: 'pending', // Default status for new applications
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('users').insertOne(userData);
    const newUser = { _id: result.insertedId, ...userData };
    
    return NextResponse.json({ success: true, data: newUser }, { status: 201 });
  } catch (error) {
    console.error('Error creating join application:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create join application' },
      { status: 500 }
    );
  }
}
