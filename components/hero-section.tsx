"use client"
import { Button } from "@/components/ui/button"
import { Play, Star, MapPin } from "lucide-react"
import { useState } from "react"

export function HeroSection() {
  const [showVideo, setShowVideo] = useState(false)

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video/Image */}
      {showVideo ? (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/Siwa/WhatsApp Video 2025-10-11 at 14.15.44_a55f796c.mp4" type="video/mp4" />
          <source src="/Siwa/WhatsApp Video 2025-10-11 at 14.16.53_71a463c0.mp4" type="video/mp4" />
        </video>
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
          style={{
            backgroundImage: `url('/siwa-oasis-sunset-salt-lakes-reflection.jpg')`,
          }}
        />
      )}
      
      <div className="absolute inset-0 hero-gradient opacity-50"></div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-10 hidden lg:block">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-white border border-white/20">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">4.9/5 Rating</span>
          </div>
          <p className="text-xs opacity-80">From 500+ visitors</p>
        </div>
      </div>

      <div className="absolute bottom-32 left-10 hidden lg:block">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-white border border-white/20">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Siwa Oasis</span>
          </div>
          <p className="text-xs opacity-80">Magical Egypt</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-4">
        <div className="mb-6">
          <span className="inline-block bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full px-6 py-2 text-sm font-medium mb-4">
            ✨ Discover the Magic of Egyptian Desert
          </span>
        </div>
        
        <h1 className="text-5xl md:text-8xl font-bold mb-6 text-balance leading-tight">
          <span className="bg-gradient-to-r from-white via-yellow-200 to-primary bg-clip-text text-transparent">
            Siwa
          </span>
          <br />
          <span className="text-4xl md:text-6xl">With Us</span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 text-pretty opacity-90 max-w-3xl mx-auto leading-relaxed">
          Discover the magic of Siwa Oasis through authentic eco-tourism and cultural heritage experiences
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-4 text-lg rounded-full shadow-2xl hover:shadow-primary/25 transition-all duration-300 hover:scale-105"
          >
            Book Your Trip Now
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-white text-white hover:bg-white hover:text-foreground px-10 py-4 text-lg bg-white/10 backdrop-blur-sm rounded-full transition-all duration-300 hover:scale-105"
            onClick={() => setShowVideo(!showVideo)}
          >
            <Play className="w-5 h-5 mr-2" />
            {showVideo ? 'View Photos' : 'Watch Video'}
          </Button>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">500+</div>
            <div className="opacity-80">Happy Visitors</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">15+</div>
            <div className="opacity-80">Unique Experiences</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">4.9</div>
            <div className="opacity-80">Excellent Rating</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}
