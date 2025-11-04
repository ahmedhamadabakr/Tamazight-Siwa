import { ClientOnlyNavigation } from "@/components/ClientOnlyNavigation"
import { HeroSection } from "@/components/hero-section"
import dynamic from "next/dynamic"
// Defer below-the-fold components to improve FCP
const VideoShowcaseLazy = dynamic(() => import("@/components/video-showcase").then(m => ({ default: m.VideoShowcase })), { ssr: false })
const GalleryPreviewLazy = dynamic(() => import("@/components/gallery-preview").then(m => ({ default: m.GalleryPreview })), { ssr: false })
const TestimonialsSectionLazy = dynamic(() => import("@/components/testimonials-section").then(m => ({ default: m.TestimonialsSection })), { ssr: false })
const ServicesSectionLazy = dynamic(() => import("@/components/services-section").then(m => ({ default: m.ServicesSection })), { ssr: false })
const FeaturedToursLazy = dynamic(() => import("@/components/featured-tours").then(m => ({ default: m.FeaturedTours })), { ssr: false, loading: () => null })
const StatsSectionLazy = dynamic(() => import("@/components/stats-section").then(m => ({ default: m.StatsSection })), { ssr: false, loading: () => null })
const OverviewSectionLazy = dynamic(() => import("@/components/overview-section").then(m => ({ default: m.OverviewSection })), { ssr: false, loading: () => null })
const FooterLazy = dynamic(() => import("@/components/footer").then(m => ({ default: m.Footer })), { ssr: false, loading: () => null })

// Defer the global optimizer to post-hydration
const GlobalPerfLazy = dynamic(() => import("@/components/GlobalPerformanceOptimizer").then(m => ({ default: m.GlobalPerformanceOptimizer })), { ssr: false, loading: () => null })
import { HomePageSEO } from "@/components/PageSEO"
import { LocalSEO } from "@/components/LocalSEO"

export default function HomePage() {
  return (
    <>
      {/* SEO Optimization */}
      <HomePageSEO />
      <LocalSEO />
      
      {/* Essential optimizations handled in root layout */}
      
      <main className="min-h-screen">
        <div className="h-14 md:h-16">
          <ClientOnlyNavigation />
        </div>
        <HeroSection />
        <section className="cv-auto"><FeaturedToursLazy /></section>
        <section className="cv-auto"><StatsSectionLazy /></section>
        <section className="cv-auto"><OverviewSectionLazy /></section>
        <section className="cv-auto"><VideoShowcaseLazy /></section>
        <section className="cv-auto"><GalleryPreviewLazy /></section>
        <section className="cv-auto"><TestimonialsSectionLazy /></section>
        <section className="cv-auto"><ServicesSectionLazy /></section>
        <section className="cv-auto"><FooterLazy /></section>
      </main>
      <GlobalPerfLazy />
    </>
  )
}
