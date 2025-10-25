import { Metadata } from 'next'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  canonical?: string
  ogImage?: string
  ogType?: 'website' | 'article'
  noIndex?: boolean
  structuredData?: object
}

export function generateSEOMetadata({
  title = "Siwa With Us - Authentic Desert Experiences in Siwa Oasis",
  description = "Discover the magic of Siwa Oasis with authentic eco-tourism experiences, cultural heritage tours, and premium desert adventures. Book your trip now!",
  keywords = "Siwa, Siwa Oasis, desert tourism, Egypt, Siwa tours, White Desert, Great Sand Sea, natural springs, Berber heritage",
  canonical = "/",
  ogImage = "/siwa-oasis-sunset-salt-lakes-reflection.jpg",
  ogType = "website",
  noIndex = false,
}: SEOProps): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://siwa-with-us.com'
  const fullCanonical = `${baseUrl}${canonical}`
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`

  return {
    title,
    description,
    keywords,
    authors: [{ name: "Siwa With Us Team" }],
    creator: "Siwa With Us",
    publisher: "Siwa With Us",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: fullCanonical,
      languages: {
        'en-US': '/en',
        'ar-EG': '/ar',
      },
    },
    openGraph: {
      title,
      description,
      url: fullCanonical,
      siteName: 'Siwa With Us',
      images: [
        {
          url: fullOgImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: ogType,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [fullOgImage],
      creator: '@SiwaWithUs',
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    generator: "Next.js",
    category: 'Travel & Tourism',
  }
}

export function generateStructuredData(data: {
  type: 'Organization' | 'LocalBusiness' | 'TouristAttraction' | 'Product' | 'Article'
  name: string
  description: string
  url?: string
  image?: string
  address?: {
    streetAddress: string
    addressLocality: string
    addressCountry: string
  }
  contactPoint?: {
    telephone: string
    contactType: string
  }
  sameAs?: string[]
  priceRange?: string
}) {
  const baseStructure = {
    '@context': 'https://schema.org',
    '@type': data.type,
    name: data.name,
    description: data.description,
    url: data.url || 'https://siwa-with-us.com',
    image: data.image || 'https://siwa-with-us.com/siwa-oasis-sunset-salt-lakes-reflection.jpg',
  }

  if (data.address) {
    Object.assign(baseStructure, {
      address: {
        '@type': 'PostalAddress',
        ...data.address,
      },
    })
  }

  if (data.contactPoint) {
    Object.assign(baseStructure, {
      contactPoint: {
        '@type': 'ContactPoint',
        ...data.contactPoint,
      },
    })
  }

  if (data.sameAs) {
    Object.assign(baseStructure, { sameAs: data.sameAs })
  }

  if (data.priceRange) {
    Object.assign(baseStructure, { priceRange: data.priceRange })
  }

  return baseStructure
}