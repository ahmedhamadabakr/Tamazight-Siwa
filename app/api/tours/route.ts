import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';

// GET all tours or search by name
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    const db = await dbConnect();

    let query: any = {};

    if (title) {
      // Search for tours by title (case-insensitive, partial match)
      query.$or = [
        { titleAr: { $regex: title, $options: 'i' } },
        { titleEn: { $regex: title, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    // If no filters, return all tours
    const tours = await db.collection('tours')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, data: tours });
  } catch (error) {
    console.error('Error fetching tours:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tours' },
      { status: 500 }
    );
  }
}

// POST a new tour
export async function POST(request: NextRequest) {
  try {
    const db = await dbConnect();
    const body = await request.json();

    const {
      titleAr,
      titleEn,
      descriptionAr,
      descriptionEn,
      duration,
      price,
      location,
      images,
      category,
      featured = false,
      status = 'active'
    } = body;

    // Basic validation
    if (!titleAr || !titleEn || !descriptionAr || !descriptionEn || !duration || !price || !location || !category) {
      return NextResponse.json(
        { success: false, error: 'جميع الحقول مطلوبة' },
        { status: 400 }
      );
    }

    const tourData = {
      titleAr,
      titleEn,
      descriptionAr,
      descriptionEn,
      duration,
      price: Number(price),
      location,
      images: images || [],
      category,
      featured: Boolean(featured),
      status,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('tours').insertOne(tourData);
    const newTour = { _id: result.insertedId, ...tourData };

    return NextResponse.json({ success: true, data: newTour }, { status: 201 });
  } catch (error) {
    console.error('Error creating tour:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في إنشاء الرحلة' },
      { status: 500 }
    );
  }
}