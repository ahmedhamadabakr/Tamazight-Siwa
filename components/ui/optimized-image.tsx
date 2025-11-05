import React, { useState, useRef, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  fallbackSrc?: string;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
  lazy?: boolean;
  critical?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  fallbackSrc = '/images/placeholder.jpg',
  className,
  placeholder = 'blur',
  blurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
  onLoad,
  onError,
  lazy = true,
  critical = false,
  priority,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(critical);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (critical || !lazy) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before it comes into view
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [critical, lazy]);

  // Update image src when prop changes
  useEffect(() => {
    setImageSrc(src);
    setHasError(false);
    setIsLoading(true);
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    setImageSrc(fallbackSrc);
    onError?.();
  };

  // Generate low-quality image placeholder
  const generatePlaceholder = (width: number, height: number) => {
    return `data:image/svg+xml;base64,${btoa(
      `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="system-ui">
          Loading...
        </text>
      </svg>`
    )}`;
  };

  const imageProps: ImageProps = {
    ...props,
    src: imageSrc,
    alt,
    priority: critical || priority,
    placeholder: placeholder === 'blur' ? 'blur' : undefined,
    blurDataURL: placeholder === 'blur' ? blurDataURL : undefined,
    onLoad: handleLoad,
    onError: handleError,
    className: cn(
      'transition-opacity duration-300',
      isLoading ? 'opacity-0' : 'opacity-100',
      className
    ),
  };

  if (!isInView && lazy) {
    // Placeholder div when image is not in view
    return (
      <div
        ref={imgRef}
        className={cn(
          'bg-gray-100 animate-pulse',
          className
        )}
        style={{
          width: props.width || '100%',
          height: props.height || 'auto',
        }}
      />
    );
  }

  return (
    <div className="relative overflow-hidden">
      {/* Loading skeleton */}
      {isLoading && (
        <div
          className={cn(
            'absolute inset-0 bg-gray-100 animate-pulse z-10',
            className
          )}
        />
      )}
      
      {/* Main image */}
      <Image {...imageProps} />
      
      {/* Error state overlay */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
          <span className="text-sm">Failed to load image</span>
        </div>
      )}
    </div>
  );
};

// Preload critical images
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    link.onload = () => resolve();
    link.onerror = () => reject();
    document.head.appendChild(link);
  });
};

// Responsive image helper
export const getResponsiveSrc = (src: string, breakpoints: number[]) => {
  const extension = src.split('.').pop();
  const baseName = src.replace(`.${extension}`, '');
  
  return breakpoints.map(size => ({
    src: `${baseName}-${size}.${extension}`,
    size,
  }));
};

export default OptimizedImage;
