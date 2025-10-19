import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { getAuthOptions } from '@/lib/auth'
import { getMongoClient } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { bookingCollectionName } from '@/models/Booking'

export async function POST(req: Request) {
  try {
    // Check if we're in build time - use multiple indicators
    const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' ||
                       process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === undefined;

    if (isBuildTime) {
      return NextResponse.json({
        success: false,
        error: 'API routes are not available during build time'
      }, { status: 503 });
    }

    // Only connect to DB if not in build time
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

    const data = await req.json()
    const { tourId, travelers, specialRequests, totalAmount } = data

    // Validate input
    if (!tourId || !travelers || travelers < 1 || travelers > 5) {
      return NextResponse.json(
        { success: false, message: 'Invalid data' },
        { status: 400 }
      )
    }

    const client = await getMongoClient()
    const db = client.db()

    // Create booking
    const booking = {
      user: new ObjectId(session.user.id),
      tour: new ObjectId(tourId),
      travelers: parseInt(travelers),
      specialRequests: specialRequests || '',
      totalAmount: parseFloat(totalAmount),
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection(bookingCollectionName).insertOne(booking)

    // Here you would typically:
    // 1. Process payment with your payment provider
    // 2. Update booking status based on payment result
    // 3. Send confirmation email

    return NextResponse.json({
      success: true,
      data: {
        ...booking,
        _id: result.insertedId.toString(),
        user: session.user.id,
        role: session.user.role,
        tour: tourId
      }
    })

  } catch (error) {
    console.error('Booking creation error:', error)
    return NextResponse.json(
      { success: false, message: 'An error occurred while processing the request' },
      { status: 500 }
    )
  }
}