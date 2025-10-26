'use client'

import { SessionProvider } from 'next-auth/react'
import { AuthErrorBoundary } from './AuthErrorBoundary'

export function AuthProvider({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <AuthErrorBoundary>
      <SessionProvider 
        refetchInterval={0} // Disable automatic refetch to prevent conflicts
        refetchOnWindowFocus={false} // Disable refetch on focus to prevent conflicts
        refetchWhenOffline={false} // Don't refetch when offline
        basePath="/api/auth" // Ensure correct auth path
      >
        {children}
      </SessionProvider>
    </AuthErrorBoundary>
  )
}
