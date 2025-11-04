import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

const galleryImages = [
  {
    src: "/siwa-oasis-sunset-salt-lakes-reflection.jpg",
    alt: "Salt Lakes at Sunset",
    category: "Nature"
  },
  {
    src: "/crystal-clear-natural-spring-water-in-siwa-oasis.jpg",
    alt: "Crystal Clear Natural Springs",
    category: "Natural Springs"
  },
  {
    src: "/golden-sand-dunes-in-siwa-great-sand-sea.jpg",
    alt: "Golden Dunes in the Great Sand Sea",
    category: "Desert"
  },
  {
    src: "/siwa-oasis-traditional-berber-architecture-at-suns.jpg",
    alt: "Traditional Berber Architecture",
    category: "Heritage"
  },
  {
    src: "/siwa-night-sky-stars-milky-way-desert.jpg",
    alt: "Siwa's Starry Night Sky",
    category: "Astronomy"
  },
  {
    src: "/Siwa/WhatsApp Image 2025-10-11 at 14.17.19_dd9ffdcc.jpg",
    alt: "Breathtaking Natural Views",
    category: "Nature"
  },
  {
    src: "/Siwa/WhatsApp Image 2025-10-11 at 14.22.17_134bc8e1.jpg",
    alt: "Authentic Oasis Experiences",
    category: "Experiences"
  },
  {
    src: "/siwa-hot-springs-natural-pools-wellness.jpg",
    alt: "Natural Hot Springs",
    category: "Wellness"
  },
]

export function GalleryPreview() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-primary/10 rounded-full px-6 py-2 mb-4">
            <span className="text-primary font-medium">📸 Photo Gallery</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Siwa: Egypt's Desert Jewel
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Experience the breathtaking beauty of Siwa through our curated collection of moments that showcase the oasis's natural wonders and cultural heritage
          </p>
        </div>

        {/* Masonry Grid Layout */}
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 mb-12">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 mb-6 break-inside-avoid"
              style={{ height: index % 3 === 0 ? '300px' : index % 2 === 0 ? '250px' : '200px' }}
            >
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                fill
                sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                priority={index < 2}
              />

              {/* Category Badge */}
              <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium">
                {image.category}
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="font-medium text-lg mb-1">{image.alt}</p>
                  <p className="text-sm opacity-80">Click to enlarge</p>
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 ring-0 group-hover:ring-4 ring-primary/30 rounded-2xl transition-all duration-300"></div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-8">
          <h3 className="text-2xl font-bold text-foreground mb-4">See More Beautiful Memories</h3>
          <p className="text-muted-foreground mb-6">Discover hundreds of photos and videos from our previous visitors' experiences</p>
          <Link href="/gallery">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              Explore Full Gallery
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
