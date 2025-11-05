/**
 * Mobile-optimized image component with lazy loading and responsive sizes
 */
import Image from 'next/image'
import { useState } from 'react'

interface MobileOptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  quality?: number
  sizes?: string
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
}

export function MobileOptimizedImage({
  src,
  alt,
  width = 800,
  height = 600,
  className = '',
  priority = false,
  quality = 75,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  placeholder = 'empty',
  blurDataURL,
  ...props
}: MobileOptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Generate blur placeholder for better UX
  const generateBlurDataURL = (w: number, h: number) => {
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#f3f4f6'
      ctx.fillRect(0, 0, w, h)
    }
    return canvas.toDataURL()
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{ aspectRatio: `${width}/${height}` }}
        />
      )}
      
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        quality={quality}
        priority={priority}
        sizes={sizes}
        placeholder={placeholder}
        blurDataURL={blurDataURL || generateBlurDataURL(20, 20)}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${hasError ? 'hidden' : ''}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false)
          setHasError(true)
        }}
        {...props}
      />
      
      {hasError && (
        <div 
          className="flex items-center justify-center bg-gray-100 text-gray-500"
          style={{ aspectRatio: `${width}/${height}` }}
        >
          <span className="text-sm">فشل تحميل الصورة</span>
        </div>
      )}
    </div>
  )
}

// Hook for responsive image sizes
export function useResponsiveImageSizes() {
  return {
    hero: '(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1200px',
    card: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px',
    gallery: '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 250px',
    avatar: '(max-width: 640px) 60px, 80px',
    thumbnail: '(max-width: 640px) 80px, 120px'
  }
}