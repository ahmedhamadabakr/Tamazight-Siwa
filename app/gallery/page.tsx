import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Camera, Heart, Share2, Download } from "lucide-react"
import Image from "next/image"

const galleryImages = [
  {
    id: 1,
    src: "/siwa-oasis-sunset-salt-lakes-reflection.jpg",
    alt: "Siwa salt lakes at sunset",
    category: "Landscapes",
    title: "Salt Lakes Sunset",
    photographer: "Ahmed Al-Siwi",
  },
  {
    id: 2,
    src: "/traditional-siwa-architecture-mud-brick-buildings.jpg",
    alt: "Traditional Siwa architecture",
    category: "Architecture",
    title: "Ancient Shali Fortress",
    photographer: "Fatima Amazigh",
  },
  {
    id: 3,
    src: "/great-sand-sea-dunes-golden-hour.jpg",
    alt: "Great Sand Sea dunes",
    category: "Desert",
    title: "Great Sand Sea",
    photographer: "Omar Desert",
  },
  {
    id: 4,
    src: "/siwa-palm-groves-date-palms-oasis.jpg",
    alt: "Siwa palm groves",
    category: "Nature",
    title: "Palm Groves Paradise",
    photographer: "Ahmed Al-Siwi",
  },
  {
    id: 5,
    src: "/cleopatra-bath-natural-spring-siwa.jpg",
    alt: "Cleopatra's Bath natural spring",
    category: "Springs",
    title: "Cleopatra's Bath",
    photographer: "Fatima Amazigh",
  },
  {
    id: 6,
    src: "/siwa-berber-culture-traditional-dress.jpg",
    alt: "Traditional Siwan culture",
    category: "Culture",
    title: "Berber Heritage",
    photographer: "Omar Desert",
  },
  {
    id: 7,
    src: "/siwa-night-sky-stars-milky-way-desert.jpg",
    alt: "Starry night over Siwa",
    category: "Night Sky",
    title: "Desert Stars",
    photographer: "Ahmed Al-Siwi",
  },
  {
    id: 8,
    src: "/placeholder.svg?height=500&width=400",
    alt: "Natural hot springs",
    category: "Springs",
    title: "Healing Waters",
    photographer: "Fatima Amazigh",
  },
  {
    id: 9,
    src: "/placeholder.svg?height=400&width=600",
    alt: "Fossil Valley discoveries",
    category: "Geology",
    title: "Ancient Fossils",
    photographer: "Omar Desert",
  },
  {
    id: 10,
    src: "/placeholder.svg?height=600&width=400",
    alt: "Traditional Siwan crafts",
    category: "Culture",
    title: "Artisan Crafts",
    photographer: "Ahmed Al-Siwi",
  },
  {
    id: 11,
    src: "/placeholder.svg?height=400&width=600",
    alt: "Aerial view of Siwa Oasis",
    category: "Landscapes",
    title: "Oasis from Above",
    photographer: "Fatima Amazigh",
  },
  {
    id: 12,
    src: "/placeholder.svg?height=500&width=400",
    alt: "Desert camping experience",
    category: "Adventure",
    title: "Desert Camping",
    photographer: "Omar Desert",
  },
]

const categories = [
  "All",
  "Landscapes",
  "Culture",
  "Desert",
  "Architecture",
  "Springs",
  "Nature",
  "Night Sky",
  "Geology",
  "Adventure",
]

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30" />
        <Image
          src="/placeholder.svg?height=500&width=1200"
          alt="Siwa Oasis Gallery"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">Gallery</h1>
          <p className="text-xl md:text-2xl text-balance">
            Discover the breathtaking beauty of Siwa Oasis through our lens
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-sm text-muted-foreground">Photos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-sm text-muted-foreground">Locations</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">10</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">3</div>
              <div className="text-sm text-muted-foreground">Photographers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "All" ? "default" : "outline"}
                size="sm"
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {galleryImages.map((image, index) => (
              <div
                key={image.id}
                className={`group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${
                  index % 7 === 0 || index % 7 === 3 ? "md:col-span-2 md:row-span-2" : ""
                }`}
              >
                <div className="relative w-full h-72">
                  <Image
                    src={image.src || "/placeholder.svg"}
                    alt={image.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-400"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-background/90 text-foreground">
                      {image.category}
                    </Badge>
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button size="sm" variant="secondary" className="w-8 h-8 p-0 bg-background/90 hover:bg-background">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="secondary" className="w-8 h-8 p-0 bg-background/90 hover:bg-background">
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="secondary" className="w-8 h-8 p-0 bg-background/90 hover:bg-background">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Image Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-semibold text-lg mb-1">{image.title}</h3>
                    <p className="text-sm opacity-90">by {image.photographer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photography Tours CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center px-4">
          <Camera className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Capture Your Own Memories</h2>
          <p className="text-xl mb-8 opacity-90">
            Join our photography tours and learn to capture Siwa's beauty like a pro
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-background text-foreground hover:bg-background/90">
              Photography Tours
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
            >
              Private Photo Sessions
            </Button>
          </div>
        </div>
      </section>

      {/* Instagram Feed */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Follow Our Journey</h2>
          <p className="text-xl text-muted-foreground mb-8">Stay updated with daily moments from Siwa Oasis</p>
          <div className="flex justify-center items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-semibold text-lg">@tamazight_siwa</div>
              <div className="text-sm text-muted-foreground">Follow us on Instagram</div>
            </div>
          </div>
          <Button
            size="lg"
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-0"
          >
            Follow on Instagram
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
