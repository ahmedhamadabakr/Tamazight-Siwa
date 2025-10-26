"use client"
import { useEffect, useState } from 'react'

// Animation optimization based on device capabilities
export function AnimationOptimizer() {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false)
  const [deviceCapabilities, setDeviceCapabilities] = useState({
    isLowEnd: false,
    hasSlowConnection: false,
    prefersReducedMotion: false
  })

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setShouldReduceMotion(mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => {
      setShouldReduceMotion(e.matches)
    }
    
    mediaQuery.addEventListener('change', handleChange)

    // Detect device capabilities
    const detectCapabilities = () => {
      if (typeof navigator === 'undefined') return;
      
      const connection = (navigator as any).connection
      const memory = (navigator as any).deviceMemory
      const hardwareConcurrency = navigator.hardwareConcurrency

      const capabilities = {
        isLowEnd: memory < 4 || hardwareConcurrency < 4,
        hasSlowConnection: connection && ['slow-2g', '2g', '3g'].includes(connection.effectiveType),
        prefersReducedMotion: mediaQuery.matches
      }

      setDeviceCapabilities(capabilities)

      // Apply optimizations based on capabilities
      if (capabilities.isLowEnd || capabilities.hasSlowConnection || capabilities.prefersReducedMotion) {
        document.documentElement.classList.add('reduce-animations')
      }
    }

    detectCapabilities()

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  // Apply CSS optimizations
  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    const style = document.createElement('style')
    style.textContent = `
      /* Animation optimizations */
      .reduce-animations * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
      
      /* GPU acceleration for smooth animations */
      .gpu-accelerated {
        transform: translateZ(0);
        will-change: transform;
        backface-visibility: hidden;
        perspective: 1000px;
      }
      
      /* Optimize backdrop filters */
      .backdrop-blur-optimized {
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
      }
      
      @supports not (backdrop-filter: blur()) {
        .backdrop-blur-optimized {
          background: rgba(255, 255, 255, 0.8);
        }
      }
      
      /* Intersection-based animations */
      .animate-on-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
      }
      
      .animate-on-scroll.visible {
        opacity: 1;
        transform: translateY(0);
      }
      
      /* Performance-optimized hover effects */
      .hover-optimized {
        transition: transform 0.2s ease;
      }
      
      .hover-optimized:hover {
        transform: translateY(-2px);
      }
      
      /* Smooth scrolling with performance consideration */
      @media (prefers-reduced-motion: no-preference) {
        html {
          scroll-behavior: smooth;
        }
      }
    `
    
    document.head.appendChild(style)

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style)
      }
    }
  }, [deviceCapabilities])

  return null
}

// Hook for intersection-based animations
export function useIntersectionAnimation(threshold = 0.1) {
  const [isVisible, setIsVisible] = useState(false)
  const [ref, setRef] = useState<Element | null>(null)

  useEffect(() => {
    if (!ref || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(ref)
        }
      },
      { threshold, rootMargin: '50px' }
    )

    observer.observe(ref)

    return () => {
      if (ref) observer.unobserve(ref)
    }
  }, [ref, threshold])

  return { ref: setRef, isVisible }
}