import { memo } from "react"

// SEO structured data for hero section
export const HeroSEO = memo(() => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    "name": "Siwa Oasis Tours",
    "description": "Discover the magic of Siwa Oasis through authentic eco-tourism and cultural heritage experiences",
    "image": "/siwa-oasis-sunset-salt-lakes-reflection.jpg",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Siwa Oasis",
      "addressCountry": "Egypt"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "500"
    },
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "priceCurrency": "USD"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
})

HeroSEO.displayName = 'HeroSEO'