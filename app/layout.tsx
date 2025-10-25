import type React from "react"
import type { Metadata } from "next"

import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Suspense } from "react"
import "./globals.css"
import Loading from "./loading"
import { AuthProvider } from "@/components/auth-provider"
import { generateSEOMetadata, generateStructuredData } from "@/components/SEOHead"
import { StructuredDataScript } from "@/components/OptimizedScript"
import { PerformanceMonitor, ResourceHints } from "@/components/PerformanceMonitor"
import { ErrorBoundary } from "@/components/ErrorBoundary"

export const metadata: Metadata = generateSEOMetadata({
  title: "Siwa With Us - Authentic Desert Experiences in Siwa Oasis",
  description: "Discover the magic of Siwa Oasis with authentic eco-tourism experiences, cultural heritage tours, and premium desert adventures. Book your trip now!",
  keywords: "Siwa, Siwa Oasis, desert tourism, Egypt, Siwa tours, White Desert, Great Sand Sea, natural springs, Berber heritage, eco-tourism, cultural heritage, desert adventures",
  canonical: "/",
})

const organizationStructuredData = generateStructuredData({
  type: 'Organization',
  name: 'Siwa With Us',
  description: 'Authentic desert experiences and eco-tourism in Siwa Oasis, Egypt',
  url: 'https://siwa-with-us.com',
  image: 'https://siwa-with-us.com/siwa-oasis-sunset-salt-lakes-reflection.jpg',
  address: {
    streetAddress: 'Siwa Oasis',
    addressLocality: 'Siwa',
    addressCountry: 'Egypt',
  },
  contactPoint: {
    telephone: '+20-xxx-xxx-xxxx',
    contactType: 'Customer Service',
  },
  sameAs: [
    'https://www.facebook.com/SiwaWithUs',
    'https://www.instagram.com/SiwaWithUs',
    'https://www.twitter.com/SiwaWithUs',
  ],
  priceRange: '$$',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" dir="ltr" className="scroll-smooth">
      <head>
        {/* DNS Prefetch for external domains */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//res.cloudinary.com" />
        <link rel="dns-prefetch" href="//images.unsplash.com" />

        {/* Preconnect for critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Optimized font loading */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
          media="print"
        />
        <noscript>
          <link
            href="https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700;800;900&display=swap"
            rel="stylesheet"
          />
        </noscript>

        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Theme and viewport */}
        <meta name="theme-color" content="#D4A574" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />

        {/* Resource Hints */}
        <ResourceHints />

        {/* Structured Data */}
        <StructuredDataScript data={organizationStructuredData} />
      </head>
      <body className="font-cairo antialiased">
        <ErrorBoundary>
          <Suspense fallback={<Loading />}>
            <AuthProvider>
              {children}
            </AuthProvider>
          </Suspense>
        </ErrorBoundary>

        {/* Performance Monitoring */}
        <PerformanceMonitor />

        {/* Analytics - loaded after interactive */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}