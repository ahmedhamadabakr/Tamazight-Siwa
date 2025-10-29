import { database } from '@/lib/models';

/**
 * Cleanup service for expired tokens and rate limits
 */
export class SecurityCleanupService {
  private static instance: SecurityCleanupService;
  private cleanupInterval: NodeJS.Timeout | null = null;
  private isRunning = false;

  private constructor() {}

  static getInstance(): SecurityCleanupService {
    if (!SecurityCleanupService.instance) {
      SecurityCleanupService.instance = new SecurityCleanupService();
    }
    return SecurityCleanupService.instance;
  }

  /**
   * Start the cleanup service
   */
  start(intervalMinutes: number = 60): void {
    if (this.isRunning) {
      console.log('Security cleanup service is already running');
      return;
    }

    this.isRunning = true;
    console.log(`Starting security cleanup service (interval: ${intervalMinutes} minutes)`);

    // Run cleanup immediately
    this.runCleanup();

    // Schedule periodic cleanup
    this.cleanupInterval = setInterval(() => {
      this.runCleanup();
    }, intervalMinutes * 60 * 1000);
  }

  /**
   * Stop the cleanup service
   */
  stop(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.isRunning = false;
    console.log('Security cleanup service stopped');
  }

  /**
   * Run cleanup tasks
   */
  private async runCleanup(): Promise<void> {
    try {
      console.log('Running security cleanup tasks...');
      
      const startTime = Date.now();
      
      // Run cleanup tasks in parallel
      await Promise.allSettled([
        this.cleanupExpiredRefreshTokens(),
        this.cleanupExpiredRateLimits(),
        this.cleanupOldSecurityEvents(),
      ]);

      const duration = Date.now() - startTime;
      console.log(`Security cleanup completed in ${duration}ms`);
      
    } catch (error) {
      console.error('Error during security cleanup:', error);
    }
  }

  /**
   * Clean up expired refresh tokens
   */
  private async cleanupExpiredRefreshTokens(): Promise<void> {
    try {
      await database.cleanExpiredRefreshTokens();
      console.log('Cleaned up expired refresh tokens');
    } catch (error) {
      console.error('Error cleaning up expired refresh tokens:', error);
    }
  }

  /**
   * Clean up expired rate limits
   */
  private async cleanupExpiredRateLimits(): Promise<void> {
    try {
      await database.cleanExpiredRateLimits();
      console.log('Cleaned up expired rate limits');
    } catch (error) {
      console.error('Error cleaning up expired rate limits:', error);
    }
  }

  /**
   * Clean up old security events (keep last 1000 per user, or events older than 90 days)
   */
  private async cleanupOldSecurityEvents(): Promise<void> {
    try {
      // This would require a new database method
      // For now, we'll just log that this cleanup is needed
      console.log('Security events cleanup - implementation needed');
    } catch (error) {
      console.error('Error cleaning up old security events:', error);
    }
  }

  /**
   * Manual cleanup trigger
   */
  async runManualCleanup(): Promise<void> {
    console.log('Running manual security cleanup...');
    await this.runCleanup();
  }

  /**
   * Get cleanup service status
   */
  getStatus(): { isRunning: boolean; intervalSet: boolean } {
    return {
      isRunning: this.isRunning,
      intervalSet: this.cleanupInterval !== null,
    };
  }
}

// Export singleton instance
export const securityCleanup = SecurityCleanupService.getInstance();

// Auto-start in production
if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
  // Start cleanup service with 1-hour interval
  securityCleanup.start(60);
}