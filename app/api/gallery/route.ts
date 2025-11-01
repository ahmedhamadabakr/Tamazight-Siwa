import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { GalleryImage, validateGalleryImage } from '@/models/Gallery';
import { getServerAuthSession } from '@/lib/server-auth';

// GET - Fetch all gallery images
export async function GET(request: NextRequest) {
  try {
    const db = await dbConnect();
    const collection = db.collection('gallery');

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const isPublic = searchParams.get('public') === 'true';
    const showHidden = searchParams.get('showHidden') === 'true';

    let query: any = {};

    // If it's a public request, only show active images (unless showHidden is true)
    if (isPublic && !showHidden) {
      query.isActive = true;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    const images = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: images
    });

  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}

// POST - Create new gallery image
export async function POST(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    
    if (!session?.user || session.user.role !== 'manager') {
      return NextResponse.json(
        { success: false, message: 'You are not authorized to perform this action' },

        { status: 403 }
      );
    }

    const db = await dbConnect();
    const collection = db.collection('gallery');

    const body = await request.json();
    const { title, description, imageUrl, category, isActive } = body;

    // Validation
    const validation = validateGalleryImage({ title, description, imageUrl, category, isActive });
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, message: validation.errors.join(', ') },
        { status: 400 }
      );
    }

    const newImage: GalleryImage = {
      title: title.trim(),
      description: description?.trim() || '',
      imageUrl,
      category,
      isActive: isActive !== undefined ? isActive : true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await collection.insertOne(newImage as any);
    const insertedImage = await collection.findOne({ _id: result.insertedId });

    return NextResponse.json({
      success: true,
      data: insertedImage,
      message: 'Image added successfully'
    });
    
  } catch (error) {
    console.error('Error creating gallery image:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to add image' },
      { status: 500 }
    );
  }
}