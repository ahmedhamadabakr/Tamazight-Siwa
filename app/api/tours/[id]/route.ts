import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { title } from 'process';

// GET a single tour by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await dbConnect();
    const { id } = params;
    
    let query: any = {};
    
    // Check if the ID is a valid MongoDB ObjectId
    if (ObjectId.isValid(id)) {
      query._id = new ObjectId(id);
    } else {
      // If not a valid ObjectId, search by slug
      query.slug = id;
    }

    console.log('Searching for tour with query:', JSON.stringify(query));
    const tour = await db.collection('tours').findOne(query);
    console.log('Found tour:', tour);

    if (!tour) {
      return NextResponse.json(
        { success: false, error: 'الرحلة غير موجودة' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: tour });
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
  { params }: { params: { id: string } }
) {
  try {
    const db = await dbConnect();
    const { id } = params;
    const body = await request.json();

    if (!ObjectId.isValid(id)) {
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
      featured: Boolean(featured),
      status,
      updatedAt: new Date(),
    };

    const result = await db.collection('tours').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'الرحلة غير موجودة' },
        { status: 404 }
      );
    }

    const updatedTour = await db.collection('tours').findOne({ _id: new ObjectId(id) });

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
  { params }: { params: { id: string } }
) {
  try {
    const db = await dbConnect();
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'معرف الرحلة غير صالح' },
        { status: 400 }
      );
    }

    const result = await db.collection('tours').deleteOne({ _id: new ObjectId(id) });

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
