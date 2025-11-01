import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getMongoClient } from '@/lib/mongodb'

export async function GET(req: Request) {
  try {
    // Skip build time check in development
    if (process.env.NODE_ENV !== 'development') {
      // Check if we're in build time only in production
      const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build';
      
      if (isBuildTime) {
        return NextResponse.json({
          success: false,
          error: 'API routes are not available during build time'
        }, { status: 503 });
      }
    }

    if (!process.env.MONGODB_URI) {
      return NextResponse.json({
        success: false,
        error: 'Database connection not configured'
      }, { status: 503 });
    }

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

    const client = await getMongoClient()
    const db = client.db()




    // Get all bookings with user and tour details
    const bookings = await db.collection('bookings').aggregate([
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
        $unwind: {
          path: '$userDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: '$tourDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          numberOfTravelers: 1,
          travelers: '$numberOfTravelers',
          specialRequests: 1,
          totalAmount: 1,
          status: 1,
          paymentStatus: 1,
          bookingReference: 1,
          createdAt: 1,
          updatedAt: 1,
          user: {
            name: { $ifNull: ['$userDetails.name', 'Unknown User'] },
            email: { $ifNull: ['$userDetails.email', 'No Email'] },
            phone: { $ifNull: ['$userDetails.phone', ''] }
          },
          tour: {
            _id: { $ifNull: ['$tourDetails._id', null] },
            title: { $ifNull: ['$tourDetails.title', 'Unknown Tour'] },
            destination: { $ifNull: ['$tourDetails.destination', 'Unknown Destination'] },
            duration: { $ifNull: ['$tourDetails.duration', 0] },
            price: { $ifNull: ['$tourDetails.price', 0] },
            startDate: { $ifNull: ['$tourDetails.startDate', new Date()] },
            endDate: { $ifNull: ['$tourDetails.endDate', new Date()] }
          }
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]).toArray()

    return NextResponse.json({
      success: true,
      data: bookings
    })

  } catch (error) {
    console.error('Admin get bookings error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to get bookings' },
      { status: 500 }
    )
  }
}