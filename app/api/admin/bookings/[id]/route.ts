import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { getMongoClient } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions) as any
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin or manager
    if (session.user.role !== 'admin' && session.user.role !== 'manager') {
      return NextResponse.json(
        { success: false, message: 'Access denied. Admin or Manager role required.' },
        { status: 403 }
      )
    }

    const { id: bookingId } = params
    const data = await req.json()

    if (!ObjectId.isValid(bookingId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid booking ID' },
        { status: 400 }
      )
    }

    const client = await getMongoClient()
    const db = client.db()

    // Get booking details before update (for email notification)
    const booking = await db.collection('bookings').aggregate([
      {
        $match: { _id: new ObjectId(bookingId) }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      {
        $lookup: {
          from: 'tours',
          localField: 'trip',
          foreignField: '_id',
          as: 'tourDetails'
        }
      },
      {
        $unwind: '$userDetails'
      },
      {
        $unwind: '$tourDetails'
      }
    ]).toArray()

    if (!booking || booking.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Booking not found' },
        { status: 404 }
      )
    }

    const bookingData = booking[0]

    // Update booking
    const result = await db.collection('bookings').updateOne(
      { _id: new ObjectId(bookingId) },
      {
        $set: {
          ...data,
          updatedAt: new Date()
        }
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Booking not found' },
        { status: 404 }
      )
    }

    // Email notification disabled for now
    // if (data.status === 'cancelled' && bookingData.status !== 'cancelled') {
    //   // Send cancellation email
    // }

    return NextResponse.json({
      success: true,
      message: 'Booking updated successfully'
    })

  } catch (error) {
    console.error('Admin update booking error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update booking' },
      { status: 500 }
    )
  }
}