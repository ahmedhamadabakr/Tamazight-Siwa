"use client"
"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Hotel, Car, Utensils, Compass, Wifi, Shield, Clock, Heart } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

const services = [
  {
    icon: Hotel,
    title: "Luxury Accommodation",
    description: "Comfortable accommodations ranging from eco-lodges to luxury desert camps",
    image: "/siwa-oasis-traditional-berber-architecture-at-suns.jpg",
    features: ["Free WiFi", "Traditional Breakfast", "Oasis View"]
  },
  {
    icon: Car,
    title: "Safe Transportation",
    description: "Safe and reliable transport services with experienced local drivers",
    image: "/desert-road-with-4x4-vehicle-in-siwa-landscape.jpg",
    features: ["Modern Vehicles", "Trained Drivers", "Full Insurance"]
  },
  {
    icon: Utensils,
    title: "Authentic Restaurant",
    description: "Authentic Siwan cuisine featuring traditional dishes and local ingredients",
    image: "/siwa-traditional-crafts-berber-culture.jpg",
    features: ["Traditional Dishes", "Natural Ingredients", "Cultural Experience"]
  },
  {
    icon: Compass,
    title: "Desert Safaris",
    description: "Guided adventures through the Great Sand Sea with sandboarding and camping",
    image: "/great-sand-sea-dunes-4x4-safari.jpg",
    features: ["Expert Guides", "Modern Equipment", "Safe Experience"]
  },
]

export function ServicesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-accent/10 rounded-full px-6 py-2 mb-4">
            <span className="text-accent font-medium">🏆 Our Services</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Complete Services for a Perfect Journey
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Comprehensive travel services designed to make your Siwa experience seamless, comfortable, and unforgettable
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 border-none bg-white/50 backdrop-blur-sm hover:bg-white/70 hover:scale-105"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Background Image */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                <Image
                  src={service.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                  quality={70}
                  aria-hidden
                />
              </div>

              <CardContent className="relative p-8 text-center">
                {/* Icon with animated background */}
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500"></div>
                  <div className="relative w-full h-full bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:bg-primary/10 transition-all duration-300">
                    <service.icon className="w-10 h-10 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-4 text-balance group-hover:text-primary transition-colors duration-300">
                  {service.title}
                </h3>
                
                <p className="text-muted-foreground text-pretty mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features List */}
                <div className={`space-y-2 transition-all duration-500 ${hoveredIndex === index ? 'opacity-100 max-h-32' : 'opacity-0 max-h-0'} overflow-hidden`}>
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Hover indicator */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-full group-hover:w-3/4 transition-all duration-500"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Services Banner */}
        <div className="mt-16 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-8 text-center">
          <div className="flex flex-wrap justify-center gap-8 items-center">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Wifi className="w-4 h-4 text-primary" />
              <span>Free WiFi</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Shield className="w-4 h-4 text-secondary" />
              <span>Full Insurance</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Clock className="w-4 h-4 text-accent" />
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Heart className="w-4 h-4 text-red-500" />
              <span>Personal Service</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
