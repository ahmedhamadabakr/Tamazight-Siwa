'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { signOut } from 'next-auth/react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class AuthErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    // Check if it's an authentication error
    if (error.message.includes('JWT') || error.message.includes('session') || error.message.includes('auth')) {
      return { hasError: true, error }
    }
    
    // Let other errors bubble up
    throw error
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Auth Error Boundary caught an error:', error, errorInfo)
    
    // If it's a JWT error, sign out the user
    if (error.message.includes('JWT') || error.message.includes('exp')) {
      signOut({ callbackUrl: '/login?error=session_expired' })
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="text-center p-8 max-w-md mx-auto">
            <div className="mb-6">
              <svg className="w-16 h-16 text-blue-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-blue-800 mb-4">Session Expired</h2>
            <p className="text-blue-700 mb-6">
              Your session has expired. Please sign in again to continue.
            </p>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In Again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}