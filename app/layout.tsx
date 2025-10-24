import type React from "react"
import type { Metadata } from "next"

import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import Loading from "./loading"
import { AuthProvider } from "@/components/auth-provider"

export const metadata: Metadata = {
  title: "Siwa With Us - Authentic Desert Experiences in Siwa Oasis",
  description: "Discover the magic of Siwa Oasis with authentic eco-tourism experiences, cultural heritage tours, and premium desert adventures. Book your trip now!",
  keywords: "Siwa, Siwa Oasis, desert tourism, Egypt, Siwa tours, White Desert, Great Sand Sea, natural springs, Berber heritage",
  authors: [{ name: "Siwa With Us Team" }],
  creator: "Siwa With Us",
  publisher: "Siwa With Us",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://siwa-with-us.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en',
      'ar-EG': '/ar',
    },
  },
  openGraph: {
    title: "Siwa With Us - Authentic Desert Experiences in Siwa Oasis",
    description: "Discover the magic of Siwa Oasis with authentic eco-tourism experiences, cultural heritage tours, and premium desert adventures",
    url: 'https://siwa-with-us.com',
    siteName: 'Siwa With Us',
    images: [
      {
        url: '/siwa-oasis-sunset-salt-lakes-reflection.jpg',
        width: 1200,
        height: 630,
        alt: 'Siwa Oasis - Salt Lakes at Sunset',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Siwa With Us - Authentic Desert Experiences",
    description: "Discover the magic of Siwa Oasis with authentic eco-tourism experiences",
    images: ['/siwa-oasis-sunset-salt-lakes-reflection.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  generator: "Next.js",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" dir="ltr" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700;800;900&display=swap" 
          rel="stylesheet" 
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#D4A574" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className="font-cairo antialiased">
        <Suspense fallback={<Loading />}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}