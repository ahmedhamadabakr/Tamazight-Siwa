import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { getAuthOptions } from '@/lib/auth'
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
        { success: false, message: 'معرف التقييم غير صحيح' },
        { status: 400 }
      )
    }

    const review = await collection.findOne({ _id: ObjectId.createFromHexString(params.id) })

    if (!review) {
      return NextResponse.json(
        { success: false, message: 'التقييم غير موجود' },
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
      { success: false, message: 'فشل في جلب التقييم' },
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
    const authOptions = await getAuthOptions()
    const session = await getServerSession(authOptions) as CustomSession

    if (!session?.user || session.user.role !== 'manager') {
      return NextResponse.json(
        { success: false, message: 'غير مصرح لك بهذا الإجراء' },
        { status: 403 }
      )
    }

    const db = await dbConnect()
    const collection = db.collection(reviewCollectionName)

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, message: 'معرف التقييم غير صحيح' },
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
        { success: false, message: 'التقييم غير موجود' },
        { status: 404 }
      )
    }

    const updatedReview = await collection.findOne({ _id: ObjectId.createFromHexString(params.id) })

    return NextResponse.json({
      success: true,
      data: updatedReview,
      message: 'تم تحديث التقييم بنجاح'
    })

  } catch (error) {
    console.error('Error updating review:', error)
    return NextResponse.json(
      { success: false, message: 'فشل في تحديث التقييم' },
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
    const authOptions = await getAuthOptions()
    const session = await getServerSession(authOptions) as CustomSession

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'يجب تسجيل الدخول' },
        { status: 401 }
      )
    }

    const db = await dbConnect()
    const collection = db.collection(reviewCollectionName)

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, message: 'معرف التقييم غير صحيح' },
        { status: 400 }
      )
    }

    // Get the review first to check ownership
    const review = await collection.findOne({ _id: ObjectId.createFromHexString(params.id) })

    if (!review) {
      return NextResponse.json(
        { success: false, message: 'التقييم غير موجود' },
        { status: 404 }
      )
    }

    // Only allow deletion by review owner or manager
    if (review.userId !== session.user.id && session.user.role !== 'manager') {
      return NextResponse.json(
        { success: false, message: 'غير مصرح لك بحذف هذا التقييم' },
        { status: 403 }
      )
    }

    const result = await collection.deleteOne({ _id: ObjectId.createFromHexString(params.id) })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'فشل في حذف التقييم' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'تم حذف التقييم بنجاح'
    })

  } catch (error) {
    console.error('Error deleting review:', error)
    return NextResponse.json(
      { success: false, message: 'فشل في حذف التقييم' },
      { status: 500 }
    )
  }
}