'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useCallback } from 'react'

export function useAuthSession() {
  const { data: session, status, update } = useSession()

  // Auto-refresh session every 10 minutes
  const refreshSession = useCallback(async () => {
    if (session) {
      try {
        await update()
        console.log('Session refreshed successfully')
      } catch (error) {
        console.error('Failed to refresh session:', error)
      }
    }
  }, [session, update])

  useEffect(() => {
    if (status === 'authenticated') {
      // Set up auto-refresh interval
      const interval = setInterval(refreshSession, 10 * 60 * 1000) // 10 minutes
      
      // Refresh on page visibility change
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          refreshSession()
        }
      }
      
      document.addEventListener('visibilitychange', handleVisibilityChange)
      
      return () => {
        clearInterval(interval)
        document.removeEventListener('visibilitychange', handleVisibilityChange)
      }
    }
  }, [status, refreshSession])

  return {
    session,
    status,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    refreshSession
  }
}