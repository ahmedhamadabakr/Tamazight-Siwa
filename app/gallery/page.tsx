
import { ClientOnlyNavigation } from "@/components/ClientOnlyNavigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Camera, MapPin, Images, Users, Link } from "lucide-react"
import Image from "next/image"
import { GalleryClient } from "@/components/gallery/GalleryClient"
import dbConnect from '@/lib/mongodb'
import { Suspense } from "react"

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

const categories = [
  { key: "all", label: "All" },
  { key: "Nature", label: "Nature" },
  { key: " Heritage", label: " Heritage" },
  { key: "Landmarks", label: "Landmarks" },
  { key: "Activities", label: "Activities" },
  { key: "Food", label: "Food" },
  { key: "Other", label: "Other" }
]

async function getGalleryImages(): Promise<{ images: GalleryImage[], error: string | null }> {
  try {
    const db = await dbConnect()
    const collection = db.collection('gallery')

    const query = { isActive: true }
    const images = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray()

    // Convert MongoDB documents to plain objects
    const serializedImages = images.map(img => ({
      _id: img._id?.toString() || '',
      title: img.title || '',
      description: img.description || '',
      imageUrl: img.imageUrl || '',
      category: img.category || 'Other',
      isActive: img.isActive !== false,
      createdAt: img.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: img.updatedAt?.toISOString() || new Date().toISOString()
    }))

    return { images: serializedImages, error: null }
  } catch (e) {
    console.error('Error fetching gallery images:', e)
    // Return empty array instead of error during build time
    const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build'
    return {
      images: [],
      error: isBuildTime ? null : 'Failed to connect to the server'
    }
  }
}

async function ImagesData() {
  const { images, error } = await getGalleryImages()
  if (error) {
    return (
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-center text-red-500">{error}</p>
        </div>
      </section>
    )
  }

  return (
    <>
      {/* Stats Section */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <Images className="mx-auto w-8 h-8 text-primary mb-2" />
              <div className="text-2xl font-bold text-primary">{images.length}+</div>
              <div className="text-sm text-muted-foreground">Image</div>
            </div>
            <div>
              <MapPin className="mx-auto w-8 h-8 text-primary mb-2" />
              <div className="text-2xl font-bold text-primary">50+</div>
              <div className="text-sm text-muted-foreground">Location</div>
            </div>
            <div>
              <Camera className="mx-auto w-8 h-8 text-primary mb-2" />
              <div className="text-2xl font-bold text-primary">{categories.length - 1}</div>
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

      {/* Filters + Grid + Lightbox (Client) */}
      <GalleryClient images={images} />
    </>
  )
}

function LoadingSection() {
  return (
    <section className="py-12 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center animate-pulse">
          <div>
            <div className="mx-auto w-8 h-8 bg-muted rounded mb-2" />
            <div className="h-6 w-16 bg-muted rounded mx-auto" />
            <div className="h-3 w-20 bg-muted rounded mx-auto mt-2" />
          </div>
          <div>
            <div className="mx-auto w-8 h-8 bg-muted rounded mb-2" />
            <div className="h-6 w-16 bg-muted rounded mx-auto" />
            <div className="h-3 w-20 bg-muted rounded mx-auto mt-2" />
          </div>
          <div>
            <div className="mx-auto w-8 h-8 bg-muted rounded mb-2" />
            <div className="h-6 w-16 bg-muted rounded mx-auto" />
            <div className="h-3 w-20 bg-muted rounded mx-auto mt-2" />
          </div>
          <div>
            <div className="mx-auto w-8 h-8 bg-muted rounded mb-2" />
            <div className="h-6 w-16 bg-muted rounded mx-auto" />
            <div className="h-3 w-20 bg-muted rounded mx-auto mt-2" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-background">
      <ClientOnlyNavigation />

      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/siwa-oasis-sunset-salt-lakes-reflection.jpg"
          alt="Siwa Oasis Gallery"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover"
          quality={60}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
        <div className="relative z-10 text-center text-white max-w-3xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Siwa Gallery</h1>
          <p className="text-lg md:text-2xl opacity-90">
            Discover the beauty of Siwa Oasis through our collection
          </p>
        </div>
      </section>

      <Suspense fallback={<LoadingSection />}>
        {/* Stats + Gallery stream in without blocking hero */}
        {/* Filters + Grid + Lightbox (Client) */}
        <ImagesData />
      </Suspense>

      {/* CTA Section */}
  

      {/* Instagram Feed */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Follow our journey</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Stay updated with the latest moments from Siwa Oasis
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-8">
            {[
              '/siwa-oasis-photography-golden-hour-palm-trees.jpg',
              '/siwa-oasis-sunset-salt-lakes-reflection.jpg',
              '/siwa-night-sky-stars-milky-way-desert.jpg',
              '/crystal-clear-natural-spring-water-in-siwa-oasis.jpg',
              '/great-sand-sea-dunes-golden-hour.jpg',
              '/siwa-traditional-crafts-berber-culture.jpg'
            ].map((src, i) => (
              <Link
                key={src}
                href="https://www.instagram.com/"
                target="_blank"
          
                className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
                aria-label={`Open Instagram post ${i + 1}`}
              >
                <Image
                  src={src}
                  alt={`Instagram Post ${i + 1}`}
                  fill
                  sizes="(min-width: 768px) 16.6vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover hover:scale-110 transition-transform duration-500"
                />
              </Link>
            ))}
          </div>

          <Link
            href="https://www.instagram.com/"
            target="_blank"
       
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-0"
            >
              Follow on Instagram
            </Button>
          </Link>
        </div>
      </section>

      {/* Lightbox moved to client component */}

      <Footer />
    </div>
  )
}
