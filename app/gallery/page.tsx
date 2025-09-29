"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Camera, Heart, Share2, Download, MapPin, Images, Users } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

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
  const [activeCategory, setActiveCategory] = useState("All")
  const [lightbox, setLightbox] = useState<{ src: string; title: string } | null>(null)

  const filteredImages =
    activeCategory === "All"
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/siwa-oasis-sunset-salt-lakes-reflection.jpg"
          alt="Siwa Oasis Gallery"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white max-w-3xl mx-auto px-4"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Siwa Oasis Gallery</h1>
          <p className="text-lg md:text-2xl opacity-90">
            Discover the breathtaking beauty of Siwa Oasis through our lens
          </p>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <Images className="mx-auto w-8 h-8 text-primary mb-2" />
              <div className="text-2xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Photos</div>
            </div>
            <div>
              <MapPin className="mx-auto w-8 h-8 text-primary mb-2" />
              <div className="text-2xl font-bold text-primary">50+</div>
              <div className="text-sm text-muted-foreground">Locations</div>
            </div>
            <div>
              <Camera className="mx-auto w-8 h-8 text-primary mb-2" />
              <div className="text-2xl font-bold text-primary">10</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div>
              <Users className="mx-auto w-8 h-8 text-primary mb-2" />
              <div className="text-2xl font-bold text-primary">3</div>
              <div className="text-sm text-muted-foreground">Photographers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto overflow-x-auto">
          <div className="flex gap-3 justify-center min-w-max">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category)}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-2xl cursor-pointer"
                onClick={() => setLightbox({ src: image.src, title: image.title })}
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                  {/* Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-black">{image.category}</Badge>
                  </div>

                  {/* Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="font-bold text-lg">{image.title}</h3>
                    <p className="text-sm opacity-80">by {image.photographer}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 text-center text-white">
        <Image
          src="/great-sand-sea-dunes-golden-hour.jpg"
          alt="Photography Tours"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <Camera className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Capture Your Own Memories</h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Join our photography tours and learn to capture Siwa&apos;s beauty like a pro
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-black hover:bg-white/90">
              Photography Tours
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-black hover:bg-white hover:text-black-900"
            >
              Private Sessions
            </Button>
          </div>
        </div>
      </section>

      {/* Instagram Feed */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Follow Our Journey</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Stay updated with daily moments from Siwa Oasis
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                <Image
                  src={`/placeholder.svg?height=300&width=300&text=Post+${i}`}
                  alt={`Instagram Post ${i}`}
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
            ))}
          </div>

          <Button
            size="lg"
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-0"
          >
            Follow on Instagram
          </Button>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-4xl w-full px-4">
            <Image
              src={lightbox.src}
              alt={lightbox.title}
              width={1200}
              height={800}
              className="rounded-lg mx-auto"
            />
            <p className="text-center text-white mt-4 text-lg">{lightbox.title}</p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
