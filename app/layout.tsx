import type React from "react"
import type { Metadata } from "next"

import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Tamazight Siwa - Authentic Desert Experiences in Siwa Oasis",
  description:
    "Discover the magic of Siwa Oasis with authentic eco-tourism experiences, cultural heritage tours, and premium desert adventures.",
  generator: "Next.js",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body >
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}

/* 
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"

className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}
*/