import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { getAuthOptions } from '@/lib/auth'
import { getMongoClient } from '@/lib/mongodb'
import { bookingCollectionName } from '@/models/Booking'

export async function GET(req: Request) {
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

    // Check if user is admin or manager
    if (session.user.role !== 'admin' && session.user.role !== 'manager') {
      return NextResponse.json(
        { success: false, message: 'Access denied. Admin or Manager role required.' },
        { status: 403 }
      )
    }

    const client = await getMongoClient()
    const db = client.db()

    console.log('Fetching bookings for admin/manager...')
    console.log('User role:', session.user.role)
    console.log('Collection name:', bookingCollectionName)

    // Get all bookings with user and tour details
    const bookings = await db.collection(bookingCollectionName).aggregate([
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
          }
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]).toArray()

    console.log('Found bookings:', bookings.length)
    console.log('Sample booking:', bookings[0] ? {
      _id: bookings[0]._id,
      hasUser: !!bookings[0].user,
      hasTour: !!bookings[0].tour,
      status: bookings[0].status
    } : 'No bookings found')

    return NextResponse.json({
      success: true,
      data: bookings
    })

  } catch (error) {
    console.error('Admin get bookings error:', error)
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء جلب الحجوزات' },
      { status: 500 }
    )
  }
}