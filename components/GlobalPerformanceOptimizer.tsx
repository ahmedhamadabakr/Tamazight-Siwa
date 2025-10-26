"use client"
import { useEffect, useState } from "react"
import { PerformanceMonitor } from "@/components/PerformanceMonitor"

// Global performance optimization system
export function GlobalPerformanceOptimizer() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Critical resource preloading
    const preloadCriticalResources = () => {
      if (typeof window === 'undefined' || typeof document === 'undefined') return;
      
      const criticalImages = [
        '/siwa-oasis-sunset-salt-lakes-reflection.jpg',
        '/logo.png',
        '/favicon.ico'
      ]

      criticalImages.forEach(src => {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.as = 'image'
        link.href = src
        document.head.appendChild(link)
      })
    }



    // Lazy load non-critical resources
    const lazyLoadResources = () => {
      if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return;
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement
              if (img.dataset.src) {
                img.src = img.dataset.src
                img.removeAttribute('data-src')
                observer.unobserve(img)
              }
            }
          })
        },
        { rootMargin: '50px' }
      )

      // Observe all lazy images
      document.querySelectorAll('img[data-src]').forEach(img => {
        observer.observe(img)
      })
    }

    // Service Worker registration for caching
    const registerServiceWorker = async () => {
      if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
      
      if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
        try {
          await navigator.serviceWorker.register('/sw.js')
        } catch (error) {
          console.warn('Service Worker registration failed:', error)
        }
      }
    }

    // Connection-aware loading
    const optimizeForConnection = () => {
      if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
      
      const connection = (navigator as any).connection
      if (connection) {
        const isSlowConnection = connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g'
        
        if (isSlowConnection) {
          // Reduce image quality for slow connections
          document.documentElement.style.setProperty('--image-quality', '60')
          // Disable non-essential animations
          document.documentElement.classList.add('reduce-motion')
        }
      }
    }

    // Memory management
    const optimizeMemory = () => {
      if (typeof window === 'undefined') return () => {};
      
      // Clean up unused resources periodically
      const cleanup = () => {
        if (window.gc && typeof window.gc === 'function') {
          window.gc()
        }
      }

      // Run cleanup every 5 minutes
      const cleanupInterval = setInterval(cleanup, 5 * 60 * 1000)
      
      return () => clearInterval(cleanupInterval)
    }

    // Initialize optimizations
    preloadCriticalResources()
    lazyLoadResources()
    registerServiceWorker()
    optimizeForConnection()
    const cleanupMemory = optimizeMemory()

    // Visibility change optimization
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden)
    }

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', handleVisibilityChange)
    }

    return () => {
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', handleVisibilityChange)
      }
      cleanupMemory()
    }
  }, [])

  // Pause expensive operations when tab is not visible
  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    if (!isVisible) {
      // Pause animations, videos, etc.
      document.querySelectorAll('video').forEach(video => {
        video.pause()
      })
    }
  }, [isVisible])

  return <PerformanceMonitor />
}

// Critical CSS inlining component
export function CriticalCSS() {
  return (
    <style jsx>{`
      /* Critical above-the-fold styles */
      body {
        font-family: 'Cairo', system-ui, -apple-system, sans-serif;
        margin: 0;
        padding: 0;
        background-color: oklch(0.98 0.01 85);
        color: oklch(0.25 0.02 45);
      }
      
      .hero-section {
        height: 100vh;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }
      
      .hero-gradient {
        background: linear-gradient(135deg, oklch(0.35 0.05 30) 0%, oklch(0.55 0.12 65) 100%);
      }
      
      /* Prevent layout shift */
      img {
        max-width: 100%;
        height: auto;
      }
      
      /* Loading states */
      .loading-skeleton {
        background: linear-gradient(90deg, 
          oklch(0.92 0.02 75) 25%, 
          oklch(0.88 0.02 70) 50%, 
          oklch(0.92 0.02 75) 75%
        );
        background-size: 200% 100%;
        animation: loading-shimmer 1.5s infinite;
      }
      
      @keyframes loading-shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
    `}</style>
  )
}