/**
 * Comprehensive performance optimization utilities for mobile and web
 */

// Critical resource preloader
export function preloadCriticalResources() {
  if (typeof window === 'undefined') return

  const criticalResources = [
    { href: '/fonts/geist-sans-400.woff2', as: 'font', type: 'font/woff2' },
    { href: '/fonts/geist-sans-600.woff2', as: 'font', type: 'font/woff2' },
    { href: '/siwa-oasis-sunset-salt-lakes-reflection.jpg', as: 'image' },
  ]

  criticalResources.forEach(resource => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = resource.href
    link.as = resource.as
    if (resource.type) link.type = resource.type
    if (resource.as === 'font') link.crossOrigin = 'anonymous'
    document.head.appendChild(link)
  })
}

// Mobile-specific optimizations
export function optimizeForMobile() {
  if (typeof window === 'undefined') return

  const isMobile = window.innerWidth <= 768
  
  if (isMobile) {
    // Reduce animations on mobile
    document.documentElement.classList.add('mobile-optimized')
    
    // Optimize scroll performance
    document.body.style.overscrollBehavior = 'none'
    
    // Disable hover effects on mobile
    const style = document.createElement('style')
    style.textContent = `
      @media (hover: none) {
        .hover\\:scale-105:hover {
          transform: none;
        }
        .hover\\:shadow-lg:hover {
          box-shadow: none;
        }
      }
    `
    document.head.appendChild(style)
  }
}

// Lazy loading with intersection observer
export function createLazyLoader(threshold = 0.1, rootMargin = '50px') {
  if (typeof window === 'undefined') return null

  return new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement
          
          // Load images
          if (target.dataset.src) {
            const img = target as HTMLImageElement
            img.src = target.dataset.src
            img.removeAttribute('data-src')
          }
          
          // Load components
          if (target.dataset.component) {
            target.classList.add('loaded')
          }
          
          // Trigger custom load event
          target.dispatchEvent(new CustomEvent('lazyload'))
        }
      })
    },
    { threshold, rootMargin }
  )
}

// Performance monitoring
export class PerformanceMonitor {
  private metrics: Map<string, number> = new Map()
  
  startTiming(label: string) {
    this.metrics.set(`${label}_start`, performance.now())
  }
  
  endTiming(label: string) {
    const start = this.metrics.get(`${label}_start`)
    if (start) {
      const duration = performance.now() - start
      this.metrics.set(label, duration)
      console.log(`${label}: ${duration.toFixed(2)}ms`)
      return duration
    }
    return 0
  }
  
  getMetric(label: string) {
    return this.metrics.get(label) || 0
  }
  
  getAllMetrics() {
    return Object.fromEntries(this.metrics)
  }
  
  // Core Web Vitals monitoring
  observeWebVitals() {
    if (typeof window === 'undefined') return

    // First Contentful Paint
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.set('FCP', entry.startTime)
        }
      }
    }).observe({ entryTypes: ['paint'] })

    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      this.metrics.set('LCP', lastEntry.startTime)
    }).observe({ entryTypes: ['largest-contentful-paint'] })

    // Cumulative Layout Shift
    let clsValue = 0
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value
          this.metrics.set('CLS', clsValue)
        }
      }
    }).observe({ entryTypes: ['layout-shift'] })
  }
}

// Image optimization utilities
export function optimizeImageLoading() {
  if (typeof window === 'undefined') return

  // Native lazy loading fallback
  const images = document.querySelectorAll('img[loading="lazy"]')
  
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading supported
    return
  }
  
  // Fallback for older browsers
  const imageObserver = createLazyLoader()
  if (imageObserver) {
    images.forEach(img => imageObserver.observe(img))
  }
}

// Bundle size monitoring
export function monitorBundleSize() {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') return

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name.includes('chunk')) {
        console.log(`Bundle: ${entry.name} - ${(entry.transferSize / 1024).toFixed(2)}KB`)
      }
    }
  })
  
  observer.observe({ entryTypes: ['navigation', 'resource'] })
}

// Memory usage monitoring
export function monitorMemoryUsage() {
  if (typeof window === 'undefined' || !(performance as any).memory) return

  const memory = (performance as any).memory
  
  return {
    used: Math.round(memory.usedJSHeapSize / 1048576), // MB
    total: Math.round(memory.totalJSHeapSize / 1048576), // MB
    limit: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
  }
}

// Network-aware optimizations
export function optimizeForConnection() {
  if (typeof window === 'undefined' || !(navigator as any).connection) return

  const connection = (navigator as any).connection
  const isSlowConnection = connection.effectiveType === 'slow-2g' || 
                          connection.effectiveType === '2g' ||
                          connection.saveData

  if (isSlowConnection) {
    // Disable non-essential animations
    document.documentElement.classList.add('reduce-animations')
    
    // Reduce image quality
    const images = document.querySelectorAll('img')
    images.forEach(img => {
      if (img.src.includes('quality=')) {
        img.src = img.src.replace(/quality=\d+/, 'quality=50')
      }
    })
  }
}

// Initialize all optimizations
export function initializePerformanceOptimizations() {
  if (typeof window === 'undefined') return

  const monitor = new PerformanceMonitor()
  
  // Start monitoring
  monitor.observeWebVitals()
  
  // Preload critical resources
  preloadCriticalResources()
  
  // Mobile optimizations
  optimizeForMobile()
  
  // Image optimizations
  optimizeImageLoading()
  
  // Network optimizations
  optimizeForConnection()
  
  // Bundle monitoring (dev only)
  if (process.env.NODE_ENV === 'development') {
    monitorBundleSize()
  }
  
  return monitor
}