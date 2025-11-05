// All login-related rate limiting is removed. Only keep minimal utilities used elsewhere.

export class RateLimitService {
  getClientIP(_request: Request): string {
    return '127.0.0.1';
  }
}

// Export singleton instance
export const rateLimitService = new RateLimitService();
