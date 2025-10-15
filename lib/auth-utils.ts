import { signOut } from 'next-auth/react';

export const handleSignOut = async (redirectPath: string = '/') => {
  // Clear all NextAuth cookies
  await signOut({ 
    callbackUrl: redirectPath,
    redirect: true
  });
  
  // Clear any additional client-side storage if needed
  if (typeof window !== 'undefined') {
    localStorage.clear();
    sessionStorage.clear();
  }
};
