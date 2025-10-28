import { memo } from 'react'
import Image from 'next/image'

interface ImageSEOProps {
  src: string
  alt: string
  title?: string
  caption?: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  sizes?: string
  schema?: {
    name: string
    description: string
    author?: string
    datePublished?: string
    location?: string
  }
}

// SEO-optimized image component with structured data
export const ImageSEO = memo(({
  src,
  alt,
  title,
  caption,
  width,
  height,
  className,
  priority = false,
  sizes,
  schema
}: ImageSEOProps) => {
  const imageSchema = schema ? {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "contentUrl": src,
    "name": schema.name,
    "description": schema.description,
    "width": width,
    "height": height,
    ...(schema.author && {
      "author": {
        "@type": "Person",
        "name": schema.author
      }
    }),
    ...(schema.datePublished && { "datePublished": schema.datePublished }),
    ...(schema.location && {
      "contentLocation": {
        "@type": "Place",
        "name": schema.location
      }
    })
  } : null

  return (
    <figure className={`image-seo-container ${className || ''}`}>
      <Image
        src={src}
        alt={alt}
        title={title}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes}
        className="seo-optimized-image"
      />
      {caption && (
        <figcaption className="image-caption text-sm text-gray-600 mt-2 text-center">
          {caption}
        </figcaption>
      )}
      {imageSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(imageSchema) }}
        />
      )}
    </figure>
  )
})

// Gallery component with SEO optimization
export const GallerySEO = memo(({ 
  images, 
  title, 
  description 
}: { 
  images: Array<{
    src: string
    alt: string
    title?: string
    caption?: string
    width?: number
    height?: number
  }>,
  title: string,
  description: string
}) => {
  const gallerySchema = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": title,
    "description": description,
    "image": images.map(img => ({
      "@type": "ImageObject",
      "contentUrl": img.src,
      "name": img.title || img.alt,
      "description": img.caption || img.alt,
      "width": img.width,
      "height": img.height
    }))
  }

  return (
    <div className="gallery-seo-container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gallerySchema) }}
      />
      <div className="gallery-grid">
        {images.map((image, index) => (
          <ImageSEO
            key={index}
            src={image.src}
            alt={image.alt}
            title={image.title}
            caption={image.caption}
            width={image.width}
            height={image.height}
            className="gallery-item"
          />
        ))}
      </div>
    </div>
  )
})

ImageSEO.displayName = 'ImageSEO'
GallerySEO.displayName = 'GallerySEO'