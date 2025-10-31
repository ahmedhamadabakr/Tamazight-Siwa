// Security configuration constants
export const SECURITY_CONFIG = {
  // Password security - Reduced for Vercel performance
  BCRYPT_SALT_ROUNDS: process.env.NODE_ENV === 'production' ? 10 : 8,
  MIN_PASSWORD_SCORE: 2, // zxcvbn score (0-4, where 2 is "fair")
  
  // Token expiration
  ACCESS_TOKEN_EXPIRY: '15m',
  REFRESH_TOKEN_EXPIRY: '30d',
  REMEMBER_ME_EXPIRY: '90d',
  EMAIL_VERIFICATION_EXPIRY: '24h',
  
  // Rate limiting
  MAX_LOGIN_ATTEMPTS: 5,
  LOGIN_LOCKOUT_DURATION: 10 * 60 * 1000, // 10 minutes in milliseconds
  RATE_LIMIT_WINDOW: 10 * 60 * 1000, // 10 minutes
  
  // Security headers
  CONTENT_SECURITY_POLICY: `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https: res.cloudinary.com;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://vercel.live wss://ws.pusherapp.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s+/g, ' ').trim(),
  
  // Cookie settings
  COOKIE_CONFIG: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  // JWT settings
  JWT_ALGORITHM: 'HS256' as const,
} as const;

// Environment validation
export function validateSecurityEnv() {
  const requiredEnvVars = ['JWT_SECRET', 'NEXTAUTH_SECRET'];
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.warn('JWT_SECRET should be at least 32 characters long for security');
  }
}