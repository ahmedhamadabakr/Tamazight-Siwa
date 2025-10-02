import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Clock, Users } from "lucide-react"
import { tours } from "@/app/data/tours"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function FeaturedTours() {

  const firstFourItems = tours.slice(0, 4);
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">Featured Experiences</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Discover our carefully curated selection of authentic Siwa experiences, from desert adventures to cultural
            immersion
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {firstFourItems.map((tour) => (
            <Card key={tour.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative overflow-hidden">
                <img
                  src={tour.image || "/placeholder.svg"}
                  alt={tour.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-3 text-balance">{tour.title}</h3>
                <p className="text-muted-foreground mb-4 text-pretty">{tour.description}</p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{tour.duration}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{tour.groupSize}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{tour.location}</span>
                  </div>
                </div>
                <Link href={`/tours/${tour.title.toLowerCase().replace(/\s+/g, "-")}`} className="w-full">
                  <Button variant="outline" className="w-full">Learn More</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
