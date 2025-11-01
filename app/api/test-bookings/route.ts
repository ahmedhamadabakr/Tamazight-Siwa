import { NextResponse } from 'next/server'
import { getMongoClient } from '@/lib/mongodb'

export async function GET() {
  try {
    const client = await getMongoClient()
    const db = client.db()

    // Check if bookings collection exists and has data
    const bookingsCount = await db.collection('bookings').countDocuments()
    const sampleBookings = await db.collection('bookings').find({}).limit(5).toArray()
    
    // Check collections in database
    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map(c => c.name)

    return NextResponse.json({
      success: true,
      data: {
        bookingsCount,
        sampleBookings,
        availableCollections: collectionNames
      }
    })

  } catch (error) {
    console.error('Error testing bookings:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}