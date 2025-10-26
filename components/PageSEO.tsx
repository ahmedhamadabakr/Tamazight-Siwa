"use client"
import { memo } from 'react'
import { SEOStructuredData } from './SEOOptimizer'

// Home Page SEO
export const HomePageSEO = memo(() => {
  const schemas = [
    // Organization Schema
    {
      "@context": "https://schema.org",
      "@type": "TravelAgency",
      "name": "Siwa With Us",
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
        "https://www.twitter.com/SiwaWithUs"
      ],
      "priceRange": "$$",
      "areaServed": {
        "@type": "Place",
        "name": "Siwa Oasis and Western Desert, Egypt"
      },
      "serviceType": "Eco-tourism, Cultural Heritage Tours, Desert Adventures"
    },
    
    // Tourist Destination Schema
    {
      "@context": "https://schema.org",
      "@type": "TouristDestination",
      "name": "Siwa Oasis",
      "description": "Ancient oasis in Egypt's Western Desert known for its natural springs, salt lakes, and Berber culture",
      "image": [
        "https://siwa-with-us.com/siwa-oasis-sunset-salt-lakes-reflection.jpg",
        "https://siwa-with-us.com/siwa-springs.jpg",
        "https://siwa-with-us.com/siwa-desert.jpg"
      ],
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Siwa Oasis",
        "addressRegion": "Matrouh Governorate",
        "addressCountry": "Egypt"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "29.2030",
        "longitude": "25.5197"
      },
      "touristType": "Eco-tourism, Cultural Heritage, Adventure Tourism",
      "includesAttraction": [
        {
          "@type": "TouristAttraction",
          "name": "Cleopatra's Bath",
          "description": "Natural spring where legend says Cleopatra bathed"
        },
        {
          "@type": "TouristAttraction", 
          "name": "Great Sand Sea",
          "description": "Vast desert landscape perfect for sandboarding and camping"
        },
        {
          "@type": "TouristAttraction",
          "name": "Temple of the Oracle",
          "description": "Ancient temple where Alexander the Great consulted the oracle"
        }
      ]
    },

    // Website Schema
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Siwa With Us",
      "url": "https://siwa-with-us.com",
      "description": "Discover the magic of Siwa Oasis through authentic eco-tourism experiences",
      "publisher": {
        "@type": "Organization",
        "name": "Siwa With Us"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://siwa-with-us.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      },
      "inLanguage": ["en", "ar"]
    },

    // Breadcrumb Schema
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://siwa-with-us.com"
        }
      ]
    }
  ]

  return <SEOStructuredData schemas={schemas} />
})

// Tours Page SEO
export const ToursPageSEO = memo(() => {
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Siwa Oasis Tours",
      "description": "Collection of authentic desert tours and experiences in Siwa Oasis",
      "numberOfItems": 8,
      "itemListElement": [
        {
          "@type": "TouristTrip",
          "position": 1,
          "name": "3-Day Desert Safari",
          "description": "Explore the Great Sand Sea with camping under the stars",
          "image": "https://siwa-with-us.com/desert-safari.jpg",
          "offers": {
            "@type": "Offer",
            "price": "299",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
          },
          "duration": "P3D",
          "location": {
            "@type": "Place",
            "name": "Siwa Oasis, Egypt"
          }
        },
        {
          "@type": "TouristTrip",
          "position": 2,
          "name": "Cultural Heritage Tour",
          "description": "Discover Berber culture and ancient traditions",
          "image": "https://siwa-with-us.com/cultural-tour.jpg",
          "offers": {
            "@type": "Offer",
            "price": "199",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
          },
          "duration": "P2D",
          "location": {
            "@type": "Place",
            "name": "Siwa Oasis, Egypt"
          }
        }
      ]
    },

    // Breadcrumb for Tours
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://siwa-with-us.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Tours",
          "item": "https://siwa-with-us.com/tours"
        }
      ]
    }
  ]

  return <SEOStructuredData schemas={schemas} />
})

// Gallery Page SEO
export const GalleryPageSEO = memo(() => {
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "ImageGallery",
      "name": "Siwa Oasis Photo Gallery",
      "description": "Beautiful photos showcasing the natural beauty and culture of Siwa Oasis",
      "url": "https://siwa-with-us.com/gallery",
      "image": [
        "https://siwa-with-us.com/gallery/siwa-sunset.jpg",
        "https://siwa-with-us.com/gallery/salt-lakes.jpg",
        "https://siwa-with-us.com/gallery/desert-landscape.jpg"
      ],
      "author": {
        "@type": "Organization",
        "name": "Siwa With Us"
      }
    }
  ]

  return <SEOStructuredData schemas={schemas} />
})

// Contact Page SEO
export const ContactPageSEO = memo(() => {
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact Siwa With Us",
      "description": "Get in touch with us to plan your Siwa Oasis adventure",
      "url": "https://siwa-with-us.com/contact",
      "mainEntity": {
        "@type": "Organization",
        "name": "Siwa With Us",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+20-xxx-xxx-xxxx",
          "contactType": "Customer Service",
          "availableLanguage": ["English", "Arabic", "Berber"],
          "hoursAvailable": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            "opens": "08:00",
            "closes": "20:00"
          }
        }
      }
    }
  ]

  return <SEOStructuredData schemas={schemas} />
})

// FAQ Schema Component
export const FAQPageSEO = memo(({ faqs }: { faqs: Array<{ question: string; answer: string }> }) => {
  const schemas = [
    {
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
    }
  ]

  return <SEOStructuredData schemas={schemas} />
})

// Review/Testimonial Schema
export const ReviewSEO = memo(({ reviews }: { 
  reviews: Array<{
    author: string
    rating: number
    text: string
    date: string
  }> 
}) => {
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Siwa With Us",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length,
        "reviewCount": reviews.length,
        "bestRating": 5,
        "worstRating": 1
      },
      "review": reviews.map(review => ({
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": review.author
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": review.rating,
          "bestRating": 5,
          "worstRating": 1
        },
        "reviewBody": review.text,
        "datePublished": review.date
      }))
    }
  ]

  return <SEOStructuredData schemas={schemas} />
})

// Set display names
HomePageSEO.displayName = 'HomePageSEO'
ToursPageSEO.displayName = 'ToursPageSEO'
GalleryPageSEO.displayName = 'GalleryPageSEO'
ContactPageSEO.displayName = 'ContactPageSEO'
FAQPageSEO.displayName = 'FAQPageSEO'
ReviewSEO.displayName = 'ReviewSEO'