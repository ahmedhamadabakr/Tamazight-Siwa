import type React from "react"
import type { Metadata } from "next"

import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Suspense } from "react"
import { getServerAuthSession } from '@/lib/server-auth'
import { Cairo } from "next/font/google"

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

const cairo = Cairo({ subsets: ["latin"], weight: ["400", "700"], display: "swap" })

export const dynamic = 'force-dynamic'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const enableAnalytics = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true'
  const session = await getServerAuthSession()
  return (
    <html lang="en" dir="ltr" className="scroll-smooth">
      <head>
        {/* DNS Prefetch for external domains */}
        <link rel="dns-prefetch" href="//res.cloudinary.com" />
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        <link rel="dns-prefetch" href="//vercel.live" />

        {/* Preconnect for critical resources */}
        <link rel="preconnect" href="https://vercel.live" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://images.unsplash.com" />

        {/* Optimize JavaScript loading */}
        <script dangerouslySetInnerHTML={{
          __html: `
            // Preload critical resources
            if ('requestIdleCallback' in window) {
              requestIdleCallback(() => {
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = '/tours';
                document.head.appendChild(link);
              });
            }
            
            // Register service worker
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                  .then(registration => console.log('SW registered'))
                  .catch(error => console.log('SW registration failed'));
              });
            }
          `
        }} />

        {/* Critical CSS for above-the-fold content */}
        <style dangerouslySetInnerHTML={{
          __html: `
            *{box-sizing:border-box}
            body{font-family:system-ui,-apple-system,sans-serif;margin:0;padding:0;background:#f8f5f0;color:#3d2914;font-display:swap;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
            .hero-section{height:100vh;position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden;contain:layout style paint}
            h1{font-size:2.5rem;font-weight:700;line-height:1.1;margin:0 0 1rem 0;contain:layout style paint;text-rendering:optimizeSpeed}
            @media(min-width:768px){h1{font-size:3.75rem}}
            @media(min-width:1024px){h1{font-size:4.5rem}}
            .gpu-accelerated{transform:translateZ(0);will-change:transform;backface-visibility:hidden}
            img{max-width:100%;height:auto;display:block}
            .loading-skeleton{background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%);background-size:200% 100%;animation:loading 1.5s infinite}
            @keyframes loading{0%{background-position:-200% 0}100%{background-position:200% 0}}
            .animate-fade-in-up{animation:fadeInUp 0.6s ease-out forwards}
            @keyframes fadeInUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
          `
        }} />

        {/* Favicon and app icons */}
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />

        {/* Theme and viewport */}
        <meta name="theme-color" content="#D4A574" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="format-detection" content="telephone=+201552624123, date=no, email=tamazight.siwa@gmail.com, address=siwa oasis" />

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
        <meta name="business:contact_data:phone_number" content="+201552624123" />

        {/* Preload critical resources */}
        <link rel="prefetch" href="/placeholder-logo.png" as="image" />

        {/* Canonical and alternate languages */}
        <link rel="canonical" href="https://siwa-with-us.com" />
        <link rel="alternate" hrefLang="x-default" href="https://siwa-with-us.com" />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Tamazight Siwa",
          "url": "https://siwa-with-us.com",
          "logo": "https://siwa-with-us.com/placeholder-logo.png",
          "sameAs": [
            "https://www.facebook.com/SiwaWithUs",
            "https://www.instagram.com/",
            "https://x.com/"
          ],
          "contactPoint": [{
            "@type": "ContactPoint",
            "telephone": "+201552624123",
            "contactType": "customer service",
            "areaServed": "EG",
            "availableLanguage": ["en", "ar"]
          }]
        }) }} />

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Tamazight Siwa",
          "url": "https://siwa-with-us.com",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://siwa-with-us.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }) }} />

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "Tamazight Siwa",
          "image": [
            "https://siwa-with-us.com/siwa-oasis-sunset-salt-lakes-reflection.jpg"
          ],
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Siwa Oasis",
            "addressLocality": "Siwa",
            "addressRegion": "Matrouh Governorate",
            "addressCountry": "EG"
          },
          "telephone": "+201552624123",
          "url": "https://siwa-with-us.com",
          "priceRange": "$$",
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 29.205,
            "longitude": 25.519
          }
        }) }} />

        {/* Resource Hints */}
        <ResourceHints />
      </head>
      <body className={`${cairo.className} font-cairo antialiased`} suppressHydrationWarning>
        <ErrorBoundary>
          <Suspense fallback={<Loading />}>
            <AuthProvider session={session}>
              {children}
            </AuthProvider>
          </Suspense>
        </ErrorBoundary>

        {/* Performance Monitoring */}
        {enableAnalytics && <PerformanceMonitor />}

        {/* Analytics - loaded after interactive */}
        {enableAnalytics && <Analytics />}
        {enableAnalytics && <SpeedInsights />}
      </body>
    </html>
  )
}