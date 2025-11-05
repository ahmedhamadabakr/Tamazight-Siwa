import { NextResponse } from 'next/server'
import { getServerAuthSession } from '@/lib/server-auth';



import { getMongoClient } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { bookingCollectionName } from '@/models/Booking'
import { generateBookingHTML } from '@/lib/pdf-generator'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerAuthSession() as any

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid booking ID' },
        { status: 400 }
      )
    }

    const client = await getMongoClient()
    const db = client.db()

    // Find the booking with user and tour details
    const matchCondition: any = { _id: new ObjectId(id) }
    
    if (session.user.role !== 'admin' && session.user.role !== 'manager') {
      matchCondition.user = new ObjectId(session.user.id)
    }

    const booking = await db.collection(bookingCollectionName).aggregate([
      {
        $match: matchCondition
      },
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
          },
          travelers: '$numberOfTravelers',
          specialRequests: 1,
          totalAmount: 1,
          status: 1,
          paymentStatus: 1,
          bookingReference: 1,
          createdAt: 1
        }
      }
    ]).toArray()

    if (!booking || booking.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Booking not found' },
        { status: 404 }
      )
    }

    const bookingData = booking[0]

    // Generate HTML content for PDF
    const htmlContent = generateBookingHTML(bookingData as any)

    // Return HTML response that can be converted to PDF
    return new Response(htmlContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `inline; filename="booking-${bookingData.bookingReference}.html"`
      }
    })

  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      { success: false, message: 'Error generating PDF' },  
      { status: 500 }
    )
  }
}

