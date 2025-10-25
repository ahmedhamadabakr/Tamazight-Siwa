import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { SECURITY_CONFIG } from './config';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface RefreshTokenData {
  token: string;
  expiresAt: Date;
  deviceInfo?: string;
  ipAddress?: string;
  createdAt: Date;
}

/**
 * Generates a JWT access token
 */
export function generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
  }

  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    {
      expiresIn: SECURITY_CONFIG.ACCESS_TOKEN_EXPIRY,
      algorithm: SECURITY_CONFIG.JWT_ALGORITHM,
    }
  );
}

/**
 * Generates a refresh token (UUID-based)
 */
export function generateRefreshToken(expiryDays: number = 30): RefreshTokenData {
  const token = randomUUID();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiryDays);

  return {
    token,
    expiresAt,
    createdAt: new Date(),
  };
}

/**
 * Generates both access and refresh tokens
 */
export function generateTokenPair(
  user: { id: string; email: string; role: string },
  rememberMe: boolean = false
): TokenPair {
  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  const refreshTokenData = generateRefreshToken(rememberMe ? 90 : 30);
  
  return {
    accessToken,
    refreshToken: refreshTokenData.token,
    expiresAt: refreshTokenData.expiresAt,
  };
}

/**
 * Verifies and decodes a JWT token
 */
export function verifyAccessToken(token: string): JWTPayload {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: [SECURITY_CONFIG.JWT_ALGORITHM],
    }) as JWTPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    }
    throw new Error('Token verification failed');
  }
}

/**
 * Generates email verification token
 */
export function generateEmailVerificationToken(): string {
  return randomUUID();
}

/**
 * Generates password reset token
 */
export function generatePasswordResetToken(): string {
  return randomUUID();
}