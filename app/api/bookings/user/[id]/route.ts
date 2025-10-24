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
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed' | 'on-demand';
  totalAmount: number;
  numberOfTravelers: number;
  user: string;
  role: string;
  specialRequests?: string;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get user session
    const session = await getServerSession(await getAuthOptions()) as any;

    // Check if user is authenticated
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح' },
        { status: 401 }
      );
    }

    const userId = params.id;

    console.log('User bookings request:', {
      requestedUserId: userId,
      sessionUserId: session.user.id,
      userRole: session.user.role,
      isAdmin: session.user.role === 'admin',
      isManager: session.user.role === 'manager',
      isSameUser: session.user.id === userId
    });

    // Verify the requesting user is the same as the requested user or an admin/manager
    if (session.user.role !== 'admin' && session.user.role !== 'manager' && session.user.id !== userId) {
      console.log('Access denied for user bookings');
      return NextResponse.json(
        { success: false, message: 'غير مصرح لك بالوصول إلى هذه البيانات' },
        { status: 403 }
      );
    }

    // Get MongoDB client
    const client = await getMongoClient();
    const db = client.db();

    console.log('Fetching bookings for user:', userId);

    // Find all bookings for the user with tour details
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
            from: 'tours',
            localField: 'trip',
            foreignField: '_id',
            as: 'tour'
          }
        },
        { $unwind: '$tour' },
        {
          $project: {
            'tour._id': 1,
            'tour.title': 1,
            'tour.destination': 1,
            'tour.startDate': 1,
            'tour.endDate': 1,
            'tour.price': 1,
            status: 1,
            paymentStatus: 1,
            totalAmount: 1,
            numberOfTravelers: 1,
            travelers: '$numberOfTravelers',
            specialRequests: 1,
            bookingReference: 1,
            createdAt: 1,
            updatedAt: 1
          }
        },
        { $sort: { createdAt: -1 } }
      ])
      .toArray();

    console.log('Found bookings for user:', bookings.length);
    if (bookings.length > 0) {
      console.log('Sample booking:', {
        _id: bookings[0]._id,
        hasTour: !!bookings[0].tour,
        status: bookings[0].status
      });
    }

    // Format the response
    const formattedBookings = bookings.map(booking => ({
      _id: booking._id.toString(),
      destination: booking.tour.title || booking.tour.destination,
      bookingDate: booking.createdAt,
      startDate: booking.tour.startDate,
      endDate: booking.tour.endDate,
      price: booking.totalAmount,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      travelers: booking.numberOfTravelers || booking.travelers,
      specialRequests: booking.specialRequests || '',
      bookingReference: booking.bookingReference || ''
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