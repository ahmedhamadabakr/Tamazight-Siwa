import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

// Basic text skeleton lines
export function TextSkeleton({ lines = 1 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`} />
      ))}
    </div>
  )
}

// Hero section skeleton with background image placeholder
export function HeroSkeleton() {
  return (
    <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
      <Skeleton className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 space-y-4">
        <Skeleton className="h-12 w-3/4 mx-auto bg-white/20" />
        <Skeleton className="h-6 w-2/3 mx-auto bg-white/20" />
      </div>
    </section>
  )
}

// Contact form skeleton
export function ContactFormSkeleton() {
  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-8 space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <div>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div>
          <Skeleton className="h-4 w-28 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div>
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div>
          <Skeleton className="h-4 w-36 mb-2" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-12 w-full" />
      </CardContent>
    </Card>
  )
}

// Contact info card skeleton
export function ContactInfoSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="border-0 shadow-lg">
          <CardContent className="p-6 flex gap-4 items-start">
            <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-40" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Team member card skeleton
export function TeamCardSkeleton() {
  return (
    <Card className="text-center border-0 shadow-lg">
      <CardContent className="p-8 space-y-4">
        <Skeleton className="w-24 h-24 rounded-full mx-auto" />
        <Skeleton className="h-6 w-32 mx-auto" />
        <Skeleton className="h-4 w-24 mx-auto" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4 mx-auto" />
        </div>
      </CardContent>
    </Card>
  )
}

// Team section skeleton
export function TeamSectionSkeleton() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <Skeleton className="h-10 w-48 mx-auto" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <TeamCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

// Value card skeleton
export function ValueCardSkeleton() {
  return (
    <Card className="text-center border-0 shadow-lg">
      <CardContent className="p-8 space-y-4">
        <Skeleton className="w-16 h-16 rounded-full mx-auto" />
        <Skeleton className="h-6 w-24 mx-auto" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6 mx-auto" />
        </div>
      </CardContent>
    </Card>
  )
}

// Values section skeleton
export function ValuesSectionSkeleton() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <Skeleton className="h-10 w-32 mx-auto" />
          <Skeleton className="h-6 w-80 mx-auto" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <ValueCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

// FAQ skeleton
export function FAQSkeleton() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12 space-y-4">
          <Skeleton className="h-10 w-64 mx-auto" />
          <Skeleton className="h-6 w-80 mx-auto" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="w-6 h-6 rounded" />
                </div>
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// Social media card skeleton
export function SocialCardSkeleton() {
  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-8 text-center space-y-4">
        <Skeleton className="w-16 h-16 rounded-full mx-auto" />
        <Skeleton className="h-6 w-20 mx-auto" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  )
}

// Social media section skeleton
export function SocialSectionSkeleton() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="space-y-4 mb-12">
          <Skeleton className="h-10 w-48 mx-auto" />
          <Skeleton className="h-6 w-64 mx-auto" />
        </div>
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {Array.from({ length: 3 }).map((_, i) => (
            <SocialCardSkeleton key={i} />
          ))}
        </div>
        <Card className="relative overflow-hidden">
          <CardContent className="p-12 space-y-4">
            <Skeleton className="h-8 w-64 mx-auto" />
            <Skeleton className="h-6 w-80 mx-auto" />
            <Skeleton className="h-12 w-48 mx-auto" />
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

// Image skeleton with different aspect ratios
export function ImageSkeleton({ className = "", aspectRatio = "16/9" }: {
  className?: string;
  aspectRatio?: "1/1" | "4/3" | "16/9" | "21/9";
}) {
  const aspectClasses = {
    "1/1": "aspect-square",
    "4/3": "aspect-[4/3]",
    "16/9": "aspect-video",
    "21/9": "aspect-[21/9]"
  };

  return (
    <Skeleton className={`rounded-lg ${aspectClasses[aspectRatio]} ${className}`} />
  );
}

// Button skeleton
export function ButtonSkeleton({ size = "md", className = "" }: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClasses = {
    sm: "h-9 w-20",
    md: "h-10 w-24",
    lg: "h-12 w-32"
  };

  return <Skeleton className={`${sizeClasses[size]} ${className}`} />;
}

// Icon skeleton for avatar-like elements
export function IconSkeleton({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  };

  return <Skeleton className={`rounded-full ${sizeClasses[size]}`} />;
}
