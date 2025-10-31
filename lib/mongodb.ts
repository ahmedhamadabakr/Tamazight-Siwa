import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongo;

if (!cached) {
  cached = (global as any).mongo = { conn: null, promise: null };
}

async function dbConnect(): Promise<Db> {
  // Check if we're in build time and return a mock connection
  const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' ||
    (process.env.NODE_ENV === 'production' && !process.env.VERCEL_ENV && !process.env.MONGODB_URI);

  if (isBuildTime) {
    // Return a mock database for build time
    return {
      collection: () => ({
        find: () => ({
          sort: () => ({
            toArray: () => Promise.resolve([])
          })
        }),
        findOne: () => Promise.resolve(null),
        insertOne: () => Promise.resolve({ insertedId: null }),
        updateOne: () => Promise.resolve({ modifiedCount: 0 }),
        deleteOne: () => Promise.resolve({ deletedCount: 0 })
      })
    } as any;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000, // Increased for Vercel
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      maxIdleTimeMS: 30000,
      retryWrites: true,
      retryReads: true,
    };

    cached.promise = MongoClient.connect(MONGODB_URI, opts).then((client) => {
      return client.db();
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Export MongoClient for NextAuth adapter
let mongoClient: MongoClient;
let clientPromise: Promise<MongoClient>;

async function getMongoClient(): Promise<MongoClient> {
  // Check if we're in build time and return a mock client
  const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' ||
    (process.env.NODE_ENV === 'production' && !process.env.VERCEL_ENV && !process.env.MONGODB_URI);

  if (isBuildTime) {
    // Return a mock client for build time
    return {} as MongoClient;
  }

  if (!mongoClient) {
    if (!clientPromise) {
      const opts = {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 10000, // Increased for Vercel
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
        maxIdleTimeMS: 30000,
        retryWrites: true,
        retryReads: true,
      };

      clientPromise = MongoClient.connect(MONGODB_URI, opts);
    }
    mongoClient = await clientPromise;
  }
  return mongoClient;
}

export default dbConnect;
export { getMongoClient };
