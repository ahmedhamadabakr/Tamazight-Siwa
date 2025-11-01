import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { GalleryImage, validateGalleryImage } from '@/models/Gallery';
import { getServerAuthSession } from '@/lib/server-auth';

import { ObjectId } from 'mongodb';

// GET - Fetch single gallery image
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await dbConnect();
    const collection = db.collection('gallery');

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid image ID' },
        { status: 400 }
      );
    }

    const image = await collection.findOne({ _id: new ObjectId(params.id) });

    if (!image) {
      return NextResponse.json(
        { success: false, message: 'Image not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: image
    });

  } catch (error) {
    console.error('Error fetching gallery image:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch image' },
      { status: 500 }
    );
  }
}

// PUT - Update gallery image
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid image ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, description, imageUrl, category, isActive } = body;

    // Build update object
    const updateData: any = { updatedAt: new Date() };
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (category !== undefined) updateData.category = category;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Validate if we have data to validate
    if (title || imageUrl || category) {
      const validation = validateGalleryImage({ title, description, imageUrl, category, isActive });
      if (!validation.isValid) {
        return NextResponse.json(
          { success: false, message: validation.errors.join(', ') },
          { status: 400 }
        );
      }
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Image not found' },
        { status: 404 }
      );
    }

    const updatedImage = await collection.findOne({ _id: new ObjectId(params.id) });

    return NextResponse.json({
      success: true,
      data: updatedImage,
      message: 'Image updated successfully'  
    });

  } catch (error) {
    console.error('Error updating gallery image:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update image' },
      { status: 500 }
    );
  }
}

// DELETE - Delete gallery image
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid image ID' },
        { status: 400 }
      );
    }

    // First, get the image to retrieve publicId for Cloudinary deletion
    const image = await collection.findOne({ _id: new ObjectId(params.id) });
    
    if (!image) {
      return NextResponse.json(
        { success: false, message: 'Image not found' },
        { status: 404 }
      );
    }

    // Delete from database first
    const result = await collection.deleteOne({ _id: new ObjectId(params.id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Failed to delete image from database' },
        { status: 500 }
      );
    }

    // If image has publicId, try to delete from Cloudinary
    if (image.publicId) {
      try {
        const deleteResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/upload?publicId=${image.publicId}`, {
          method: 'DELETE',
        });
        
        if (!deleteResponse.ok) {
          console.warn('Failed to delete image from Cloudinary, but database deletion succeeded');
        }
      } catch (cloudinaryError) {
        console.warn('Error deleting from Cloudinary:', cloudinaryError);
        // Continue anyway since database deletion succeeded
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting gallery image:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete image' },
      { status: 500 }
    );
  }
}