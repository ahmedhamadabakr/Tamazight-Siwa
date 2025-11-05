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

// GET - Check if user can review this tour
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerAuthSession() as CustomSession

    if (!session?.user) {
      return NextResponse.json({
        success: true,
        data: {
          canReview: false,
          reason: 'not_logged_in',
          message: 'Please log in to add a review'
        }
      })
    }

    const db = await dbConnect()
    const tourId = params.id

    // Check if user has booked this tour (optional - for verified badge)
    const booking = await db.collection('bookings').findOne({
      tour: ObjectId.createFromHexString(tourId),
      user: ObjectId.createFromHexString(session.user.id),
      status: { $in: ['confirmed', 'completed'] }
    })

    const hasBooking = !!booking

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
          message: 'You have already reviewed this tour',
          existingReview: {
            id: existingReview._id,
            status: existingReview.status,
            rating: existingReview.rating,
            title: existingReview.title
          }
        }
      })
    }

    // Allow all logged-in users to review
    return NextResponse.json({
      success: true,
      data: {
        canReview: true,
        reason: 'eligible',
        message: hasBooking
          ? 'You can review this tour (you have a confirmed booking)'
          : 'You can review this tour',
        hasBooking,
        verified: hasBooking, // Will be marked as verified if user has booking
        bookingStatus: booking?.status,
        bookingDate: booking?.createdAt
      }
    })

  } catch (error) {
    console.error('Error checking review eligibility:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to check review eligibility' },
      { status: 500 }
    )
  }
}