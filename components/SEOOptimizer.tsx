import { Metadata } from 'next'
import { memo } from 'react'

// Advanced SEO configuration
export interface SEOConfig {
  title: string
  description: string
  keywords?: string
  canonical?: string
  ogImage?: string
  ogType?: string
  twitterCard?: string
  author?: string
  publishedTime?: string
  modifiedTime?: string
  locale?: string
  alternateLocales?: string[]
  noindex?: boolean
  nofollow?: boolean
}

// Generate comprehensive metadata
export function generateAdvancedMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords,
    canonical,
    ogImage = '/siwa-oasis-sunset-salt-lakes-reflection.jpg',
    ogType = 'website',
    twitterCard = 'summary_large_image',
    author = 'Siwa With Us',
    publishedTime,
    modifiedTime,
    locale = 'en_US',
    alternateLocales = ['ar_EG'],
    noindex = false,
    nofollow = false
  } = config

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://siwa-with-us.com'
  const fullCanonical = canonical ? `${baseUrl}${canonical}` : baseUrl
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`

  return {
    title: {
      default: title,
      template: '%s | Siwa With Us - Authentic Desert Experiences'
    },
    description,
    keywords,
    authors: [{ name: author }],
    creator: author,
    publisher: 'Siwa With Us',
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
        ...alternateLocales.reduce((acc, locale) => {
          acc[locale] = `/${locale.split('_')[0]}`
          return acc
        }, {} as Record<string, string>)
      }
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
        }
      ],
      locale,
      type: ogType as any,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime })
    },
    twitter: {
      card: twitterCard as any,
      title,
      description,
      images: [fullOgImage],
      creator: '@SiwaWithUs',
      site: '@SiwaWithUs'
    },
    robots: {
      index: !noindex,
      follow: !nofollow,
      nocache: false,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
      yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION,
      other: {
        'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION || '',
      }
    },
    category: 'travel',
    classification: 'Tourism and Travel Services',
    referrer: 'origin-when-cross-origin',

    manifest: '/manifest.json',
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '32x32' },
        { url: '/icon.svg', type: 'image/svg+xml' }
      ],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180' }
      ],
      other: [
        { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#D4A574' }
      ]
    },
    appleWebApp: {
      capable: true,
      title: 'Siwa With Us',
      statusBarStyle: 'default',
    }
  }
}

// Structured data generators
export const generateTouristDestinationSchema = (data: {
  name: string
  description: string
  image: string
  address: any
  rating?: { value: number; count: number }
  offers?: any[]
}) => ({
  "@context": "https://schema.org",
  "@type": "TouristDestination",
  "name": data.name,
  "description": data.description,
  "image": data.image,
  "address": {
    "@type": "PostalAddress",
    ...data.address
  },
  ...(data.rating && {
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": data.rating.value,
      "reviewCount": data.rating.count
    }
  }),
  ...(data.offers && { "offers": data.offers })
})

export const generateTourSchema = (tour: {
  name: string
  description: string
  image: string
  price: { amount: number; currency: string }
  duration: string
  location: string
  provider: string
  rating?: { value: number; count: number }
}) => ({
  "@context": "https://schema.org",
  "@type": "TouristTrip",
  "name": tour.name,
  "description": tour.description,
  "image": tour.image,
  "offers": {
    "@type": "Offer",
    "price": tour.price.amount,
    "priceCurrency": tour.price.currency,
    "availability": "https://schema.org/InStock"
  },
  "duration": tour.duration,
  "touristType": "Eco-tourism, Cultural Heritage",
  "location": {
    "@type": "Place",
    "name": tour.location
  },
  "provider": {
    "@type": "Organization",
    "name": tour.provider
  },
  ...(tour.rating && {
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": tour.rating.value,
      "reviewCount": tour.rating.count
    }
  })
})

export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  "name": "Siwa With Us",
  "alternateName": "Siwa Tours",
  "description": "Authentic desert experiences and eco-tourism in Siwa Oasis, Egypt",
  "url": "https://siwa-with-us.com",
  "logo": "https://siwa-with-us.com/logo.png",
  "image": "https://siwa-with-us.com/siwa-oasis-sunset-salt-lakes-reflection.jpg",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Siwa Oasis",
    "addressLocality": "Siwa",
    "addressRegion": "Matrouh Governorate",
    "addressCountry": "Egypt"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+20-xxx-xxx-xxxx",
    "contactType": "Customer Service",
    "availableLanguage": ["English", "Arabic", "Berber"]
  },
  "sameAs": [
    "https://www.facebook.com/SiwaWithUs",
    "https://www.instagram.com/SiwaWithUs",
    "https://www.twitter.com/SiwaWithUs",
    "https://www.youtube.com/SiwaWithUs"
  ],
  "priceRange": "$$",
  "paymentAccepted": "Cash, Credit Card, Bank Transfer",
  "currenciesAccepted": "USD, EUR, EGP",
  "areaServed": {
    "@type": "Place",
    "name": "Siwa Oasis and Western Desert, Egypt"
  },
  "serviceType": "Eco-tourism, Cultural Heritage Tours, Desert Adventures",
  "foundingDate": "2020",
  "slogan": "Discover the Magic of Egyptian Desert"
})

export const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
})

export const generateFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
})

// SEO Component for structured data injection
export const SEOStructuredData = memo(({ schemas }: { schemas: any[] }) => {
  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  )
})

SEOStructuredData.displayName = 'SEOStructuredData'