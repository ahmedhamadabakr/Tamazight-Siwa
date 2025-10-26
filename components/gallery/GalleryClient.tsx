"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Images, Loader2 } from "lucide-react"

interface GalleryImage {
  _id: string
  title: string
  description: string
  imageUrl: string
  category: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export function GalleryClient({ images }: { images: GalleryImage[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [lightbox, setLightbox] = useState<{ src: string; title: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const categories = useMemo(() => {
    const set = new Set<string>(["all"]) 
    images.forEach((img) => set.add(img.category))
    return Array.from(set)
  }, [images])

  const filteredImages = useMemo(() => {
    return activeCategory === "all" ? images : images.filter((img) => img.category === activeCategory)
  }, [images, activeCategory])

  return (
    <>
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
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-12">
              <Images className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No images found in this category</h3>
              <p className="text-muted-foreground">Try another category or come back later to see more images</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredImages.map((image) => (
                <div
                  key={image._id}
                  className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-2xl cursor-pointer"
                  onClick={() => setLightbox({ src: image.imageUrl, title: image.title })}
                >
                  <div className="relative w-full h-64 rounded-xl overflow-hidden">
                    <Image
                      src={image.imageUrl}
                      alt={image.title}
                      fill
                      className="group-hover:scale-110 transition-transform duration-500 w-full h-full object-cover"
                      quality={75}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
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
                      <p className="text-sm opacity-80">{image.description || "No description available"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50" onClick={() => setLightbox(null)}>
          <div className="relative max-w-4xl w-full px-4">
            <Image
              src={lightbox.src}
              alt={lightbox.title}
              width={1200}
              height={800}
              className="rounded-lg mx-auto"
              quality={95}
            />
            <p className="text-center text-white mt-4 text-lg">{lightbox.title}</p>
          </div>
        </div>
      )}
    </>
  )
}
