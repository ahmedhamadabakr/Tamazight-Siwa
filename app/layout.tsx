import type React from "react"
import type { Metadata } from "next"

import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Suspense } from "react"
import "./globals.css"
import Loading from "./loading"
import { AuthProvider } from "@/components/auth-provider"
import { generateAdvancedMetadata } from "@/components/SEOOptimizer"
import { PerformanceMonitor, ResourceHints } from "@/components/PerformanceMonitor"
import { ErrorBoundary } from "@/components/ErrorBoundary"

export const metadata: Metadata = generateAdvancedMetadata({
  title: "Siwa With Us - Authentic Desert Experiences in Siwa Oasis",
  description: "Discover the magic of Siwa Oasis with authentic eco-tourism experiences, cultural heritage tours, and premium desert adventures. Book your trip now!",
  keywords: "Siwa, Siwa Oasis, desert tourism, Egypt, Siwa tours, White Desert, Great Sand Sea, natural springs, Berber heritage, eco-tourism, cultural heritage, desert adventures, Alexander the Great, Cleopatra Bath, Temple of Oracle, salt lakes, hot springs, sandboarding, desert camping, Berber culture, Western Desert, Matrouh, authentic travel, sustainable tourism",
  canonical: "/",
  ogImage: "/siwa-oasis-sunset-salt-lakes-reflection.jpg",
  author: "Siwa With Us Team",
  locale: "en_US",
  alternateLocales: ["ar_EG"]
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

        {/* Optimized font loading with variable font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@200..900&display=swap"
          rel="preload"
          as="style"
        />
        <noscript>
          <link
            href="https://fonts.googleapis.com/css2?family=Cairo:wght@200..900&display=swap"
            rel="stylesheet"
          />
        </noscript>

        {/* Critical CSS for above-the-fold content */}
        <style dangerouslySetInnerHTML={{
          __html: `
            body{font-family:system-ui,-apple-system,sans-serif;margin:0;padding:0;background:#f8f5f0;color:#3d2914}
            .hero-section{height:100vh;position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden}
            .loading-skeleton{background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%);background-size:200% 100%;animation:loading 1.5s infinite}
            @keyframes loading{0%{background-position:-200% 0}100%{background-position:200% 0}}
          `
        }} />

        {/* Favicon and app icons */}
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />

        {/* Theme and viewport */}
        <meta name="theme-color" content="#D4A574" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />

        {/* Additional SEO Meta Tags */}
        <meta name="geo.region" content="EG-MT" />
        <meta name="geo.placename" content="Siwa Oasis" />
        <meta name="geo.position" content="29.2030;25.5197" />
        <meta name="ICBM" content="29.2030, 25.5197" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="rating" content="General" />
        <meta name="distribution" content="Global" />
        <meta name="coverage" content="Worldwide" />
        <meta name="target" content="all" />
        <meta name="HandheldFriendly" content="True" />
        <meta name="MobileOptimized" content="320" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* Open Graph Additional */}
        <meta property="og:site_name" content="Siwa With Us" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:locale:alternate" content="ar_EG" />
        <meta property="article:author" content="Siwa With Us" />
        <meta property="article:publisher" content="https://www.facebook.com/SiwaWithUs" />

        {/* Twitter Additional */}
        <meta name="twitter:domain" content="siwa-with-us.com" />
        <meta name="twitter:url" content="https://siwa-with-us.com" />

        {/* Business Information */}
        <meta name="business:contact_data:street_address" content="Siwa Oasis" />
        <meta name="business:contact_data:locality" content="Siwa" />
        <meta name="business:contact_data:region" content="Matrouh Governorate" />
        <meta name="business:contact_data:country_name" content="Egypt" />
        <meta name="business:contact_data:phone_number" content="+20-xxx-xxx-xxxx" />

        {/* Preload critical resources */}
        <link rel="preload" href="/siwa-oasis-sunset-salt-lakes-reflection.jpg" as="image" />
        <link rel="preload" href="/logo.png" as="image" />

        {/* Canonical and alternate languages */}
        <link rel="canonical" href="https://siwa-with-us.com" />
        <link rel="alternate" hrefLang="en" href="https://siwa-with-us.com/en" />
        <link rel="alternate" hrefLang="ar" href="https://siwa-with-us.com/ar" />
        <link rel="alternate" hrefLang="x-default" href="https://siwa-with-us.com" />

        {/* Resource Hints */}
        <ResourceHints />
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