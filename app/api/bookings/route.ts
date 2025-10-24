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
    const { tourId, numberOfTravelers, specialRequests, totalAmount } = data

    // Validate input
    if (!tourId || !numberOfTravelers || numberOfTravelers < 1 || numberOfTravelers > 5) {
      return NextResponse.json(
        { success: false, message: 'عدد المسافرين يجب أن يكون بين 1 و 5' },
        { status: 400 }
      )
    }

    const client = await getMongoClient()
    const db = client.db()

    // Log database connection success
    console.log('Database connected successfully for booking creation')

    // Generate booking reference
    const bookingReference = `BK${Date.now().toString().slice(-8)}${Math.random().toString(36).substr(2, 4).toUpperCase()}`

    // Get tour details
    console.log(`Looking up tour with ID: ${tourId}`)
    const tour = await db.collection('tours').findOne({ _id: new ObjectId(tourId) })
    if (!tour) {
      console.error(`Tour not found with ID: ${tourId}`)
      return NextResponse.json(
        { success: false, message: 'الرحلة غير موجودة' },
        { status: 404 }
      )
    }

    console.log(`Tour found: ${tour.title}`)

    // Create booking
    const booking = {
      user: new ObjectId(session.user.id),
      trip: new ObjectId(tourId),
      numberOfTravelers: parseInt(numberOfTravelers),
      specialRequests: specialRequests || '',
      totalAmount: parseFloat(totalAmount),
      status: 'confirmed', // Auto-confirm for now
      paymentStatus: 'paid', // Auto-mark as paid for now
      bookingReference,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    console.log('Attempting to insert booking:', {
      user: session.user.id,
      trip: tourId,
      numberOfTravelers: parseInt(numberOfTravelers),
      totalAmount: parseFloat(totalAmount),
      bookingReference
    })

    const result = await db.collection(bookingCollectionName).insertOne(booking)
    console.log(`Booking inserted successfully with ID: ${result.insertedId}`)

    // Get user details for email
    console.log(`Looking up user with ID: ${session.user.id}`)
    const user = await db.collection('users').findOne({ _id: new ObjectId(session.user.id) })

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