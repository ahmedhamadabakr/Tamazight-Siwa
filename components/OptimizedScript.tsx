'use client'

"use client"
import Script from 'next/script'
import { useEffect, useState } from 'react'

interface OptimizedScriptProps {
  src?: string
  strategy?: 'beforeInteractive' | 'afterInteractive' | 'lazyOnload' | 'worker'
  onLoad?: () => void
  onError?: () => void
  children?: string
  id?: string
  defer?: boolean
  async?: boolean
}

export function OptimizedScript({
  src,
  strategy = 'afterInteractive',
  onLoad,
  onError,
  children,
  id,
  defer = true,
  async = true,
}: OptimizedScriptProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (isLoaded && onLoad) {
      onLoad()
    }
  }, [isLoaded, onLoad])

  const handleLoad = () => {
    setIsLoaded(true)
  }

  const handleError = () => {
    console.error(`Failed to load script: ${src || id}`)
    if (onError) {
      onError()
    }
  }

  if (src) {
    return (
      <Script
        src={src}
        strategy={strategy}
        onLoad={handleLoad}
        onError={handleError}
        id={id}
        defer={defer}
        async={async}
      />
    )
  }

  return (
    <Script
      strategy={strategy}
      onLoad={handleLoad}
      onError={handleError}
      id={id}
    >
      {children}
    </Script>
  )
}

// Google Analytics Component
export function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  return (
    <>
      <OptimizedScript
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <OptimizedScript strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            page_title: document.title,
            page_location: window.location.href,
          });
        `}
      </OptimizedScript>
    </>
  )
}

// Structured Data Component
export function StructuredDataScript({ data }: { data: object }) {
  return (
    <OptimizedScript
      id="structured-data"
      strategy="beforeInteractive"
    >
      {JSON.stringify(data)}
    </OptimizedScript>
  )
}