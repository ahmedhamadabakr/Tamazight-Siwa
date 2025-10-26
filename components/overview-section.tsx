import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Leaf, Users, Award, Heart } from "lucide-react"

const highlights = [
  "Enjoy Siwa Great Sand Sea Desert Safari Experience with sand boarding and a desert sunset",
  "Float at the salt lakes and swim at the Cleopatra spring",
  "Swim at the natural cold sea and hot springs",
  "Visit the Shali fortress, Oracle Temple, Mountain of the dead",
  "Be educated about the Siwan traditional life style at the Siwan House",
  "Watch the sunset from the desert and from the Island with tasting Siwan Tea",
]

const values = [
  {
    icon: Leaf,
    title: "Eco-Tourism",
    description: "Sustainable travel practices that preserve Siwa's natural beauty for future generations",
  },
  {
    icon: Users,
    title: "Cultural Immersion",
    description: "Authentic experiences with local Siwan communities and traditional Berber culture",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description: "Carefully curated experiences with attention to comfort, safety, and authenticity",
  },
  {
    icon: Heart,
    title: "Passionate Guides",
    description: "Local experts who share their deep love and knowledge of Siwa Oasis",
  },
]

export function OverviewSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8 text-balance">Overview</h2>
            <p className="text-lg text-muted-foreground mb-8 text-pretty leading-relaxed">
              The Siwa oasis is one of the Western Desert's most magical areas, but it's more than an 8-hour drive from
              Cairo. An isolated but journey and yet to find comfort of your own private vehicle with our expert local
              guides.
            </p>
            <p className="text-lg text-muted-foreground mb-8 text-pretty leading-relaxed">
              Explore the Great Sand Sea Desert, enjoy sandboarding and a desert sunset, we will take you float at
              unique experiences you will have to your life, ancient oasis, Fitness Island, and more.
            </p>

            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-foreground mb-4">Trip Highlights:</h3>
              {highlights.map((highlight, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground text-pretty">{highlight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content */}
          <div className="space-y-8">
            <div className="relative w-full h-64 rounded-lg shadow-lg overflow-hidden">
              <Image
                src="/siwa-oasis-natural-springs-with-turquoise-water-an.jpg"
                alt="Siwa Oasis Natural Springs"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
                quality={70}
                priority={false}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6 text-center">
                    <value.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-foreground mb-2 text-balance">{value.title}</h4>
                    <p className="text-sm text-muted-foreground text-pretty">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
