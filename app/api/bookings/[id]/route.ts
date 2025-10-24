import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { getAuthOptions } from '@/lib/auth'
import { getMongoClient } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { bookingCollectionName } from '@/models/Booking'

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(await getAuthOptions()) as any

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params
    const data = await req.json()

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid booking ID' },
        { status: 400 }
      )
    }

    const client = await getMongoClient()
    const db = client.db()

    // Check if booking exists and belongs to user
    const existingBooking = await db.collection(bookingCollectionName).findOne({
      _id: new ObjectId(id),
      user: new ObjectId(session.user.id)
    })

    if (!existingBooking) {
      return NextResponse.json(
        { success: false, message: 'Booking not found or you do not have permission to update it' },
        { status: 404 }
      )
    }

    // Update booking
    const result = await db.collection(bookingCollectionName).updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...data,
          updatedAt: new Date()
        }
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Updating booking failed' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Booking updated successfully'
    })

  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json(
      { success: false, message: 'Error updating booking' },
      { status: 500 }
    )
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if we're in build time
    const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' ||
      process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === undefined;

    if (isBuildTime) {
      return NextResponse.json({
        success: false,
        error: 'API routes are not available during build time'
      }, { status: 503 });
    }

    if (!process.env.MONGODB_URI) {
      return NextResponse.json({
        success: false,
        error: 'Database connection not configured'
      }, { status: 503 });
    }

    const session = await getServerSession(await getAuthOptions()) as any

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid booking ID' },
        { status: 400 }
      )
    }

    const client = await getMongoClient()
    const db = client.db()

    // Find the booking with user and tour details
    // Allow admin/manager to see all bookings, regular users only their own
    const matchCondition: any = { _id: new ObjectId(id) }
    
    if (session.user.role !== 'manager') {
      matchCondition.user = new ObjectId(session.user.id)
    }

    const booking = await db.collection(bookingCollectionName).aggregate([
      {
        $match: matchCondition
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
      },
      {
        $project: {
          _id: 1,
          user: {
            name: '$userDetails.name',
            email: '$userDetails.email',
            phone: '$userDetails.phone'
          },
          tour: {
            _id: '$tourDetails._id',
            title: '$tourDetails.title',
            destination: '$tourDetails.destination',
            duration: '$tourDetails.duration',
            price: '$tourDetails.price',
            startDate: '$tourDetails.startDate',
            endDate: '$tourDetails.endDate'
          },
          travelers: '$numberOfTravelers',
          specialRequests: 1,
          totalAmount: 1,
          status: 1,
          paymentStatus: 1,
          bookingReference: 1,
          createdAt: 1
        }
      }
    ]).toArray()

    console.log('Match condition:', matchCondition)
    console.log('Found booking:', booking.length > 0 ? 'Yes' : 'No')
    
    if (booking.length > 0) {
      console.log('Booking details:', {
        _id: booking[0]._id,
        hasUser: !!booking[0].user,
        hasTour: !!booking[0].tour,
        status: booking[0].status
      })
    }

    if (!booking || booking.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Booking not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: booking[0]
    })

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error fetching booking' },
      { status: 500 }
    )
  }
}