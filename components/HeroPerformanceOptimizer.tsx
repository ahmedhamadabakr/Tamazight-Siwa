"use client"
import { useEffect } from "react"

// Performance optimization utilities for hero section
export function HeroPerformanceOptimizer() {
    useEffect(() => {
        // Preload critical resources
        const preloadImage = (src: string) => {
            const link = document.createElement('link')
            link.rel = 'preload'
            link.as = 'image'
            link.href = src
            document.head.appendChild(link)
        }

        // Preload hero background image
        preloadImage('/siwa-oasis-sunset-salt-lakes-reflection.jpg')

        // Optimize scroll performance
        let ticking = false
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    // Add scroll-based optimizations here if needed
                    ticking = false
                })
                ticking = true
            }
        }

        // Add passive scroll listener for better performance
        window.addEventListener('scroll', handleScroll, { passive: true })

        // Cleanup
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    return null
}

// Hook for intersection observer optimization
export function useIntersectionObserver(
    elementRef: React.RefObject<Element>,
    callback: (isIntersecting: boolean) => void,
    options?: IntersectionObserverInit
) {
    useEffect(() => {
        const element = elementRef.current
        if (!element) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                callback(entry.isIntersecting)
            },
            {
                threshold: 0.1,
                rootMargin: '50px',
                ...options
            }
        )

        observer.observe(element)

        return () => {
            observer.unobserve(element)
        }
    }, [elementRef, callback, options])
}