'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

// Mobile performance monitoring
export function MobilePerformanceMonitor() {
  const [metrics, setMetrics] = useState<{
    fcp?: number
    lcp?: number
    cls?: number
    fid?: number
  }>({})

  useEffect(() => {
    // Monitor Core Web Vitals for mobile
    if (typeof window !== 'undefined' && 'performance' in window) {
      // First Contentful Paint
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            setMetrics(prev => ({ ...prev, fcp: entry.startTime }))
          }
        }
      })
      observer.observe({ entryTypes: ['paint'] })

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }))
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

      // Cumulative Layout Shift
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value
            setMetrics(prev => ({ ...prev, cls: clsValue }))
          }
        }
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })

      return () => {
        observer.disconnect()
        lcpObserver.disconnect()
        clsObserver.disconnect()
      }
    }
  }, [])

  // Only show in development
  if (process.env.NODE_ENV === 'production') return null

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded text-xs z-50 md:hidden">
      <div>FCP: {metrics.fcp?.toFixed(0)}ms</div>
      <div>LCP: {metrics.lcp?.toFixed(0)}ms</div>
      <div>CLS: {metrics.cls?.toFixed(3)}</div>
    </div>
  )
}

// Mobile-optimized lazy loading component
export function MobileLazyWrapper({ 
  children, 
  threshold = 0.1,
  rootMargin = '50px'
}: {
  children: React.ReactNode
  threshold?: number
  rootMargin?: string
}) {
  const [isVisible, setIsVisible] = useState(false)
  const [ref, setRef] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!ref) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(ref)
    return () => observer.disconnect()
  }, [ref, threshold, rootMargin])

  return (
    <div ref={setRef}>
      {isVisible ? children : (
        <div className="h-32 bg-gray-100 animate-pulse rounded" />
      )}
    </div>
  )
}

// Mobile navigation prefetch
export function MobileNavPrefetch({ routes }: { routes: string[] }) {
  const router = useRouter()

  useEffect(() => {
    // Prefetch critical routes on mobile
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      routes.forEach(route => {
        router.prefetch(route)
      })
    }
  }, [router, routes])

  return null
}

// Mobile font optimization
export function MobileFontOptimizer() {
  useEffect(() => {
    // Preload critical fonts for mobile
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'font'
    link.type = 'font/woff2'
    link.crossOrigin = 'anonymous'
    link.href = '/fonts/geist-sans.woff2'
    document.head.appendChild(link)

    return () => {
      document.head.removeChild(link)
    }
  }, [])

  return null
}