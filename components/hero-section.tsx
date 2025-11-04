"use client"
import { Star, MapPin } from "lucide-react"
import { useState, useEffect, useCallback, memo } from "react"
import { OptimizedImage } from "@/components/OptimizedImage"
import { HeroContent } from "@/components/HeroContent"
import Image from "next/image"

// Memoized floating card components for better performance
const FloatingCard = memo(({ children, className }: { children: React.ReactNode, className: string }) => (
  <div className={`bg-white/10 backdrop-blur-md rounded-2xl p-4 text-white border border-white/20 ${className}`}>
    {children}
  </div>
))
FloatingCard.displayName = 'FloatingCard'

export function HeroSection() {
  const [showVideo, setShowVideo] = useState(false)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [shouldPreloadVideo, setShouldPreloadVideo] = useState(false)

  // Preload video on user interaction for better UX
  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    const handleUserInteraction = () => {
      setShouldPreloadVideo(true)
      document.removeEventListener('mousemove', handleUserInteraction)
      document.removeEventListener('touchstart', handleUserInteraction)
    }

    document.addEventListener('mousemove', handleUserInteraction, { once: true })
    document.addEventListener('touchstart', handleUserInteraction, { once: true })

    return () => {
      document.removeEventListener('mousemove', handleUserInteraction)
      document.removeEventListener('touchstart', handleUserInteraction)
    }
  }, [])

  const toggleVideo = useCallback(() => {
    setShowVideo(prev => !prev)
  }, [])

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video/Image */}
      {showVideo && shouldPreloadVideo ? (
        <div className="absolute inset-0">
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src="/Siwa/WhatsApp Video 2025-10-11 at 14.15.44_a55f796c.mp4" type="video/mp4" />
            <source src="/Siwa/WhatsApp Video 2025-10-11 at 14.16.53_71a463c0.mp4" type="video/mp4" />
          </video>
        </div>
      ) : (
        <div className="absolute inset-0">
          <Image
            src="/siwa-oasis-sunset-salt-lakes-reflection.jpg"
            alt="Siwa Oasis sunset with salt lakes reflection"
            fill
            priority
            quality={60}
            fetchPriority="high"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNkNGE1NzQ7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzhiNDUxMztzdG9wLW9wYWNpdHk6MSIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JhZCkiLz4KICA8L3N2Zz4="
            className={`object-cover transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setIsImageLoaded(true)}
            sizes="100vw"
            loading="eager"
          />
          {/* Fallback gradient while image loads */}
          <div 
            className={`absolute inset-0 bg-gradient-to-br from-amber-900 via-orange-800 to-yellow-600 transition-opacity duration-1000 ${
              isImageLoaded ? 'opacity-0' : 'opacity-100'
            }`} 
          />
        </div>
      )}
      
      <div className="absolute inset-0 hero-gradient opacity-50"></div>

      {/* Floating Elements - Memoized for better performance */}
      <div className="absolute top-20 right-10 hidden lg:block animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
        <FloatingCard className="">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">4.9/5 Rating</span>
          </div>
          <p className="text-xs opacity-80">From 500+ visitors</p>
        </FloatingCard>
      </div>

      <div className="absolute bottom-32 left-10 hidden lg:block animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
        <FloatingCard className="">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Siwa Oasis</span>
          </div>
          <p className="text-xs opacity-80">Magical Egypt</p>
        </FloatingCard>
      </div>

      {/* Main Content */}
      <HeroContent showVideo={showVideo} onToggleVideo={toggleVideo} />

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}
