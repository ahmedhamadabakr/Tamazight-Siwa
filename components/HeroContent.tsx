"use client"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { memo } from "react"
import Link from "next/link"

interface HeroContentProps {
  showVideo: boolean
  onToggleVideo: () => void
}

// Memoized hero content to prevent unnecessary re-renders
export const HeroContent = memo(({ showVideo, onToggleVideo }: HeroContentProps) => {
  return (
    <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-4 gpu-accelerated">
      <div className="mb-4">
        <span className="inline-block bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full px-4 py-2 text-sm font-medium mb-4">
          ✨ Discover the Magic of Egyptian Desert
        </span>
      </div>

      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight gpu-accelerated">
        <span className="bg-gradient-to-r from-white via-yellow-200 to-primary bg-clip-text text-transparent">
          Siwa
        </span>
        <br />
        <span className="text-3xl md:text-5xl lg:text-6xl">With Us</span>
      </h1>

      <p className="text-lg md:text-xl mb-6 opacity-90 max-w-2xl mx-auto leading-relaxed">
        Discover the magic of Siwa Oasis through authentic eco-tourism and cultural heritage experiences
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
        <Link
          href="/tours"
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-2 text-lg rounded-full shadow-2xl hover:shadow-primary/25 transition-all duration-300 hover:scale-105 gpu-accelerated"
          aria-label="Book your Siwa Oasis trip now"
        >
          Book Your Trip Now
        </Link>
        <Button
          size="lg"
          variant="outline"
          className="border-2 border-white text-white hover:bg-white hover:text-foreground px-10 py-4 text-lg bg-white/10 backdrop-blur-sm rounded-full transition-all duration-300 hover:scale-105 gpu-accelerated"
          onClick={onToggleVideo}
          aria-label={showVideo ? 'View photos of Siwa Oasis' : 'Watch Siwa Oasis video'}
        >
          <Play className="w-5 h-5 mr-2" />
          {showVideo ? 'View Photos' : 'Watch Video'}
        </Button>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap justify-center gap-8 text-sm">
        <div className="text-center">
          <div className="text-2xl font-bold ">500+</div>
          <div className="opacity-80">Happy Visitors</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold ">15+</div>
          <div className="opacity-80">Unique Experiences</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold ">4.9</div>
          <div className="opacity-80">Excellent Rating</div>
        </div>
      </div>
    </div>
  )
})

HeroContent.displayName = 'HeroContent'