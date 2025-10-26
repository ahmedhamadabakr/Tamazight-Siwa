import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET a single tour by ID or slug
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await dbConnect();

    const { id } = params;

    let query: any = {};

    // Check if the id is a valid MongoDB ObjectId
    if (ObjectId.isValid(id) && String(new ObjectId(id)) === id) {
      query._id = new ObjectId(id);
    } else {
      // If not a valid ObjectId, search by slug
      query.slug = id;
    }

    const tour = await db.collection('tours').findOne(query);

  

    if (!tour) {
      return NextResponse.json(
        { success: false, error: 'Tour not found' },
        { status: 404 }
      );
    }

    // Convert ObjectId to string for JSON serialization and add id field
    const serializedTour = {
      ...tour,
      id: tour._id.toString(), // Add id field for frontend compatibility
      _id: tour._id.toString(),
      createdAt: tour.createdAt?.toISOString(),
      updatedAt: tour.updatedAt?.toISOString()
    };

    return NextResponse.json({ success: true, data: serializedTour });
  } catch (error) {
    console.error('Error fetching tour:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tour' },
      { status: 500 }
    );
  }
}

// PUT (update) a tour by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await dbConnect();
    const { id } = params;
    const body = await request.json();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Tour ID is invalid' },
        { status: 400 }
      );
    }

    const {
      title,
      slug: tourSlug,
      description,
      duration,
      price,
      location,
      images,
      category,
      difficulty,
      groupSize,
      highlights,
      featured,
      status,
      startDate,
      endDate
    } = body;

    // Basic validation
    if (!title || !description || !duration || !price || !location || !category) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate dates if provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (start >= end) {
        return NextResponse.json(
          { success: false, error: 'End date must be after start date' },
          { status: 400 }
        );
      }
    }

    const updateData: any = {
      title,
      slug: tourSlug,
      description,
      duration,
      price: Number(price),
      location,
      images: images || [],
      category,
      difficulty: difficulty || 'Easy',
      groupSize: groupSize || '',
      highlights: highlights || [],
      featured: Boolean(featured),
      status,
      updatedAt: new Date(),
    };

    // Add dates if provided
    if (startDate) {
      updateData.startDate = new Date(startDate);
    }
    if (endDate) {
      updateData.endDate = new Date(endDate);
    }

    const result = await db.collection('tours').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Tour not found' },
        { status: 404 }
      );
    }

    const updatedTour = await db.collection('tours').findOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true, data: updatedTour });
  } catch (error) {
    console.error('Error updating tour:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update tour' },
      { status: 500 }
    );
  }
}

// DELETE a tour by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await dbConnect();
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Tour ID is invalid' },
        { status: 400 }
      );
    }

    const result = await db.collection('tours').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Tour not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Tour deleted successfully' });
  } catch (error) {
    console.error('Error deleting tour:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete tour' },
      { status: 500 }
    );
  }
}