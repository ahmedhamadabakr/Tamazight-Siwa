import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Users } from "lucide-react"

const tours = [
  {
    id: 1,
    title: "Siwa Tour Packages",
    description: "Explore the ancient oasis with guided tours through palm groves and natural springs",
    image: "/siwa-oasis-palm-trees-and-natural-springs.jpg",
    duration: "3 Days",
    groupSize: "2-8 People",
    location: "Siwa Oasis",
  },
  {
    id: 2,
    title: "White and Black Desert Tour",
    description: "Journey through Egypt's most spectacular desert landscapes and rock formations",
    image: "/white-desert-rock-formations-and-black-desert-land.jpg",
    duration: "2 Days",
    groupSize: "4-12 People",
    location: "Western Desert",
  },
  {
    id: 3,
    title: "Transportation Services",
    description: "Comfortable and safe transportation to and from Siwa with experienced drivers",
    image: "/desert-road-with-4x4-vehicle-in-siwa-landscape.jpg",
    duration: "Flexible",
    groupSize: "1-15 People",
    location: "Cairo to Siwa",
  },
  {
    id: 4,
    title: "Cultural Heritage Tours",
    description: "Immerse yourself in Siwa's rich Berber culture and ancient traditions",
    image: "/traditional-siwa-berber-architecture-and-cultural-.jpg",
    duration: "1-2 Days",
    groupSize: "2-10 People",
    location: "Siwa Town",
  },
]

export function FeaturedTours() {
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
          {tours.map((tour) => (
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
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Learn More</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
