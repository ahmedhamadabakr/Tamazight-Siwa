import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

export function TourLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section Skeleton */}
      <section className="relative h-[60vh]">
        <Skeleton className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <Skeleton className="h-12 md:h-16 w-3/4 max-w-4xl bg-white/20" />
        </div>
      </section>

      {/* Image Gallery Skeleton */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-video rounded-lg" />
          ))}
        </div>
      </section>

      {/* Content Section Skeleton */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <Skeleton className="h-8 w-64 mb-4" />
            <div className="space-y-3 mb-6">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>

            <Skeleton className="h-6 w-32 mb-4" />
            <div className="flex flex-wrap gap-2 mb-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Badge key={i} variant="outline" className="w-20 h-6">
                  <Skeleton className="h-3 w-full" />
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Skeleton className="w-4 h-4" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="w-4 h-4" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>

          {/* Booking Sidebar Skeleton */}
          <div className="w-full md:w-72 p-6 border rounded-lg shadow-md bg-card">
            <Skeleton className="h-10 w-32 mb-2" />
            <Skeleton className="h-4 w-20 mb-6" />
            <Skeleton className="h-12 w-full mb-3" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
