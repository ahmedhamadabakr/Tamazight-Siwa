'use client'

import { useEffect } from 'react'

interface PerformanceMetrics {
  FCP?: number // First Contentful Paint
  LCP?: number // Largest Contentful Paint
  FID?: number // First Input Delay
  CLS?: number // Cumulative Layout Shift
  TTFB?: number // Time to First Byte
}

export function PerformanceMonitor() {
  useEffect(() => {
    if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') {
      return
    }

    const metrics: PerformanceMetrics = {}

    // Measure Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        switch (entry.entryType) {
          case 'paint':
            if (entry.name === 'first-contentful-paint') {
              metrics.FCP = entry.startTime
            }
            break
          case 'largest-contentful-paint':
            metrics.LCP = entry.startTime
            break
          case 'first-input':
            metrics.FID = (entry as any).processingStart - entry.startTime
            break
          case 'layout-shift':
            if (!(entry as any).hadRecentInput) {
              metrics.CLS = (metrics.CLS || 0) + (entry as any).value
            }
            break
          case 'navigation':
            const navEntry = entry as PerformanceNavigationTiming
            metrics.TTFB = navEntry.responseStart - navEntry.requestStart
            break
        }
      }
    })

    // Observe different entry types
    try {
      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift', 'navigation'] })
    } catch (e) {
      // Fallback for browsers that don't support all entry types
      console.warn('Performance Observer not fully supported')
    }

    // Report metrics after page load
    const reportMetrics = () => {
      if (Object.keys(metrics).length > 0) {
     
        // Send to analytics (if needed)
        if ((window as any).gtag) {
          Object.entries(metrics).forEach(([key, value]) => {
            (window as any).gtag('event', 'web_vitals', {
              event_category: 'Performance',
              event_label: key,
              value: Math.round(value),
            })
          })
        }
      }
    }

    // Report after 5 seconds to ensure all metrics are captured
    const timeout = setTimeout(reportMetrics, 5000)

    return () => {
      observer.disconnect()
      clearTimeout(timeout)
    }
  }, [])

  return null
}

// Resource hints component
export function ResourceHints() {
  return (
    <>
      {/* Prefetch likely next pages */}
      <link rel="prefetch" href="/gallery" />
      <link rel="prefetch" href="/contact" />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://res.cloudinary.com" />
      <link rel="preconnect" href="https://images.unsplash.com" />
    </>
  )
}