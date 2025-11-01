"use client"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Clock, Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import Image from "next/image"

interface Tour {
  id: string;
  title: string;
  slug?: string; // Add slug field
  description: string;
  duration: string;
  groupSize: string;
  location: string;
  images: string[];
}

export function FeaturedTours() {

const [tours, setTours] = useState<Tour[]>([]);

useEffect(() => {
    fetchTours();
}, []);

const fetchTours = async () => {
    try {
        const response = await fetch(`/api/tours`);
        const data = await response.json();
        if (data.success) {
            setTours(data.data || []);
        }
    } catch (error) {
        console.error('Error fetching tours:', error);
    }
};

  const firstFourItems = tours.slice(0, 4);
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-accent/10 rounded-full px-6 py-2 mb-4">
            <span className="text-foreground font-medium">🌟 Featured Experiences</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Discover Siwa's Magic
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Discover our carefully curated selection of authentic Siwa experiences, from desert adventures to cultural immersion
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {firstFourItems.map((tour, index) => (
            <Card key={tour.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
              <div className="relative overflow-hidden h-48">
                <Image
                  src={tour.images[0] || "/placeholder.svg"}
                  alt={tour.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                  quality={75}
                  priority={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Image Count Badge */}
                {tour.images.length > 1 && (
                  <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                    {tour.images.length} Photos
                  </div>
                )}

                {/* Hover Overlay with Title */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-white text-center p-4">
                    <h3 className="font-bold text-lg mb-2">{tour.title}</h3>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6 flex flex-col h-full">
                <h3 className="text-xl font-bold text-foreground mb-3 text-balance line-clamp-2">{tour.title}</h3>
                <p className="text-muted-foreground mb-4 text-pretty line-clamp-3 flex-grow">{tour.description}</p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-2 text-primary" />
                    <span>{parseInt(tour.duration) > 1 ? `${tour.duration} days` : `${tour.duration} day`}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="w-4 h-4 mr-2 text-primary" />
                    <span>{tour.groupSize} {parseInt(tour.groupSize) > 1 ? 'People' : 'Person'}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2 text-primary" />
                    <span>{tour.location} {tour.location.split(',').length > 1 ? 'Locations' : 'Location'}</span>
                  </div>
                </div>
                
                <Link href={`/tours/${tour.slug || tour.id}`} className="w-full mt-auto" aria-label={`Discover more about ${tour.title}`}>
                  <Button variant="outline" className="w-full hover:bg-primary hover:text-white transition-colors" aria-label={`Discover more about ${tour.title}`}>
                    Discover More
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
