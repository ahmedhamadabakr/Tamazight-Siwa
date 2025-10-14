import { ObjectId } from 'mongodb';

export interface ITrip {
  _id?: ObjectId;
  destination: string;
  description: string;
  startDate: Date;
  endDate: Date;
  price: number;
  maxTravelers: number;
  availableSpots: number;
  images: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const tripCollectionName = 'trips';

export const tripSchema = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['destination', 'description', 'startDate', 'endDate', 'price', 'maxTravelers', 'availableSpots'],
    properties: {
      destination: {
        bsonType: 'string',
        description: 'must be a string and is required'
      },
      description: {
        bsonType: 'string',
        description: 'must be a string and is required'
      },
      startDate: {
        bsonType: 'date',
        description: 'must be a date and is required'
      },
      endDate: {
        bsonType: 'date',
        description: 'must be a date and is required'
      },
      price: {
        bsonType: 'number',
        minimum: 0,
        description: 'must be a non-negative number and is required'
      },
      maxTravelers: {
        bsonType: 'int',
        minimum: 1,
        description: 'must be a positive integer and is required'
      },
      availableSpots: {
        bsonType: 'int',
        minimum: 0,
        description: 'must be a non-negative integer and is required'
      },
      images: {
        bsonType: 'array',
        items: {
          bsonType: 'string'
        },
        description: 'must be an array of strings'
      },
      isActive: {
        bsonType: 'bool',
        description: 'must be a boolean',
        default: true
      },
      createdAt: {
        bsonType: 'date',
        description: 'must be a date and is required'
      },
      updatedAt: {
        bsonType: 'date',
        description: 'must be a date and is required'
      }
    }
  }
};
