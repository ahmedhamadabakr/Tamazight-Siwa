import { NextResponse } from 'next/server'
import { getMongoClient } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { bookingCollectionName } from '@/models/Booking'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid ObjectId',
        id: id
      })
    }

    const client = await getMongoClient()
    const db = client.db()

    // Find the raw booking
    const rawBooking = await db.collection(bookingCollectionName).findOne({ _id: new ObjectId(id) })
    
    // Try the aggregation
    const aggregatedBooking = await db.collection(bookingCollectionName).aggregate([
      { $match: { _id: new ObjectId(id) } },
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
      }
    ]).toArray()

    return NextResponse.json({
      success: true,
      debug: {
        id: id,
        isValidObjectId: ObjectId.isValid(id),
        rawBooking: rawBooking ? {
          _id: rawBooking._id?.toString(),
          user: rawBooking.user?.toString(),
          trip: rawBooking.trip?.toString(),
          tour: rawBooking.tour?.toString(),
          status: rawBooking.status,
          allFields: Object.keys(rawBooking)
        } : null,
        aggregatedBooking: aggregatedBooking.length > 0 ? {
          _id: aggregatedBooking[0]._id?.toString(),
          hasUserDetails: aggregatedBooking[0].userDetails?.length > 0,
          hasTourDetails: aggregatedBooking[0].tourDetails?.length > 0,
          userDetailsCount: aggregatedBooking[0].userDetails?.length || 0,
          tourDetailsCount: aggregatedBooking[0].tourDetails?.length || 0
        } : null
      }
    })

  } catch (error) {
    console.error('Debug booking error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}