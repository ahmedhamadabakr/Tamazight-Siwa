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
    console.log('Session data:', { session: session ? 'exists' : 'null', userId: session?.user?.id })

    if (!session?.user?.id) {
      console.error('No valid session or user ID')
      return NextResponse.json(
        { success: false, message: 'يجب تسجيل الدخول لإتمام الحجز' },
        { status: 401 }
      )
    }

    const data = await req.json()
    const { tourId, numberOfTravelers, specialRequests, totalAmount } = data

    // Validate input
    console.log('Received booking data:', { tourId, numberOfTravelers, specialRequests, totalAmount })

    if (!tourId) {
      return NextResponse.json(
        { success: false, message: 'معرف الرحلة مطلوب' },
        { status: 400 }
      )
    }

    if (!numberOfTravelers) {
      return NextResponse.json(
        { success: false, message: 'عدد المسافرين مطلوب' },
        { status: 400 }
      )
    }

    const travelersNum = parseInt(numberOfTravelers)
    if (isNaN(travelersNum) || travelersNum < 1 || travelersNum > 5) {
      return NextResponse.json(
        { success: false, message: 'عدد المسافرين يجب أن يكون بين 1 و 5' },
        { status: 400 }
      )
    }

    if (!totalAmount || isNaN(parseFloat(totalAmount)) || parseFloat(totalAmount) <= 0) {
      return NextResponse.json(
        { success: false, message: 'المبلغ الإجمالي غير صحيح' },
        { status: 400 }
      )
    }

    const client = await getMongoClient()
    const db = client.db()

    // Log database connection success
    console.log('Database connected successfully for booking creation')
    console.log('Database name:', db.databaseName)

    // Test database connection
    try {
      await db.admin().ping()
      console.log('Database ping successful')
    } catch (pingError) {
      console.error('Database ping failed:', pingError)
      return NextResponse.json(
        { success: false, message: 'فشل في الاتصال بقاعدة البيانات' },
        { status: 503 }
      )
    }

    // Generate booking reference
    const bookingReference = `BK${Date.now().toString().slice(-8)}${Math.random().toString(36).substr(2, 4).toUpperCase()}`

    // Validate tourId format
    if (!ObjectId.isValid(tourId)) {
      return NextResponse.json(
        { success: false, message: 'معرف الرحلة غير صحيح' },
        { status: 400 }
      )
    }

    // Get tour details
    console.log(`Looking up tour with ID: ${tourId}`)
    let tour
    try {
      tour = await db.collection('tours').findOne({ _id: new ObjectId(tourId) })
      console.log('Tour lookup result:', tour ? 'found' : 'not found')
    } catch (tourError) {
      console.error('Error looking up tour:', tourError)
      return NextResponse.json(
        { success: false, message: 'خطأ في البحث عن الرحلة' },
        { status: 500 }
      )
    }

    if (!tour) {
      console.error(`Tour not found with ID: ${tourId}`)
      return NextResponse.json(
        { success: false, message: 'الرحلة غير موجودة' },
        { status: 404 }
      )
    }

    console.log(`Tour found: ${tour.title}`)

    // Create booking
    // Validate user ID format
    if (!ObjectId.isValid(session.user.id)) {
      console.error('Invalid user ID format:', session.user.id)
      return NextResponse.json(
        { success: false, message: 'معرف المستخدم غير صحيح' },
        { status: 400 }
      )
    }

    console.log('Creating booking object...')

    // Create a simple booking object first
    const booking = {
      user: new ObjectId(session.user.id),
      trip: new ObjectId(tourId),
      numberOfTravelers: parseInt(numberOfTravelers),
      specialRequests: specialRequests || '',
      totalAmount: parseFloat(totalAmount),
      status: 'confirmed',
      paymentStatus: 'on-demand',
      bookingReference,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    console.log('Booking object created successfully')
    console.log('User ObjectId valid:', ObjectId.isValid(session.user.id))
    console.log('Tour ObjectId valid:', ObjectId.isValid(tourId))

    console.log('Attempting to insert booking:', {
      user: session.user.id,
      trip: tourId,
      numberOfTravelers: parseInt(numberOfTravelers),
      totalAmount: parseFloat(totalAmount),
      bookingReference
    })

    console.log('Collection name:', bookingCollectionName)
    console.log('Database collections:', await db.listCollections().toArray())

    let result
    try {
      console.log('About to insert booking:', JSON.stringify(booking, null, 2))
      result = await db.collection('bookings').insertOne(booking, { 
        bypassDocumentValidation: true 
      })
      console.log(`Booking inserted successfully with ID: ${result.insertedId}`)
    } catch (insertError) {
      console.error('Error inserting booking:', insertError)
      console.error('Insert error details:', {
        name: insertError instanceof Error ? insertError.name : 'Unknown',
        message: insertError instanceof Error ? insertError.message : 'Unknown error',
        code: (insertError as any)?.code,
        codeName: (insertError as any)?.codeName,
        stack: insertError instanceof Error ? insertError.stack : undefined
      })

      // Try to provide more specific error message
      if (insertError instanceof Error) {
        if (insertError.message.includes('validation')) {
          return NextResponse.json(
            { success: false, message: 'بيانات الحجز لا تتوافق مع متطلبات قاعدة البيانات' },
            { status: 400 }
          )
        }
        if (insertError.message.includes('duplicate')) {
          return NextResponse.json(
            { success: false, message: 'رقم الحجز موجود مسبقاً' },
            { status: 400 }
          )
        }
      }

      return NextResponse.json(
        { success: false, message: `خطأ في حفظ الحجز: ${insertError instanceof Error ? insertError.message : 'خطأ غير معروف'}` },
        { status: 500 }
      )
    }

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