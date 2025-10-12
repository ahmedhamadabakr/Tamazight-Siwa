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
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
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
  if (!mongoClient) {
    if (!clientPromise) {
      const opts = {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      };

      clientPromise = MongoClient.connect(MONGODB_URI, opts);
    }
    mongoClient = await clientPromise;
  }
  return mongoClient;
}

export default dbConnect;
export { getMongoClient };
