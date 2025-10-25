import { database } from '../models';
import { SECURITY_CONFIG } from './config';

export interface RateLimitResult {
  allowed: boolean;
  remainingAttempts: number;
  resetTime?: Date;
  retryAfter?: number; // seconds until next attempt allowed
}

export class RateLimitService {
  /**
   * Check if an identifier (IP or email) is within rate limits
   */
  async checkLoginAttempts(identifier: string): Promise<RateLimitResult> {
    try {
      const rateLimit = await database.getRateLimit(identifier);
      const now = new Date();

      // If no rate limit record exists, allow the request
      if (!rateLimit) {
        return {
          allowed: true,
          remainingAttempts: SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS - 1,
        };
      }

      // If the rate limit window has expired, reset and allow
      if (now > rateLimit.resetTime) {
        await database.resetRateLimit(identifier);
        return {
          allowed: true,
          remainingAttempts: SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS - 1,
        };
      }

      // Check if attempts exceed the limit
      if (rateLimit.attempts >= SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS) {
        const retryAfter = Math.ceil((rateLimit.resetTime.getTime() - now.getTime()) / 1000);
        return {
          allowed: false,
          remainingAttempts: 0,
          resetTime: rateLimit.resetTime,
          retryAfter,
        };
      }

      // Within limits, calculate remaining attempts
      const remainingAttempts = SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS - rateLimit.attempts - 1;
      return {
        allowed: true,
        remainingAttempts: Math.max(0, remainingAttempts),
        resetTime: rateLimit.resetTime,
      };
    } catch (error) {
      console.error('Rate limit check error:', error);
      // On error, allow the request but log the issue
      return {
        allowed: true,
        remainingAttempts: SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS - 1,
      };
    }
  }

  /**
   * Record a login attempt (success or failure)
   */
  async recordLoginAttempt(identifier: string, success: boolean): Promise<void> {
    try {
      const now = new Date();
      const resetTime = new Date(now.getTime() + SECURITY_CONFIG.RATE_LIMIT_WINDOW);

      if (success) {
        // On successful login, reset the rate limit
        await database.resetRateLimit(identifier);
        return;
      }

      // On failed login, increment attempts
      const existingRateLimit = await database.getRateLimit(identifier);

      if (!existingRateLimit) {
        // Create new rate limit record
        await database.createOrUpdateRateLimit({
          identifier,
          attempts: 1,
          lastAttempt: now,
          resetTime,
        });
      } else {
        // Update existing record
        const newAttempts = now > existingRateLimit.resetTime ? 1 : existingRateLimit.attempts + 1;
        const newResetTime = now > existingRateLimit.resetTime ? resetTime : existingRateLimit.resetTime;

        await database.createOrUpdateRateLimit({
          identifier,
          attempts: newAttempts,
          lastAttempt: now,
          resetTime: newResetTime,
        });
      }
    } catch (error) {
      console.error('Failed to record login attempt:', error);
      // Don't throw error to avoid breaking the login flow
    }
  }

  /**
   * Reset rate limit for an identifier
   */
  async resetLoginAttempts(identifier: string): Promise<void> {
    try {
      await database.resetRateLimit(identifier);
    } catch (error) {
      console.error('Failed to reset login attempts:', error);
    }
  }

  /**
   * Check if an account should be locked based on failed attempts
   */
  async shouldLockAccount(email: string): Promise<boolean> {
    try {
      const rateLimit = await database.getRateLimit(email);
      return rateLimit ? rateLimit.attempts >= SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS : false;
    } catch (error) {
      console.error('Failed to check account lock status:', error);
      return false;
    }
  }

  /**
   * Get rate limit status for an identifier
   */
  async getRateLimitStatus(identifier: string): Promise<RateLimitResult> {
    return this.checkLoginAttempts(identifier);
  }

  /**
   * Clean up expired rate limit records (should be run periodically)
   */
  async cleanupExpiredRecords(): Promise<void> {
    try {
      await database.cleanExpiredRateLimits();
    } catch (error) {
      console.error('Failed to cleanup expired rate limits:', error);
    }
  }

  /**
   * Get client IP address from request headers
   */
  getClientIP(request: Request): string {
    // Check various headers for the real IP address
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const cfConnectingIP = request.headers.get('cf-connecting-ip');
    
    if (forwarded) {
      // x-forwarded-for can contain multiple IPs, take the first one
      return forwarded.split(',')[0].trim();
    }
    
    if (realIP) {
      return realIP;
    }
    
    if (cfConnectingIP) {
      return cfConnectingIP;
    }
    
    // Fallback to a default IP if none found
    return '127.0.0.1';
  }
}

// Export singleton instance
export const rateLimitService = new RateLimitService();