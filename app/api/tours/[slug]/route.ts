import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET a single tour by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    console.log('GET /api/tours/[slug] - Received slug:', params.slug);
    console.log('Request headers:', Object.fromEntries(request.headers.entries()));
    
    const db = await dbConnect();
    console.log('Database connected successfully');
    
    const { slug } = params;
    
    let query: any = {};
    
    // Check if the slug is a valid MongoDB ObjectId
    if (ObjectId.isValid(slug) && String(new ObjectId(slug)) === slug) {
      query._id = new ObjectId(slug);
      console.log('Using ObjectId query:', query);
    } else {
      // If not a valid ObjectId, search by slug
      query.slug = slug;
      console.log('Using slug query:', query);
    }

    console.log('Searching for tour with query:', query);
    
    // Check if collection exists and has documents
    const collectionStats = await db.collection('tours').countDocuments();
    console.log('Total tours in collection:', collectionStats);
    
    const tour = await db.collection('tours').findOne(query);
    console.log('Found tour:', tour ? 'Yes' : 'No');
    
    if (tour) {
      console.log('Tour details:', {
        _id: tour._id,
        title: tour.title,
        description: tour.description,
        duration: tour.duration,
        price: tour.price,
        location: tour.location,
        images: tour.images,
        category: tour.category,
        difficulty: tour.difficulty,
        groupSize: tour.groupSize,
        highlights: tour.highlights,
        featured: tour.featured,
        status: tour.status,
        createdAt: tour.createdAt,
        updatedAt: tour.updatedAt

      });
    }

    if (!tour) {
      console.log('Tour not found with query:', query);
      return NextResponse.json(
        { success: false, error: 'Tour not found' },
        { status: 404 }
      );
    }

    // Convert ObjectId to string for JSON serialization
    const serializedTour = {
      ...tour,
      _id: tour._id.toString(),
      createdAt: tour.createdAt?.toISOString(),
      updatedAt: tour.updatedAt?.toISOString()
    };

    return NextResponse.json({ success: true, data: serializedTour });
  } catch (error) {
    console.error('Error fetching tour:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب الرحلة' },
      { status: 500 }
    );
  }
}

// PUT (update) a tour by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const db = await dbConnect();
    const { slug } = params;
    const body = await request.json();

    if (!ObjectId.isValid(slug)) {
      return NextResponse.json(
        { success: false, error: 'معرف الرحلة غير صالح' },
        { status: 400 }
      );
    }

    const {
      title,
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
      status
    } = body;

    // Basic validation
    if (!title || !description || !duration || !price || !location || !category) {
      return NextResponse.json(
        { success: false, error: 'جميع الحقول مطلوبة' },
        { status: 400 }
      );
    }

    const updateData = {
      title,
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

    const result = await db.collection('tours').updateOne(
      { _id: new ObjectId(slug) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'الرحلة غير موجودة' },
        { status: 404 }
      );
    }

    const updatedTour = await db.collection('tours').findOne({ _id: new ObjectId(slug) });

    return NextResponse.json({ success: true, data: updatedTour });
  } catch (error) {
    console.error('Error updating tour:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في تحديث الرحلة' },
      { status: 500 }
    );
  }
}

// DELETE a tour by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const db = await dbConnect();
    const { slug } = params;

    if (!ObjectId.isValid(slug)) {
      return NextResponse.json(
        { success: false, error: 'معرف الرحلة غير صالح' },
        { status: 400 }
      );
    }

    const result = await db.collection('tours').deleteOne({ _id: new ObjectId(slug) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'الرحلة غير موجودة' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'تم حذف الرحلة بنجاح' });
  } catch (error) {
    console.error('Error deleting tour:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في حذف الرحلة' },
      { status: 500 }
    );
  }
}
