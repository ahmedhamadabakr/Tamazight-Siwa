import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getAuthOptions } from '@/lib/auth';
import { getMongoClient } from '@/lib/mongodb';
import { IBooking, bookingCollectionName, bookingSchema } from '@/models/Booking';
import { ObjectId } from 'mongodb';

interface BookingResponse {
  _id: string;
  trip: {
    _id: string;
    destination: string;
    startDate: Date;
    endDate: Date;
    price: number;
  };
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  bookingDate: Date;
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  totalAmount: number;
  numberOfTravelers: number;
  specialRequests?: string;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get user session
    const session = await getServerSession(getAuthOptions());
    
    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح' },
        { status: 401 }
      );
    }

    const userId = params.id;

    // Verify the requesting user is the same as the requested user or an admin
    if (session.user.role !== 'admin' && session.user.id !== userId) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح لك بالوصول إلى هذه البيانات' },
        { status: 403 }
      );
    }

    // Get MongoDB client
    const client = await getMongoClient();
    const db = client.db();

    // Find all bookings for the user with trip details
    const bookings = await db
      .collection<IBooking>(bookingCollectionName)
      .aggregate([
        {
          $match: {
            user: new ObjectId(userId)
          }
        },
        {
          $lookup: {
            from: 'trips',
            localField: 'trip',
            foreignField: '_id',
            as: 'trip'
          }
        },
        { $unwind: '$trip' },
        {
          $project: {
            'trip.destination': 1,
            'trip.startDate': 1,
            'trip.endDate': 1,
            'trip.price': 1,
            status: 1,
            paymentStatus: 1,
            totalAmount: 1,
            numberOfTravelers: 1,
            specialRequests: 1,
            createdAt: 1,
            updatedAt: 1
          }
        },
        { $sort: { createdAt: -1 } }
      ])
      .toArray();

    // Format the response
    const formattedBookings: BookingResponse[] = bookings.map(booking => ({
      _id: booking._id.toString(),
      trip: {
        _id: booking.trip._id.toString(),
        destination: booking.trip.destination,
        startDate: booking.trip.startDate,
        endDate: booking.trip.endDate,
        price: booking.trip.price
      },
      status: booking.status,
      bookingDate: booking.createdAt,
      paymentStatus: booking.paymentStatus,
      totalAmount: booking.totalAmount,
      numberOfTravelers: booking.numberOfTravelers,
      specialRequests: booking.specialRequests || ''
    }));

    return NextResponse.json({
      success: true,
      data: formattedBookings
    });

  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'حدث خطأ أثناء جلب حجوزات المستخدم',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Create a validator for the bookings collection
async function createBookingsCollection(db: any) {
  try {
    await db.createCollection(bookingCollectionName, {
      validator: {
        $jsonSchema: bookingSchema.$jsonSchema
      }
    });
    
    // Create indexes
    await db.collection(bookingCollectionName).createIndex({ user: 1 });
    await db.collection(bookingCollectionName).createIndex({ trip: 1 });
    await db.collection(bookingCollectionName).createIndex({ status: 1 });
    
    console.log(`Created collection ${bookingCollectionName} with schema validation`);
  } catch (error) {
    // Collection might already exist, which is fine
    if (error instanceof Error && error.message.includes('already exists')) {
      console.log(`Collection ${bookingCollectionName} already exists`);
    } else {
      console.error('Error creating bookings collection:', error);
      throw error;
    }
  }
}

// Initialize the collection when this module is imported
(async () => {
  try {
    const client = await getMongoClient();
    await createBookingsCollection(client.db());
  } catch (error) {
    console.error('Failed to initialize bookings collection:', error);
  }
})();