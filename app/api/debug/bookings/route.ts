import { NextResponse } from 'next/server'
import { getMongoClient } from '@/lib/mongodb'
import { bookingCollectionName } from '@/models/Booking'

export async function GET() {
  try {
    const client = await getMongoClient()
    const db = client.db()

    // Get raw bookings data for debugging
    const bookings = await db.collection(bookingCollectionName).find({}).limit(5).toArray()
    
    // Get collections info
    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map(c => c.name)

    // Count documents
    const bookingsCount = await db.collection(bookingCollectionName).countDocuments()
    const toursCount = await db.collection('tours').countDocuments()
    const usersCount = await db.collection('users').countDocuments()

    return NextResponse.json({
      success: true,
      debug: {
        collections: collectionNames,
        counts: {
          bookings: bookingsCount,
          tours: toursCount,
          users: usersCount
        },
        sampleBookings: bookings.map(b => ({
          _id: b._id?.toString(),
          user: b.user?.toString(),
          trip: b.trip?.toString(),
          tour: b.tour?.toString(), // Check if this field exists
          status: b.status,
          createdAt: b.createdAt,
          hasBookingReference: !!b.bookingReference,
          bookingReference: b.bookingReference,
          allFields: Object.keys(b)
        })),
        rawBookings: bookings // Show complete raw data
      }
    })

  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}