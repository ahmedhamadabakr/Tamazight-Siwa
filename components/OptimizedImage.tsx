import Image from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  sizes?: string
  fill?: boolean
  loading?: 'lazy' | 'eager'
  onLoad?: () => void
  onError?: () => void
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  fill = false,
  loading = 'lazy',
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
    if (onLoad) onLoad()
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
    if (onError) onError()
  }

  // Generate blur placeholder for better UX
  const generateBlurDataURL = (w: number, h: number) => {
    return `data:image/svg+xml;base64,${Buffer.from(
      `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)"/>
      </svg>`
    ).toString('base64')}`
  }

  if (hasError) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-500 text-sm">Image not available</span>
      </div>
    )
  }

  const imageProps = {
    src,
    alt,
    className: `${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`,
    quality,
    priority,
    loading: priority ? 'eager' as const : loading,
    onLoad: handleLoad,
    onError: handleError,
    placeholder: placeholder === 'blur' ? 'blur' as const : 'empty' as const,
    blurDataURL: blurDataURL || (width && height ? generateBlurDataURL(width, height) : undefined),
  }

  if (fill) {
    return (
      <Image
        {...imageProps}
        fill
        sizes={sizes}
      />
    )
  }

  return (
    <Image
      {...imageProps}
      width={width}
      height={height}
      sizes={sizes}
    />
  )
}

// Cloudinary optimized image component
export function CloudinaryImage({
  publicId,
  alt,
  width,
  height,
  className,
  transformations = 'f_auto,q_auto',
  ...props
}: Omit<OptimizedImageProps, 'src'> & {
  publicId: string
  transformations?: string
}) {
  const cloudinaryUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dp5bk64xn'}/image/upload/${transformations}/${publicId}`
  
  return (
    <OptimizedImage
      src={cloudinaryUrl}
      alt={alt}
      width={width}
      height={height}
      className={className}
      {...props}
    />
  )
}