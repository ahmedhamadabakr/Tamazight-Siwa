// Security utilities barrel export
export * from './config';
export * from './password';
export * from './tokens';
export * from './validation';
export * from './rate-limit';
export * from './cleanup';
export * from './constants';

// Re-export commonly used types
export type {
  PasswordStrength,
  JWTPayload,
  TokenPair,
  RefreshTokenData,
} from './tokens';

// Security error types
export enum SecurityErrorCodes {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  WEAK_PASSWORD = 'WEAK_PASSWORD',
  INVALID_INPUT = 'INVALID_INPUT',
}

export interface SecurityError {
  code: SecurityErrorCodes;
  message: string;
  details?: any;
  timestamp: Date;
}

export class AuthenticationError extends Error {
  public readonly code: SecurityErrorCodes;
  public readonly details?: any;
  public readonly timestamp: Date;

  constructor(code: SecurityErrorCodes, message: string, details?: any) {
    super(message);
    this.name = 'AuthenticationError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date();
  }
}

export class AuthorizationError extends Error {
  public readonly code: SecurityErrorCodes;
  public readonly details?: any;
  public readonly timestamp: Date;

  constructor(code: SecurityErrorCodes, message: string, details?: any) {
    super(message);
    this.name = 'AuthorizationError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date();
  }
}