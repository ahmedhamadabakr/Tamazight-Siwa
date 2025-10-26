"use client"
import { memo, useState, useEffect } from 'react'

// Font optimization component
export const FontOptimizer = memo(() => {
  return (
    <>
      {/* Font loading is handled in layout.tsx to avoid hydration issues */}
      
      {/* Fallback font loading */}
      <style jsx>{`
        .font-loading {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        
        .font-loaded {
          font-family: 'Cairo', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
      `}</style>
    </>
  )
})

FontOptimizer.displayName = 'FontOptimizer'

// Font loading hook
export function useFontLoading() {
  if (typeof window === 'undefined') return { isLoaded: false }

  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const loadFont = async () => {
      try {
        if (document.fonts && document.fonts.load) {
          await document.fonts.load('400 1rem Cairo')
        }
        setIsLoaded(true)
        document.documentElement.classList.add('font-loaded')
      } catch (error) {
        console.warn('Font loading failed:', error)
        setIsLoaded(true) // Use fallback
      }
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        setIsLoaded(true)
        document.documentElement.classList.add('font-loaded')
      })
    } else {
      // Fallback for browsers without font loading API
      setTimeout(() => {
        setIsLoaded(true)
        document.documentElement.classList.add('font-loaded')
      }, 1000)
    }
  }, [])

  return { isLoaded }
}