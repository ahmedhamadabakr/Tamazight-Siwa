import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { FeaturedTours } from "@/components/featured-tours"
import { StatsSection } from "@/components/stats-section"
import { OverviewSection } from "@/components/overview-section"
import { VideoShowcase } from "@/components/video-showcase"
import { GalleryPreview } from "@/components/gallery-preview"
import { TestimonialsSection } from "@/components/testimonials-section"
import { ServicesSection } from "@/components/services-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <FeaturedTours />
      <StatsSection />
      <OverviewSection />
      <VideoShowcase />
      <GalleryPreview />
      <TestimonialsSection />
      <ServicesSection />
      <Footer />
    </main>
  )
}
