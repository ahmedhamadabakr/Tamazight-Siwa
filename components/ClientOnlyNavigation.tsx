'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Navigation skeleton for loading state
function NavigationSkeleton() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Logo skeleton */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
            <div>
              <div className="w-32 h-5 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-24 h-3 bg-gray-200 rounded animate-pulse mt-1"></div>
            </div>
          </div>

          {/* Desktop nav skeleton */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-24 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Mobile button skeleton */}
          <div className="md:hidden">
            <div className="w-10 h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </nav>
  )
}

// Dynamically import the Navigation component with no SSR
const Navigation = dynamic(() => import('./navigation').then(mod => ({ default: mod.Navigation })), {
  ssr: false,
  loading: () => <NavigationSkeleton />
})

export function ClientOnlyNavigation() {
  return (
    <Suspense fallback={<NavigationSkeleton />}>
      <Navigation key="navigation" />
    </Suspense>
  )
}