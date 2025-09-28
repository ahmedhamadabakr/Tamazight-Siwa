import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { FeaturedTours } from "@/components/featured-tours"
import { OverviewSection } from "@/components/overview-section"
import { GalleryPreview } from "@/components/gallery-preview"
import { ServicesSection } from "@/components/services-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <FeaturedTours />
      <OverviewSection />
      <GalleryPreview />
      <ServicesSection />
      <Footer />
    </main>
  )
}
