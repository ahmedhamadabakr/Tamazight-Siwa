import { SECURITY_CONFIG } from './config';

// This entire service is disabled as per user request to remove all login restrictions.
// The methods are kept to prevent import errors, but they do nothing.

export interface RateLimitResult {
  allowed: boolean;
  remainingAttempts: number;
  resetTime?: Date;
  retryAfter?: number;
}

export class RateLimitService {
  async checkLoginAttempts(identifier: string): Promise<RateLimitResult> {
    return {
      allowed: true,
      remainingAttempts: 999,
    };
  }

  async recordLoginAttempt(identifier: string, success: boolean): Promise<void> {
    return;
  }

  async resetLoginAttempts(identifier: string): Promise<void> {
    return;
  }

  async shouldLockAccount(email: string): Promise<boolean> {
    return false;
  }

  async getRateLimitStatus(identifier: string): Promise<RateLimitResult> {
    return {
      allowed: true,
      remainingAttempts: 999,
    };
  }

  async cleanupExpiredRecords(): Promise<void> {
    return;
  }

  getClientIP(request: Request): string {
    return '127.0.0.1';
  }
}

// Export singleton instance
export const rateLimitService = new RateLimitService();
