"use client"
import { useEffect, useRef, useState } from "react"

export default function LazyVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedData = () => {
      setIsLoaded(true)
    }

    video.addEventListener('loadeddata', handleLoadedData)
    
    return () => {
      video.removeEventListener('loadeddata', handleLoadedData)
    }
  }, [])

  return (
    <>
      {/* Loading placeholder */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br from-amber-900 via-orange-800 to-yellow-600 transition-opacity duration-500 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
      />
      
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src="/Siwa/WhatsApp Video 2025-10-11 at 14.15.44_a55f796c.mp4" type="video/mp4" />
        <source src="/Siwa/WhatsApp Video 2025-10-11 at 14.16.53_71a463c0.mp4" type="video/mp4" />
      </video>
    </>
  )
}