import { memo } from 'react'

// Local SEO optimization for Siwa Oasis tourism
export const LocalSEO = memo(() => {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "Siwa With Us",
    "alternateName": "Siwa Tours Egypt",
    "description": "Leading eco-tourism and cultural heritage tour operator in Siwa Oasis, Egypt",
    "url": "https://siwa-with-us.com",
    "logo": "https://siwa-with-us.com/logo.png",
    "image": [
      "https://siwa-with-us.com/siwa-oasis-sunset-salt-lakes-reflection.jpg",
      "https://siwa-with-us.com/siwa-springs.jpg",
      "https://siwa-with-us.com/desert-safari.jpg"
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Siwa Oasis",
      "addressLocality": "Siwa",
      "addressRegion": "Matrouh Governorate", 
      "postalCode": "51714",
      "addressCountry": "EG"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 29.2030,
      "longitude": 25.5197
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+20-xxx-xxx-xxxx",
        "contactType": "customer service",
        "availableLanguage": ["English", "Arabic", "Berber"],
        "hoursAvailable": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday", "Tuesday", "Wednesday", "Thursday", 
            "Friday", "Saturday", "Sunday"
          ],
          "opens": "08:00",
          "closes": "20:00"
        }
      },
      {
        "@type": "ContactPoint",
        "telephone": "+20-xxx-xxx-xxxx",
        "contactType": "reservations",
        "availableLanguage": ["English", "Arabic"]
      }
    ],
    "sameAs": [
      "https://www.facebook.com/SiwaWithUs",
      "https://www.instagram.com/SiwaWithUs", 
      "https://www.twitter.com/SiwaWithUs",
      "https://www.youtube.com/SiwaWithUs",
      "https://www.tripadvisor.com/SiwaWithUs"
    ],
    "priceRange": "$$",
    "paymentAccepted": ["Cash", "Credit Card", "Bank Transfer"],
    "currenciesAccepted": ["USD", "EUR", "EGP"],
    "areaServed": [
      {
        "@type": "Place",
        "name": "Siwa Oasis"
      },
      {
        "@type": "Place", 
        "name": "Western Desert"
      },
      {
        "@type": "Place",
        "name": "Great Sand Sea"
      },
      {
        "@type": "Place",
        "name": "White Desert"
      }
    ],
    "serviceType": [
      "Desert Safari Tours",
      "Cultural Heritage Tours", 
      "Eco-tourism",
      "Adventure Tourism",
      "Photography Tours",
      "Camping Experiences"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Siwa Oasis Tour Packages",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "TouristTrip",
            "name": "3-Day Desert Safari",
            "description": "Explore the Great Sand Sea with overnight camping"
          },
          "price": "299",
          "priceCurrency": "USD"
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "TouristTrip",
            "name": "Cultural Heritage Tour",
            "description": "Discover ancient Berber culture and traditions"
          },
          "price": "199",
          "priceCurrency": "USD"
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "500",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Sarah Johnson"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        },
        "reviewBody": "Amazing experience in Siwa Oasis! The team was professional and knowledgeable about local culture.",
        "datePublished": "2024-01-15"
      }
    ],
    "foundingDate": "2020",
    "slogan": "Discover the Magic of Egyptian Desert",
    "knowsAbout": [
      "Siwa Oasis",
      "Berber Culture",
      "Desert Tourism",
      "Eco-tourism",
      "Egyptian History",
      "Desert Photography",
      "Sustainable Travel"
    ],
    "memberOf": {
      "@type": "Organization",
      "name": "Egyptian Travel Agents Association"
    }
  }

  const placeSchema = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    "name": "Siwa Oasis",
    "alternateName": ["Siwa", "Oasis of Siwa", "Siwa Depression"],
    "description": "Ancient oasis in Egypt's Western Desert, famous for its natural springs, salt lakes, and rich Berber culture",
    "image": [
      "https://siwa-with-us.com/siwa-oasis-sunset-salt-lakes-reflection.jpg",
      "https://siwa-with-us.com/cleopatra-bath.jpg",
      "https://siwa-with-us.com/temple-oracle.jpg",
      "https://siwa-with-us.com/salt-lakes.jpg"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Siwa Oasis",
      "addressRegion": "Matrouh Governorate",
      "addressCountry": "Egypt"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 29.2030,
      "longitude": 25.5197
    },
    "containsPlace": [
      {
        "@type": "TouristAttraction",
        "name": "Temple of the Oracle",
        "description": "Ancient temple where Alexander the Great consulted the oracle of Amun",
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 29.2089,
          "longitude": 25.5156
        }
      },
      {
        "@type": "TouristAttraction",
        "name": "Cleopatra's Bath",
        "description": "Natural spring pool where legend says Cleopatra bathed",
        "geo": {
          "@type": "GeoCoordinates", 
          "latitude": 29.2025,
          "longitude": 25.5203
        }
      },
      {
        "@type": "TouristAttraction",
        "name": "Great Sand Sea",
        "description": "Vast desert landscape perfect for sandboarding and camping",
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 29.1500,
          "longitude": 25.4000
        }
      },
      {
        "@type": "TouristAttraction",
        "name": "Salt Lakes",
        "description": "Beautiful salt lakes reflecting the desert sky",
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 29.1800,
          "longitude": 25.5500
        }
      }
    ],
    "touristType": [
      "Adventure Tourism",
      "Eco-tourism", 
      "Cultural Heritage Tourism",
      "Photography Tourism",
      "Wellness Tourism"
    ],
    "knowsLanguage": ["Arabic", "English", "Berber"],
    "timeZone": "Africa/Cairo",
    "isAccessibleForFree": false,
    "publicAccess": true
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(placeSchema) }}
      />
    </>
  )
})

LocalSEO.displayName = 'LocalSEO'