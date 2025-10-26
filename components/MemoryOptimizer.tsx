"use client"
import { useEffect, useCallback, useRef } from 'react'

// Memory optimization utilities
export function MemoryOptimizer() {
  const cleanupRef = useRef<(() => void)[]>([])

  useEffect(() => {
    // Image lazy loading with memory management
    const optimizeImages = () => {
      const images = document.querySelectorAll('img[data-src]')
      const imageObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement
              img.src = img.dataset.src!
              img.removeAttribute('data-src')
              imageObserver.unobserve(img)
            }
          })
        },
        { rootMargin: '50px' }
      )

      images.forEach(img => imageObserver.observe(img))
      
      cleanupRef.current.push(() => imageObserver.disconnect())
    }

    // Video memory management
    const optimizeVideos = () => {
      const videos = document.querySelectorAll('video')
      
      const videoObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            const video = entry.target as HTMLVideoElement
            if (entry.isIntersecting) {
              if (video.paused) video.play()
            } else {
              if (!video.paused) video.pause()
            }
          })
        },
        { threshold: 0.5 }
      )

      videos.forEach(video => {
        videoObserver.observe(video)
        
        // Preload metadata only
        video.preload = 'metadata'
        
        // Clean up video resources when not needed
        video.addEventListener('ended', () => {
          video.src = ''
          video.load()
        })
      })

      cleanupRef.current.push(() => videoObserver.disconnect())
    }

    // DOM cleanup for unused elements
    const cleanupDOM = () => {
      const cleanupInterval = setInterval(() => {
        // Remove hidden elements that are no longer needed
        const hiddenElements = document.querySelectorAll('[style*="display: none"]')
        hiddenElements.forEach(element => {
          if (element.getAttribute('data-keep') !== 'true') {
            element.remove()
          }
        })

        // Clean up event listeners on removed elements
        const removedElements = document.querySelectorAll('[data-removed="true"]')
        removedElements.forEach(element => element.remove())
      }, 30000) // Every 30 seconds

      cleanupRef.current.push(() => clearInterval(cleanupInterval))
    }

    // Memory pressure handling
    const handleMemoryPressure = () => {
      if ('memory' in performance) {
        const memoryInfo = (performance as any).memory
        const usedMemory = memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit

        if (usedMemory > 0.8) {
          // High memory usage - trigger cleanup
          triggerMemoryCleanup()
        }
      }
    }

    // Garbage collection hints
    const scheduleGC = () => {
      if (typeof window !== 'undefined' && window.gc && typeof window.gc === 'function') {
        const gcInterval = setInterval(() => {
          if (typeof document !== 'undefined' && document.hidden && window.gc) {
            window.gc()
          }
        }, 60000) // Every minute when tab is hidden

        cleanupRef.current.push(() => clearInterval(gcInterval))
      }
    }

    // Initialize optimizations
    optimizeImages()
    optimizeVideos()
    cleanupDOM()
    scheduleGC()

    // Monitor memory usage
    const memoryInterval = setInterval(handleMemoryPressure, 10000)
    cleanupRef.current.push(() => clearInterval(memoryInterval))

    // Cleanup on unmount
    return () => {
      cleanupRef.current.forEach(cleanup => cleanup())
      cleanupRef.current = []
    }
  }, [])

  const triggerMemoryCleanup = useCallback(() => {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;
    
    // Remove cached images that are not visible
    const images = document.querySelectorAll('img')
    images.forEach(img => {
      const rect = img.getBoundingClientRect()
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0
      
      if (!isVisible && img.src && !img.dataset.critical) {
        img.src = ''
      }
    })

    // Clear unused caches
    if (typeof window !== 'undefined' && 'caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          if (cacheName.includes('old-') || cacheName.includes('temp-')) {
            caches.delete(cacheName)
          }
        })
      })
    }

    // Force garbage collection if available
    if (typeof window !== 'undefined' && window.gc && typeof window.gc === 'function') {
      window.gc()
    }
  }, [])

  return null
}

// Hook for component-level memory optimization
export function useMemoryOptimization() {
  const componentRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = componentRef.current
    if (!element) return

    // Clean up component resources when it's not visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          // Component is not visible - clean up heavy resources
          const videos = element.querySelectorAll('video')
          videos.forEach(video => {
            if (!video.paused) video.pause()
          })

          const canvases = element.querySelectorAll('canvas')
          canvases.forEach(canvas => {
            const ctx = canvas.getContext('2d')
            if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
          })
        }
      },
      { threshold: 0 }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return componentRef
}