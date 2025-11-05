import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { getMongoClient } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function POST(req: Request) {
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

    // Only connect to DB if not in build time
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({
        success: false,
        error: 'Database connection not configured'
      }, { status: 503 });
    }

    // Get authenticated session
    const session = await getServerSession(authOptions) as any

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }

    const data = await req.json()
    const { tourId, numberOfTravelers, specialRequests, totalAmount } = data

    if (!tourId) {
      return NextResponse.json(
        { success: false, message: 'Tour ID is required' },
        { status: 400 }
      )
    }

    if (!numberOfTravelers) {
      return NextResponse.json(
        { success: false, message: 'Number of travelers is required' },
        { status: 400 }
      )
    }

    const travelersNum = parseInt(numberOfTravelers)
    if (isNaN(travelersNum) || travelersNum < 1 || travelersNum > 5) {
      return NextResponse.json(
        { success: false, message: 'Number of travelers must be between 1 and 5' },
        { status: 400 }
      )
    }

    if (!totalAmount || isNaN(parseFloat(totalAmount)) || parseFloat(totalAmount) <= 0) {
      return NextResponse.json(
        { success: false, message: 'Total amount is invalid' },
        { status: 400 }
      )
    }

    const client = await getMongoClient()
    const db = client.db()

    // Test database connection
    try {
      await db.admin().ping()
    } catch (pingError) {
      return NextResponse.json(
        { success: false, message: 'Database connection failed' },
        { status: 503 }
      )
    }

    // Generate booking reference
    const bookingReference = `BK${Date.now().toString().slice(-8)}${Math.random().toString(36).substr(2, 4).toUpperCase()}`

    // Validate tourId format
    if (!ObjectId.isValid(tourId)) {
      return NextResponse.json(
        { success: false, message: 'Tour ID is invalid' },
        { status: 400 }
      )
    }

    let tour
    try {
      tour = await db.collection('tours').findOne({ _id: new ObjectId(tourId) })
    } catch (tourError) {
      return NextResponse.json(
        { success: false, message: 'Error looking up tour' },
        { status: 500 }
      )
    }

    if (!tour) {
      return NextResponse.json(
        { success: false, message: 'Tour not found' },
        { status: 404 }
      )
    }

    // Create booking
    const userObjectId = new ObjectId(session.user.id)

    const booking = {
      user: userObjectId,
      trip: new ObjectId(tourId),
      numberOfTravelers: parseInt(numberOfTravelers),
      specialRequests: specialRequests || '',
      totalAmount: parseFloat(totalAmount),
      status: 'confirmed',
      paymentStatus: 'pending',
      bookingReference,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    console.log('Database collections:', await db.listCollections().toArray())

    let result
    try {
      result = await db.collection('bookings').insertOne(booking, {
        bypassDocumentValidation: true
      })
    } catch (insertError) {
      // Try to provide more specific error message
      if (insertError instanceof Error) {
        if (insertError.message.includes('validation')) {
          return NextResponse.json(
            { success: false, message: 'Booking data does not meet database requirements' },
            { status: 400 }
          )
        }
        if (insertError.message.includes('duplicate')) {
          return NextResponse.json(
            { success: false, message: 'Booking reference already exists' },
            { status: 400 }
          )
        }
      }

      return NextResponse.json(
        { success: false, message: `Error saving booking: ${insertError instanceof Error ? insertError.message : 'Unknown error'}` },
        { status: 500 }
      )
    }

    // Get user details for email
    const user = await db.collection('users').findOne({ _id: userObjectId })

    // Send confirmation email
    try {
      const { sendBookingConfirmationEmail } = await import('@/lib/email-service')
      await sendBookingConfirmationEmail(session.user.email, {
        customerName: user?.name || session.user.name || 'user',
        bookingReference,
        tourTitle: tour.title,
        destination: tour.destination,
        startDate: tour.startDate,
        endDate: tour.endDate,
        travelers: booking.numberOfTravelers,
        totalAmount: booking.totalAmount,
        specialRequests: booking.specialRequests
      })
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError)
      // Don't fail the booking if email fails
    }

    return NextResponse.json({
      success: true,
      data: {
        _id: result.insertedId.toString(),
        bookingReference,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        totalAmount: booking.totalAmount,
        travelers: booking.numberOfTravelers,
        tour: {
          title: tour.title,
          destination: tour.destination
        }
      },
      message: 'Booking created successfully'
    })

  } catch (error) {
    console.error('Booking creation error:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    })

    // Check if it's a MongoDB validation error
    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json(
        { success: false, message: 'Invalid booking data provided' },
        { status: 400 }
      )
    }

    // Check if it's a database connection error
    if (error instanceof Error && error.message.includes('connection')) {
      return NextResponse.json(
        { success: false, message: 'Database connection error' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { success: false, message: 'An error occurred while processing the request' },
      { status: 500 }
    )
  }
}