import { ObjectId } from 'mongodb';

export interface IBooking {
  _id?: ObjectId;
  user: ObjectId;
  trip: ObjectId;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed' | 'on-demand';
  totalAmount: number;
  numberOfTravelers: number;
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const bookingCollectionName = 'bookings';

export const bookingSchema = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['user', 'trip', 'status', 'paymentStatus', 'totalAmount', 'numberOfTravelers', 'bookingReference'],
    properties: {
      user: {
        bsonType: 'objectId',
        description: 'must be an objectId and is required'
      },
      trip: {
        bsonType: 'objectId',
        description: 'must be an objectId and is required'
      },
      status: {
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        description: 'must be a valid status and is required'
      },
      paymentStatus: {
        enum: ['pending', 'paid', 'refunded', 'failed', 'on-demand'],
        description: 'must be a valid payment status and is required'
      },
      totalAmount: {
        bsonType: 'number',
        minimum: 0,
        description: 'must be a positive number and is required'
      },
      numberOfTravelers: {
        bsonType: 'number',
        minimum: 1,
        description: 'must be a positive number and is required'
      },
      specialRequests: {
        bsonType: 'string',
        description: 'must be a string if field exists'
      },
      bookingReference: {
        bsonType: 'string',
        description: 'must be a string'
      },
      createdAt: {
        bsonType: 'date',
        description: 'must be a date'
      },
      updatedAt: {
        bsonType: 'date',
        description: 'must be a date'
      }
    }
  }
};
