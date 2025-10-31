// Database indexes for better performance
import dbConnect from './mongodb';

export async function createIndexes() {
  try {
    const db = await dbConnect();
    
    // Users collection indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ 'refreshTokens.token': 1 });
    await db.collection('users').createIndex({ 'refreshTokens.expiresAt': 1 });
    await db.collection('users').createIndex({ emailVerificationToken: 1 });
    await db.collection('users').createIndex({ resetToken: 1 });
    
    // Rate limits collection indexes
    await db.collection('ratelimits').createIndex({ identifier: 1 }, { unique: true });
    await db.collection('ratelimits').createIndex({ resetTime: 1 }, { expireAfterSeconds: 0 });
    
    // Security events collection indexes
    await db.collection('securityevents').createIndex({ userId: 1, timestamp: -1 });
    await db.collection('securityevents').createIndex({ timestamp: -1 });
    await db.collection('securityevents').createIndex({ eventType: 1, timestamp: -1 });
    
    // Verification tokens collection indexes
    await db.collection('verificationtokens').createIndex({ token: 1 }, { unique: true });
    await db.collection('verificationtokens').createIndex({ expires: 1 }, { expireAfterSeconds: 0 });
    
    // Verification codes collection indexes
    await db.collection('verificationcodes').createIndex({ code: 1 }, { unique: true });
    await db.collection('verificationcodes').createIndex({ email: 1 });
    await db.collection('verificationcodes').createIndex({ expires: 1 }, { expireAfterSeconds: 0 });
    
    console.log('Database indexes created successfully');
  } catch (error) {
    console.error('Error creating database indexes:', error);
  }
}

// Auto-create indexes in production
if (process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV) {
  createIndexes().catch(console.error);
}