import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Search, ArrowLeft } from "lucide-react"
import Link from "next/link"

export function TourNotFound() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Background */}
      <section className="relative h-[50vh] bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <div className="mb-6">
            <MapPin className="w-16 h-16 mx-auto mb-4 opacity-90" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Tour Not Found</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Sorry, the tour you're looking for doesn't exist or may have been removed.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/tours">
              <Button size="lg" variant="secondary" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Tours
              </Button>
            </Link>
            <Link href="/tours">
              <Button size="lg" variant="outline" className="flex items-center gap-2 text-white border-white hover:bg-white hover:text-blue-600">
                <Search className="w-4 h-4" />
                Browse All Tours
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Suggestions Section */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">What would you like to do?</h2>
          <p className="text-muted-foreground">
            Explore our collection of authentic Siwa experiences
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Browse All Tours</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Discover our complete collection of Siwa experiences
              </p>
              <Link href="/tours">
                <Button variant="outline" className="w-full">
                  View All Tours
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Search Tours</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Find specific tours by location, type, or duration
              </p>
              <Link href="/tours">
                <Button variant="outline" className="w-full">
                  Search Tours
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
