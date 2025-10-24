import { NextResponse } from 'next/server'
import { getMongoClient } from '@/lib/mongodb'

export async function POST() {
  try {
    const client = await getMongoClient()
    const db = client.db()

    console.log('Attempting to remove schema validation from bookings collection...')

    // Drop the collection and recreate it without validation
    try {
      await db.collection('bookings').drop()
      console.log('Dropped bookings collection')
    } catch (error) {
      console.log('Collection might not exist, continuing...')
    }

    // Create new collection without validation
    await db.createCollection('bookings')
    console.log('Created new bookings collection without validation')

    // Create basic indexes
    await db.collection('bookings').createIndex({ user: 1 })
    await db.collection('bookings').createIndex({ trip: 1 })
    await db.collection('bookings').createIndex({ status: 1 })
    await db.collection('bookings').createIndex({ bookingReference: 1 }, { unique: true })
    console.log('Created indexes')

    return NextResponse.json({
      success: true,
      message: 'Schema validation removed and collection recreated'
    })

  } catch (error) {
    console.error('Error fixing schema:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fix schema', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}