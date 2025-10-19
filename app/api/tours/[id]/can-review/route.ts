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

// GET - Check if user can review this tour
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authOptions = await getAuthOptions()
    const session = await getServerSession(authOptions) as CustomSession

    if (!session?.user) {
      return NextResponse.json({
        success: true,
        data: {
          canReview: false,
          reason: 'not_logged_in',
          message: 'يجب تسجيل الدخول لإضافة تقييم'
        }
      })
    }

    const db = await dbConnect()
    const tourId = params.id

    // Check if user has booked this tour
    const booking = await db.collection('bookings').findOne({
      tour: ObjectId.createFromHexString(tourId),
      user: ObjectId.createFromHexString(session.user.id),
      status: { $in: ['confirmed', 'completed'] }
    })

    if (!booking) {
      return NextResponse.json({
        success: true,
        data: {
          canReview: false,
          reason: 'no_booking',
          message: 'يجب أن تكون قد حجزت هذه الرحلة لتتمكن من تقييمها'
        }
      })
    }

    // Check if user already reviewed this tour
    const existingReview = await db.collection(reviewCollectionName).findOne({
      tourId,
      userId: session.user.id
    })

    if (existingReview) {
      return NextResponse.json({
        success: true,
        data: {
          canReview: false,
          reason: 'already_reviewed',
          message: 'لقد قمت بتقييم هذه الرحلة من قبل',
          existingReview: {
            id: existingReview._id,
            status: existingReview.status,
            rating: existingReview.rating,
            title: existingReview.title
          }
        }
      })
    }

    // Check if booking is completed (optional - for better UX)
    const isCompleted = booking.status === 'completed'
    
    return NextResponse.json({
      success: true,
      data: {
        canReview: true,
        reason: 'eligible',
        message: isCompleted 
          ? 'يمكنك الآن تقييم هذه الرحلة' 
          : 'يمكنك تقييم هذه الرحلة (حجزك مؤكد)',
        bookingStatus: booking.status,
        bookingDate: booking.createdAt
      }
    })

  } catch (error) {
    console.error('Error checking review eligibility:', error)
    return NextResponse.json(
      { success: false, message: 'فشل في التحقق من إمكانية التقييم' },
      { status: 500 }
    )
  }
}