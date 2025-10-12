// Type definitions for the application

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

type VerificationStatus = 'verifying' | 'success' | 'error' | 'invalid';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  emailVerified?: Date | null;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface VerificationToken {
  id: string;
  identifier: string;
  token: string;
  expires: Date;
  userId: string;
  user: User;
}

// Extend the Window interface if needed
declare global {
  interface Window {
    // Add any global window properties here if needed
  }
}
