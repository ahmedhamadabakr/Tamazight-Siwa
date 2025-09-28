import { Button } from "@/components/ui/button"
import Link from "next/link"

const galleryImages = [
  {
    src: "/siwa-oasis-traditional-berber-architecture-at-suns.jpg",
    alt: "Traditional Siwa Architecture",
  },
  {
    src: "/crystal-clear-natural-spring-water-in-siwa-oasis.jpg",
    alt: "Natural Springs",
  },
  {
    src: "/golden-sand-dunes-in-siwa-great-sand-sea.jpg",
    alt: "Great Sand Sea",
  },
  {
    src: "/siwa-salt-lakes-with-reflection-of-sky.jpg",
    alt: "Salt Lakes",
  },
  {
    src: "/ancient-oracle-temple-ruins-in-siwa-oasis.jpg",
    alt: "Oracle Temple",
  },
]

export function GalleryPreview() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Siwa: Capturing the Essence of Egypt's Oasis Paradise
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Experience the breathtaking beauty of Siwa through our curated collection of moments that showcase the
            oasis's natural wonders and cultural heritage
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <img
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-sm font-medium">{image.alt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/gallery">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4">
              View Full Gallery
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
