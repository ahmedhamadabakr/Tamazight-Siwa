import { ClientOnlyNavigation } from "@/components/ClientOnlyNavigation"
import { HeroSection } from "@/components/hero-section"
import { FeaturedTours } from "@/components/featured-tours"
import { StatsSection } from "@/components/stats-section"
import { OverviewSection } from "@/components/overview-section"
import dynamic from "next/dynamic"
// Defer below-the-fold components to improve FCP
const VideoShowcaseLazy = dynamic(() => import("@/components/video-showcase").then(m => ({ default: m.VideoShowcase })), { ssr: false })
const GalleryPreviewLazy = dynamic(() => import("@/components/gallery-preview").then(m => ({ default: m.GalleryPreview })), { ssr: false })
const TestimonialsSectionLazy = dynamic(() => import("@/components/testimonials-section").then(m => ({ default: m.TestimonialsSection })), { ssr: false })
const ServicesSectionLazy = dynamic(() => import("@/components/services-section").then(m => ({ default: m.ServicesSection })), { ssr: false })
import { Footer } from "@/components/footer"
import { ResourceHints } from "@/components/PerformanceMonitor"
import { GlobalPerformanceOptimizer, CriticalCSS } from "@/components/GlobalPerformanceOptimizer"
import { HomePageSEO } from "@/components/PageSEO"
import { LocalSEO } from "@/components/LocalSEO"

export default function HomePage() {
  return (
    <>
      {/* SEO Optimization */}
      <HomePageSEO />
      <LocalSEO />
      
      {/* Essential optimizations only */}
      <CriticalCSS />
      <ResourceHints />
      <GlobalPerformanceOptimizer />
      
      <main className="min-h-screen">
        <ClientOnlyNavigation />
        <HeroSection />
        <FeaturedTours />
        <StatsSection />
        <OverviewSection />
        <VideoShowcaseLazy />
        <GalleryPreviewLazy />
        <TestimonialsSectionLazy />
        <ServicesSectionLazy />
        <Footer />
      </main>
    </>
  )
}
