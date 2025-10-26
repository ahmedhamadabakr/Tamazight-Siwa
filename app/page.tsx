import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { FeaturedTours } from "@/components/featured-tours"
import { StatsSection } from "@/components/stats-section"
import { OverviewSection } from "@/components/overview-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { ServicesSection } from "@/components/services-section"
import { Footer } from "@/components/footer"
import { ResourceHints } from "@/components/PerformanceMonitor"
import { GlobalPerformanceOptimizer, CriticalCSS } from "@/components/GlobalPerformanceOptimizer"
import { FontOptimizer } from "@/components/FontOptimizer"
import { AnimationOptimizer } from "@/components/AnimationOptimizer"
import { MemoryOptimizer } from "@/components/MemoryOptimizer"
import { NetworkOptimizer } from "@/components/NetworkOptimizer"
import { HomePageSEO } from "@/components/PageSEO"
import { LocalSEO } from "@/components/LocalSEO"
import { SEOPerformanceOptimizer } from "@/components/SEOPerformanceOptimizer"
import dynamic from "next/dynamic"

// Import components normally to avoid dynamic import issues
import { VideoShowcase } from "@/components/video-showcase"
import { GalleryPreview } from "@/components/gallery-preview"

export default function HomePage() {
  return (
    <>
      {/* SEO Optimization */}
      <HomePageSEO />
      <LocalSEO />
      
      {/* Critical optimizations */}
      <CriticalCSS />
      <FontOptimizer />
      <ResourceHints />
      
      {/* Performance optimizers */}
      <GlobalPerformanceOptimizer />
      <AnimationOptimizer />
      <MemoryOptimizer />
      <NetworkOptimizer />
      <SEOPerformanceOptimizer />
      
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
    </>
  )
}
