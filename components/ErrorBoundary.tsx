'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo)
    
    // Report to error tracking service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { contexts: { errorInfo } })
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100">
          <div className="text-center p-8 max-w-md mx-auto">
            <div className="mb-6">
              <svg className="w-16 h-16 text-amber-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-amber-800 mb-4">Oops! Something went wrong</h2>
            <p className="text-amber-700 mb-6">
              We're sorry for the inconvenience. Please try refreshing the page or contact us if the problem persists.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
              >
                Refresh Page
              </button>
              <button
                onClick={() => window.history.back()}
                className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook for error handling in functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo)
    
    if (process.env.NODE_ENV === 'production') {
      // Report to error tracking service
    }
  }
}