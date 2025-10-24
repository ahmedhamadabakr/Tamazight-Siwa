import { ObjectId } from 'mongodb';
import dbConnect from './mongodb';

// User interface
export interface IUser {
  _id?: ObjectId;
  name: string;
  fullName?: string; // Added full name field for profile display
  email: string;
  password: string;
  image?: string; // Added profile image field
  phone?: string;
  emailVerified?: Date;
  isActive: boolean;
  resetToken?: string; // Reset password token
  resetTokenExpiry?: Date; // Reset token expiry date
  createdAt?: Date;
  updatedAt?: Date;
  role: "user" | "manager" | "admin"; // Added role field
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

// Database operations class
export class Database {
  private db: Promise<any>;

  constructor() {
    this.db = dbConnect();
  }

  // User operations
  async createUser(userData: Omit<IUser, '_id' | 'createdAt' | 'updatedAt' | 'role'> & { role?: IUser['role'] }): Promise<IUser> {
    const db = await this.db;
    const now = new Date();
    const user: IUser = {
      ...userData,
      fullName: userData.fullName || userData.name, // Use fullName if provided, otherwise use name
      createdAt: now,
      updatedAt: now,
      role: userData.role || "user", // Default role to 'user'
    };

    const result = await db.collection('users').insertOne(user);
    return { ...user, _id: result.insertedId };
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    const db = await this.db;
    return await db.collection('users').findOne({ email });
  }

  async findUserById(id: ObjectId): Promise<IUser | null> {
    const db = await this.db;
    return await db.collection('users').findOne({ _id: id });
  }

  async updateUser(id: ObjectId, updateData: Partial<IUser>): Promise<IUser | null> {
    const db = await this.db;
    const result = await db.collection('users').findOneAndUpdate(
      { _id: id },
      { $set: { ...updateData, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    return result.value;
  }

  // Migration function to add fullName field for existing users
  async migrateUsersAddFullName(): Promise<void> {
    const db = await this.db;
    // Update users who don't have fullName field to use name as fullName
    await db.collection('users').updateMany(
      { fullName: { $exists: false } },
      { $set: { fullName: '$name', updatedAt: new Date() } }
    );
  }

  // VerificationToken operations
  async createVerificationToken(tokenData: Omit<IVerificationToken, '_id' | 'createdAt'>): Promise<IVerificationToken> {
    const db = await this.db;
    const now = new Date();
    const token: IVerificationToken = {
      ...tokenData,
      createdAt: now,
    };

    const result = await db.collection('verificationtokens').insertOne(token);
    return { ...token, _id: result.insertedId };
  }

  async findVerificationToken(token: string): Promise<IVerificationToken | null> {
    const db = await this.db;
    return await db.collection('verificationtokens').findOne({ token });
  }

  async deleteVerificationToken(token: string): Promise<boolean> {
    const db = await this.db;
    const result = await db.collection('verificationtokens').deleteOne({ token });
    return result.deletedCount > 0;
  }

  // VerificationCode operations
  async createVerificationCode(codeData: Omit<IVerificationCode, '_id' | 'createdAt'>): Promise<IVerificationCode> {
    const db = await this.db;
    const now = new Date();
    const code: IVerificationCode = {
      ...codeData,
      createdAt: now,
    };

    const result = await db.collection('verificationcodes').insertOne(code);
    return { ...code, _id: result.insertedId };
  }

  async findVerificationCode(code: string): Promise<IVerificationCode | null> {
    const db = await this.db;
    return await db.collection('verificationcodes').findOne({ code });
  }

  async updateVerificationCode(code: string, updateData: Partial<IVerificationCode>): Promise<IVerificationCode | null> {
    const db = await this.db;
    const result = await db.collection('verificationcodes').findOneAndUpdate(
      { code },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    return result.value;
  }
}

// Export a singleton instance
export const database = new Database();
