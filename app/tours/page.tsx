import { Metadata } from "next"
import ToursContent from "./ToursContent"
import { generateSEOMetadata, generateStructuredData } from "@/components/SEOHead"
import { StructuredDataScript } from "@/components/OptimizedScript"

// Enhanced SEO Metadata
export const metadata: Metadata = generateSEOMetadata({
  title: "Siwa Tours & Desert Experiences | Authentic Oasis Adventures - Siwa With Us",
  description: "Discover authentic Siwa Oasis tours: cultural heritage experiences, desert adventures, wellness retreats, and photography expeditions. Book your perfect Siwa journey today!",
  keywords: "Siwa tours, Siwa Oasis experiences, desert tours Egypt, Siwa cultural tours, White Desert tours, Great Sand Sea, Siwa adventure tours, eco-tourism Siwa, Berber culture tours, Siwa photography tours",
  canonical: "/tours",
  ogType: "website",
})

const toursStructuredData = generateStructuredData({
  type: 'LocalBusiness',
  name: 'Siwa With Us Tours',
  description: 'Authentic desert tours and cultural experiences in Siwa Oasis, Egypt',
  url: 'https://siwa-with-us.com/tours',
  priceRange: '$$-$$$',
})

export default function ToursPage() {
  return (
    <>
      <StructuredDataScript data={toursStructuredData} />
      <ToursContent />
    </>
  )
}
