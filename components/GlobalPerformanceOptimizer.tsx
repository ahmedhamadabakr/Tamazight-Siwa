"use client"
import { useEffect, useState } from "react"
import { PerformanceMonitor } from "@/components/PerformanceMonitor"

// Global performance optimization system
export function GlobalPerformanceOptimizer() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Critical resource preloading is handled in layout.tsx to avoid hydration issues
    const preloadCriticalResources = () => {
      // Resources are preloaded in layout.tsx
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
        { 
          rootMargin: '100px',
          threshold: 0.1
        }
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
          // Register service worker after page load
          window.addEventListener('load', async () => {
            await navigator.serviceWorker.register('/sw.js', {
              scope: '/',
              updateViaCache: 'none'
            })
          })
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
        font-display: swap;
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
      
      /* Optimize hero text for LCP */
      h1 {
        font-size: 2.5rem;
        font-weight: 700;
        line-height: 1.2;
        margin: 0 0 1rem 0;
        contain: layout style paint;
      }
      
      @media (min-width: 768px) {
        h1 { font-size: 3.75rem; }
      }
      
      @media (min-width: 1024px) {
        h1 { font-size: 4.5rem; }
      }
      
      /* GPU acceleration */
      .gpu-accelerated {
        transform: translateZ(0);
        will-change: transform;
        backface-visibility: hidden;
      }
      
      /* Prevent layout shift */
      img {
        max-width: 100%;
        height: auto;
        aspect-ratio: attr(width) / attr(height);
      }
      
      /* Reserve space for hero image */
      .hero-section img {
        width: 100%;
        height: 100vh;
        object-fit: cover;
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