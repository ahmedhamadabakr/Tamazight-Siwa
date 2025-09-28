import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/siwa-oasis-desert-landscape-with-palm-trees-and-go.jpg')`,
        }}
      >
        <div className="absolute inset-0 hero-gradient opacity-60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">Experience Siwa</h1>
        <p className="text-xl md:text-2xl mb-8 text-pretty opacity-90">
          Discover the magic of Siwa Oasis through authentic eco-tourism and cultural heritage experiences
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg">
            Book Your Trip
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-foreground px-8 py-4 text-lg bg-transparent"
          >
            <Play className="w-5 h-5 mr-2" />
            Watch Video
          </Button>
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
