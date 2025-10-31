import { ObjectId } from 'mongodb';
import dbConnect from './mongodb';

// Refresh token interface
export interface IRefreshToken {
  token: string;
  expiresAt: Date;
  deviceInfo?: string;
  ipAddress?: string;
  createdAt: Date;
}

// Enhanced User interface with security fields
export interface IUser {
  _id?: ObjectId;
  name: string;
  fullName?: string;
  email: string;
  password: string;
  country: string;
  image?: string;
  phone?: string;
  emailVerified?: Date;
  isActive: boolean;
  role: "user" | "manager" | "admin";
  
  // Security fields
  loginAttempts: number;
  lockoutUntil?: Date;
  lastLogin?: Date;
  lastLoginIP?: string;
  
  // Token management
  refreshTokens: IRefreshToken[];
  
  // Email verification
  emailVerificationToken?: string;
  emailVerificationExpiry?: Date;
  
  // Password reset
  resetToken?: string;
  resetTokenExpiry?: Date;
  
  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
}

// VerificationToken interface
export interface IVerificationToken {
  _id?: ObjectId;
  identifier: string;
  token: string;
  expires: Date;
  userId: ObjectId;
  createdAt?: Date;
}

// VerificationCode interface
export interface IVerificationCode {
  _id?: ObjectId;
  code: string;
  email: string;
  expires: Date;
  used: boolean;
  createdAt?: Date;
}

// Rate limiting interface
export interface IRateLimit {
  _id?: ObjectId;
  identifier: string; // IP address or email
  attempts: number;
  lastAttempt: Date;
  resetTime: Date;
  createdAt?: Date;
}

// Security event logging interface
export interface ISecurityEvent {
  _id?: ObjectId;
  userId?: ObjectId;
  eventType: 'LOGIN_SUCCESS' | 'LOGIN_FAILED' | 'ACCOUNT_LOCKED' | 'TOKEN_REFRESH' | 'PERMISSION_DENIED' | 'RATE_LIMIT_EXCEEDED';
  ipAddress?: string;
  userAgent?: string;
  details?: any;
  timestamp: Date;
}

// Token pair interface for API responses
export interface ITokenPair {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

// Database operations class
export class Database {
  private db: Promise<any> | null = null;

  constructor() {
    // Don't connect during build time
    if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
      // Only connect if we're not in build mode
      if (!process.env.NEXT_PHASE || process.env.NEXT_PHASE !== 'phase-production-build') {
        this.db = dbConnect();
        this.ensureIndexes();
      }
    } else {
      this.db = dbConnect();
      this.ensureIndexes();
    }
  }

  private async ensureIndexes() {
    try {
      const db = await this.getDb();
      
      // Create indexes for better performance
      await Promise.allSettled([
        db.collection('users').createIndex({ email: 1 }, { unique: true, background: true }),
        db.collection('users').createIndex({ 'refreshTokens.token': 1 }, { background: true }),
        db.collection('ratelimits').createIndex({ identifier: 1 }, { unique: true, background: true }),
        db.collection('securityevents').createIndex({ userId: 1, timestamp: -1 }, { background: true }),
      ]);
    } catch (error) {
      // Ignore index creation errors in production
      if (process.env.NODE_ENV === 'development') {
        console.warn('Index creation warning:', error);
      }
    }
  }

  private async getDb() {
    if (!this.db) {
      this.db = dbConnect();
    }
    try {
      return await this.db;
    } catch (error) {
      // Reset connection on error and retry once
      this.db = dbConnect();
      return await this.db;
    }
  }

  // User operations
  async createUser(userData: Omit<IUser, '_id' | 'createdAt' | 'updatedAt' | 'role' | 'loginAttempts' | 'refreshTokens' | 'country'> & { 
    role?: IUser['role'];
    country?: string;
  }): Promise<IUser> {
    const db = await this.getDb();
    const now = new Date();
    const user: IUser = {
      ...userData,
      fullName: userData.fullName || userData.name,
      createdAt: now,
      updatedAt: now,
      role: userData.role || "user",
      country: userData.country || "",
      loginAttempts: 0,
      refreshTokens: [],
      isActive: false, // Require email verification by default
    };

    const result = await db.collection('users').insertOne(user);
    return { ...user, _id: result.insertedId };
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    const db = await this.getDb();
    return await db.collection('users').findOne({ email });
  }

  async findUserById(id: ObjectId): Promise<IUser | null> {
    const db = await this.getDb();
    return await db.collection('users').findOne({ _id: id });
  }

  async updateUser(id: ObjectId, updateData: Partial<IUser>): Promise<IUser | null> {
    const db = await this.getDb();
    const result = await db.collection('users').findOneAndUpdate(
      { _id: id },
      { $set: { ...updateData, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    return result.value;
  }

  // Migration function to add fullName field for existing users
  async migrateUsersAddFullName(): Promise<void> {
    const db = await this.getDb();
    // Update users who don't have fullName field to use name as fullName
    await db.collection('users').updateMany(
      { fullName: { $exists: false } },
      { $set: { fullName: '$name', updatedAt: new Date() } }
    );
  }

  // VerificationToken operations
  async createVerificationToken(tokenData: Omit<IVerificationToken, '_id' | 'createdAt'>): Promise<IVerificationToken> {
    const db = await this.getDb();
    const now = new Date();
    const token: IVerificationToken = {
      ...tokenData,
      createdAt: now,
    };

    const result = await db.collection('verificationtokens').insertOne(token);
    return { ...token, _id: result.insertedId };
  }

  async findVerificationToken(token: string): Promise<IVerificationToken | null> {
    const db = await this.getDb();
    return await db.collection('verificationtokens').findOne({ token });
  }

  async deleteVerificationToken(token: string): Promise<boolean> {
    const db = await this.getDb();
    const result = await db.collection('verificationtokens').deleteOne({ token });
    return result.deletedCount > 0;
  }

  // VerificationCode operations
  async createVerificationCode(codeData: Omit<IVerificationCode, '_id' | 'createdAt'>): Promise<IVerificationCode> {
    const db = await this.getDb();
    const now = new Date();
    const code: IVerificationCode = {
      ...codeData,
      createdAt: now,
    };

    const result = await db.collection('verificationcodes').insertOne(code);
    return { ...code, _id: result.insertedId };
  }

  async findVerificationCode(code: string): Promise<IVerificationCode | null> {
    const db = await this.getDb();
    return await db.collection('verificationcodes').findOne({ code });
  }

  async updateVerificationCode(code: string, updateData: Partial<IVerificationCode>): Promise<IVerificationCode | null> {
    const db = await this.getDb();
    const result = await db.collection('verificationcodes').findOneAndUpdate(
      { code },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    return result.value;
  }

  // Refresh token operations
  async addRefreshToken(userId: ObjectId, refreshToken: IRefreshToken): Promise<void> {
    const db = await this.getDb();
    await db.collection('users').updateOne(
      { _id: userId },
      { 
        $push: { refreshTokens: refreshToken },
        $set: { updatedAt: new Date() }
      }
    );
  }

  async removeRefreshToken(userId: ObjectId, token: string): Promise<void> {
    const db = await this.getDb();
    await db.collection('users').updateOne(
      { _id: userId },
      { 
        $pull: { refreshTokens: { token } },
        $set: { updatedAt: new Date() }
      }
    );
  }

  async removeAllRefreshTokens(userId: ObjectId): Promise<void> {
    const db = await this.getDb();
    await db.collection('users').updateOne(
      { _id: userId },
      { 
        $set: { refreshTokens: [], updatedAt: new Date() }
      }
    );
  }

  async findUserByRefreshToken(token: string): Promise<IUser | null> {
    const db = await this.getDb();
    return await db.collection('users').findOne({
      'refreshTokens.token': token,
      'refreshTokens.expiresAt': { $gt: new Date() }
    });
  }

  async cleanExpiredRefreshTokens(): Promise<void> {
    const db = await this.getDb();
    await db.collection('users').updateMany(
      {},
      { 
        $pull: { refreshTokens: { expiresAt: { $lt: new Date() } } },
        $set: { updatedAt: new Date() }
      }
    );
  }

  // Security operations
  async incrementLoginAttempts(email: string): Promise<void> {
    const db = await this.getDb();
    await db.collection('users').updateOne(
      { email },
      { 
        $inc: { loginAttempts: 1 },
        $set: { updatedAt: new Date() }
      }
    );
  }

  async lockAccount(email: string, lockoutDuration: number): Promise<void> {
    const db = await this.getDb();
    const lockoutUntil = new Date(Date.now() + lockoutDuration);
    await db.collection('users').updateOne(
      { email },
      { 
        $set: { 
          lockoutUntil,
          updatedAt: new Date()
        }
      }
    );
  }

  async resetLoginAttempts(email: string): Promise<void> {
    const db = await this.getDb();
    await db.collection('users').updateOne(
      { email },
      { 
        $unset: { loginAttempts: 1, lockoutUntil: 1 },
        $set: { updatedAt: new Date() }
      }
    );
  }

  async updateLastLogin(userId: ObjectId, ipAddress?: string): Promise<void> {
    const db = await this.getDb();
    await db.collection('users').updateOne(
      { _id: userId },
      { 
        $set: { 
          lastLogin: new Date(),
          lastLoginIP: ipAddress,
          updatedAt: new Date()
        }
      }
    );
  }

  // Email verification operations
  async setEmailVerificationToken(email: string, token: string, expiresAt: Date): Promise<void> {
    const db = await this.getDb();
    await db.collection('users').updateOne(
      { email },
      { 
        $set: { 
          emailVerificationToken: token,
          emailVerificationExpiry: expiresAt,
          updatedAt: new Date()
        }
      }
    );
  }

  async verifyEmail(token: string): Promise<IUser | null> {
    const db = await this.getDb();
    const result = await db.collection('users').findOneAndUpdate(
      { 
        emailVerificationToken: token,
        emailVerificationExpiry: { $gt: new Date() }
      },
      { 
        $set: { 
          isActive: true,
          emailVerified: new Date(),
          updatedAt: new Date()
        },
        $unset: { 
          emailVerificationToken: 1,
          emailVerificationExpiry: 1
        }
      },
      { returnDocument: 'after' }
    );
    return result.value;
  }

  // Rate limiting operations
  async getRateLimit(identifier: string): Promise<IRateLimit | null> {
    const db = await this.getDb();
    return await db.collection('ratelimits').findOne({ identifier });
  }

  async createOrUpdateRateLimit(rateLimitData: Omit<IRateLimit, '_id'>): Promise<void> {
    const db = await this.getDb();
    await db.collection('ratelimits').updateOne(
      { identifier: rateLimitData.identifier },
      { 
        $set: rateLimitData,
        $setOnInsert: { createdAt: new Date() }
      },
      { upsert: true }
    );
  }

  async resetRateLimit(identifier: string): Promise<void> {
    const db = await this.getDb();
    await db.collection('ratelimits').deleteOne({ identifier });
  }

  async cleanExpiredRateLimits(): Promise<void> {
    const db = await this.getDb();
    await db.collection('ratelimits').deleteMany({
      resetTime: { $lt: new Date() }
    });
  }

  // Security event logging
  async logSecurityEvent(eventData: Omit<ISecurityEvent, '_id' | 'timestamp'>): Promise<void> {
    const db = await this.getDb();
    await db.collection('securityevents').insertOne({
      ...eventData,
      timestamp: new Date()
    });
  }

  async getSecurityEvents(userId?: ObjectId, limit: number = 100): Promise<ISecurityEvent[]> {
    const db = await this.getDb();
    const query = userId ? { userId } : {};
    return await db.collection('securityevents')
      .find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();
  }
}

// Export a singleton instance with lazy initialization
let databaseInstance: Database | null = null;

export const database = {
  getInstance(): Database {
    if (!databaseInstance) {
      databaseInstance = new Database();
    }
    return databaseInstance;
  },
  
  // Proxy all Database methods
  async createUser(userData: Parameters<Database['createUser']>[0]) {
    return this.getInstance().createUser(userData);
  },
  
  async findUserByEmail(email: string) {
    return this.getInstance().findUserByEmail(email);
  },
  
  async findUserById(id: Parameters<Database['findUserById']>[0]) {
    return this.getInstance().findUserById(id);
  },
  
  async updateUser(id: Parameters<Database['updateUser']>[0], updateData: Parameters<Database['updateUser']>[1]) {
    return this.getInstance().updateUser(id, updateData);
  },
  
  async migrateUsersAddFullName() {
    return this.getInstance().migrateUsersAddFullName();
  },
  
  async createVerificationToken(tokenData: Parameters<Database['createVerificationToken']>[0]) {
    return this.getInstance().createVerificationToken(tokenData);
  },
  
  async findVerificationToken(token: string) {
    return this.getInstance().findVerificationToken(token);
  },
  
  async deleteVerificationToken(token: string) {
    return this.getInstance().deleteVerificationToken(token);
  },
  
  async createVerificationCode(codeData: Parameters<Database['createVerificationCode']>[0]) {
    return this.getInstance().createVerificationCode(codeData);
  },
  
  async findVerificationCode(code: string) {
    return this.getInstance().findVerificationCode(code);
  },
  
  async updateVerificationCode(code: string, updateData: Parameters<Database['updateVerificationCode']>[1]) {
    return this.getInstance().updateVerificationCode(code, updateData);
  },
  
  async addRefreshToken(userId: Parameters<Database['addRefreshToken']>[0], refreshToken: Parameters<Database['addRefreshToken']>[1]) {
    return this.getInstance().addRefreshToken(userId, refreshToken);
  },
  
  async removeRefreshToken(userId: Parameters<Database['removeRefreshToken']>[0], token: string) {
    return this.getInstance().removeRefreshToken(userId, token);
  },
  
  async removeAllRefreshTokens(userId: Parameters<Database['removeAllRefreshTokens']>[0]) {
    return this.getInstance().removeAllRefreshTokens(userId);
  },
  
  async findUserByRefreshToken(token: string) {
    return this.getInstance().findUserByRefreshToken(token);
  },
  
  async cleanExpiredRefreshTokens() {
    return this.getInstance().cleanExpiredRefreshTokens();
  },
  
  async incrementLoginAttempts(email: string) {
    return this.getInstance().incrementLoginAttempts(email);
  },
  
  async lockAccount(email: string, lockoutDuration: number) {
    return this.getInstance().lockAccount(email, lockoutDuration);
  },
  
  async resetLoginAttempts(email: string) {
    return this.getInstance().resetLoginAttempts(email);
  },
  
  async updateLastLogin(userId: Parameters<Database['updateLastLogin']>[0], ipAddress?: string) {
    return this.getInstance().updateLastLogin(userId, ipAddress);
  },
  
  async setEmailVerificationToken(email: string, token: string, expiresAt: Date) {
    return this.getInstance().setEmailVerificationToken(email, token, expiresAt);
  },
  
  async verifyEmail(token: string) {
    return this.getInstance().verifyEmail(token);
  },
  
  async getRateLimit(identifier: string) {
    return this.getInstance().getRateLimit(identifier);
  },
  
  async createOrUpdateRateLimit(rateLimitData: Parameters<Database['createOrUpdateRateLimit']>[0]) {
    return this.getInstance().createOrUpdateRateLimit(rateLimitData);
  },
  
  async resetRateLimit(identifier: string) {
    return this.getInstance().resetRateLimit(identifier);
  },
  
  async cleanExpiredRateLimits() {
    return this.getInstance().cleanExpiredRateLimits();
  },
  
  async logSecurityEvent(eventData: Parameters<Database['logSecurityEvent']>[0]) {
    return this.getInstance().logSecurityEvent(eventData);
  },
  
  async getSecurityEvents(userId?: Parameters<Database['getSecurityEvents']>[0], limit?: number) {
    return this.getInstance().getSecurityEvents(userId, limit);
  }
};
