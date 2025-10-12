import type React from "react"
import type { Metadata } from "next"

import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import Loading from "./loading"
import { AuthProvider } from "@/components/auth-provider"

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