"use client"

import { useState } from 'react'
import Image from 'next/image'
import { ImageIcon } from 'lucide-react'

interface CloudinaryImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fill?: boolean
  priority?: boolean
  quality?: number
  sizes?: string
  transformation?: string
  onLoad?: () => void
  onError?: () => void
}

export function CloudinaryImage({
  src,
  alt,
  width,
  height,
  className = '',
  fill = false,
  priority = false,
  quality = 80,
  sizes,
  transformation,
  onLoad,
  onError
}: CloudinaryImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Check if it's a Cloudinary URL
  const isCloudinaryUrl = src.includes('cloudinary.com') || src.includes('res.cloudinary.com')

  // Generate optimized Cloudinary URL
  const getOptimizedUrl = (originalUrl: string, customTransformation?: string) => {


    if (!isCloudinaryUrl) {
      return originalUrl
    }

    try {
      const url = new URL(originalUrl)
      const pathParts = url.pathname.split('/')
      
      // Find the upload index
      const uploadIndex = pathParts.findIndex(part => part === 'upload')
      if (uploadIndex === -1) {
        console.warn('No "upload" found in Cloudinary URL:', originalUrl)
        return originalUrl
      }

      // Build transformation string
      let transformations = []
      
      if (customTransformation) {
        transformations.push(customTransformation)
      } else {
        // Default optimizations
        transformations.push(`q_auto:best`)
        transformations.push('f_auto')
        
        if (width && height) {
          transformations.push(`w_${width},h_${height},c_fill`)
        } else if (width) {
          transformations.push(`w_${width}`)
        } else if (height) {
          transformations.push(`h_${height}`)
        }
      }

      // Insert transformations after 'upload'
      if (transformations.length > 0) {
        pathParts.splice(uploadIndex + 1, 0, transformations.join(','))
      }

      url.pathname = pathParts.join('/')
      const optimizedUrl = url.toString()
      
      return optimizedUrl
    } catch (error) {
      console.warn('Error optimizing Cloudinary URL:', error)
      return originalUrl
    }
  }

  const optimizedSrc = getOptimizedUrl(src, transformation)

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
    onError?.()
  }

  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-gray-200 ${className}`}>
        <div className="text-center text-gray-500">
          <ImageIcon className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm">Failed to load image</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
          <ImageIcon className="h-8 w-8 text-gray-400" />
        </div>
      )}
      
      <Image
        src={optimizedSrc}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        quality={quality}
        sizes={sizes}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${fill ? 'object-cover' : (className?.includes('object-cover') ? 'object-cover' : 'object-contain')}`}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  )
}

// Hook for generating Cloudinary URLs
export function useCloudinaryUrl(
  originalUrl: string,
  options: {
    width?: number
    height?: number
    quality?: number
    format?: string
    transformation?: string
  } = {}
) {
  const { width, height, quality = 80, format = 'auto', transformation } = options

  if (!originalUrl.includes('cloudinary.com') && !originalUrl.includes('res.cloudinary.com')) {
    return originalUrl
  }

  try {
    const url = new URL(originalUrl)
    const pathParts = url.pathname.split('/')
    
    const uploadIndex = pathParts.findIndex(part => part === 'upload')
    if (uploadIndex === -1) return originalUrl

    let transformations = []
    
    if (transformation) {
      transformations.push(transformation)
    } else {
      transformations.push(`q_auto:best`)
      transformations.push(`f_${format}`)
      
      if (width && height) {
        transformations.push(`w_${width},h_${height},c_fill`)
      } else if (width) {
        transformations.push(`w_${width}`)
      } else if (height) {
        transformations.push(`h_${height}`)
      }
    }

    if (transformations.length > 0) {
      pathParts.splice(uploadIndex + 1, 0, transformations.join(','))
    }

    url.pathname = pathParts.join('/')
    return url.toString()
  } catch (error) {
    console.warn('Error generating Cloudinary URL:', error)
    return originalUrl
  }
}