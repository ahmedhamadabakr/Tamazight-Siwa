import { NextRequest, NextResponse } from 'next/server'
import { getServerAuthSession } from '@/lib/server-auth';



import dbConnect from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { reviewCollectionName } from '@/models/Review'

interface CustomSession {
  user?: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
  }
}

// GET - Fetch single review
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await dbConnect()
    const collection = db.collection(reviewCollectionName)

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid review ID' },
        { status: 400 }
      )
    }

    const review = await collection.findOne({ _id: ObjectId.createFromHexString(params.id) })

    if (!review) {
      return NextResponse.json(
        { success: false, message: 'Review not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: review
    })

  } catch (error) {
    console.error('Error fetching review:', error)
    return NextResponse.json(
      { success: false, message: 'An error occurred while fetching the review' },
      { status: 500 }
    )
  }
}

// PUT - Update review (for admin approval/rejection)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerAuthSession() as CustomSession

    if (!session?.user || session.user.role !== 'manager') {
      return NextResponse.json(
        { success: false, message: 'You are not authorized to perform this action' },
        { status: 403 }
      )
    }

    const db = await dbConnect()
    const collection = db.collection(reviewCollectionName)

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid review ID' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { status, adminResponse } = body

    const updateData: any = {
      updatedAt: new Date()
    }

    if (status) {
      updateData.status = status
    }

    if (adminResponse) {
      updateData.adminResponse = {
        message: adminResponse.message,
        respondedBy: session.user.id,
        respondedAt: new Date()
      }
    }

    const result = await collection.updateOne(
      { _id: ObjectId.createFromHexString(params.id) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Review not found' },
        { status: 404 }
      )
    }

    const updatedReview = await collection.findOne({ _id: ObjectId.createFromHexString(params.id) })

    return NextResponse.json({
      success: true,
      data: updatedReview,
      message: 'Review updated successfully'
    })

  } catch (error) {
    console.error('Error updating review:', error)
    return NextResponse.json(
      { success: false, message: 'An error occurred while updating the review' },
      { status: 500 }
    )
  }
}

// DELETE - Delete review
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerAuthSession() as CustomSession

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'You must be logged in' },
        { status: 401 }
      )
    }

    const db = await dbConnect()
    const collection = db.collection(reviewCollectionName)

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid review ID' },
        { status: 400 }
      )
    }

    // Get the review first to check ownership
    const review = await collection.findOne({ _id: ObjectId.createFromHexString(params.id) })

    if (!review) {
      return NextResponse.json(
        { success: false, message: 'Review not found' },
        { status: 404 }
      )
    }

    // Only allow deletion by review owner or manager
    if (review.userId !== session.user.id && session.user.role !== 'manager') {
      return NextResponse.json(
        { success: false, message: 'You are not authorized to delete this review' },
        { status: 403 }
      )
    }

    const result = await collection.deleteOne({ _id: ObjectId.createFromHexString(params.id) })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'An error occurred while deleting the review' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting review:', error)
    return NextResponse.json(
      { success: false, message: 'An error occurred while deleting the review' },
      { status: 500 }
    )
  }
}