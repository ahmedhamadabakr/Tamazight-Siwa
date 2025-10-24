"use client"

import { useParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Star, User } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Session } from "next-auth";
import { BookingForm } from '@/components/BookingForm'
import { ImageGalleryFallback } from '@/components/ImageGalleryFallback'
import { TourLoading } from '@/components/tour/tour-loading'
import { TourNotFound } from '@/components/tour/tour-not-found'
import { TourReviews } from '@/components/tour/TourReviews'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Inside your component

export default function TourDetailsPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const router = useRouter()
  const session = useSession() as { data: Session | null; status: "loading" | "authenticated" | "unauthenticated" };
  const { slug } = useParams()
  const [tour, setTour] = useState<Tour | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  interface Tour {
    id: string;
    title: string;
    description: string;
    duration: string;
    groupSize: string;
    category: string;
    price: number; // Changed from string to number
    featured: boolean;
    status: string;
    location: string;
    images: string[];
    highlights: string[];
  }



  useEffect(() => {
    fetchTour();
  }, [slug]);

  const fetchTour = async () => {
    try {
      setIsLoading(true);
      const apiUrl = `/api/tours/${slug}`;
      const response = await fetch(apiUrl);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const data = await response.json();
      if (data.success) {
        if (data.data) {
          setTour(data.data);
        } else {
          setTour(null);
        }
      } else {
        setTour(null);
      }
    } catch (error) {
      setTour(null);
    } finally {
      setIsLoading(false);
    }
  };



  if (isLoading) {
    return <TourLoading />;
  }

  if (!tour) {
    return <TourNotFound />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Title */}
      <section className="relative h-[60vh]">
        {tour.images && tour.images.length > 0 ? (
          <Image
            src={tour.images[0]}
            alt={tour.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
            <div className="text-white text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{tour.title}</h1>
              <p className="text-lg opacity-90">No images available</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center px-4">{tour.title}</h1>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Image Gallery</h2>
        <ImageGalleryFallback 
          images={tour.images || []} 
          title={tour.title}
          className="h-96"
        />
      </section>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4">About this tour</h2>
            <p className="text-muted-foreground mb-6">{tour.description}</p>
            <h3 className="font-semibold mb-2">Highlights:</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {tour.highlights?.map((h, i) => (
                <Badge key={i} variant="outline">{h}</Badge>
              ))}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> {tour.duration}</div>
              {/*   <div className="flex items-center gap-1"><Users className="w-4 h-4" /> {tour.groupSize}</div> */}
              {/*    <div className="flex items-center gap-1"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />{tour.rating} ({tour.reviews})</div> */}
            </div>
          </div>

          <div className="w-full md:w-72 p-6 border rounded-lg shadow-md bg-card">
            <div className="text-3xl font-bold text-primary mb-2">{tour.price}</div>
            <p className="text-muted-foreground mb-6">per person</p>
            <>
              <Button
                className="w-full mb-3"
                onClick={() => {
                  if (!session) {
                    router.push(`/login?callbackUrl=/tours/${slug}`)
                    return
                  }
                  setIsBookingOpen(true)
                }}
              >
                <User className="ml-2 h-4 w-4" />
                Book Now
              </Button>

              <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
                <DialogContent className="sm:max-w-[425px] rtl">
                  <DialogHeader>
                    <DialogTitle> Book the tour</DialogTitle>
                  </DialogHeader>
                  <BookingForm
                    tourId={tour.id}
                    tourTitle={tour.title}
                    destination={tour.location}
                    price={tour.price}
                    onSuccess={() => {
                      setIsBookingOpen(false)
                      if (session.data?.user?.id) {
                        router.push(`/user/${session.data.user.id}`)
                      } else {
                        // Handle the case where user ID is not available, e.g., redirect to login or show an error
                        router.push('/login') // Example: redirect to login if ID is missing
                      }
                    }}
                  />
                </DialogContent>
              </Dialog>
            </>
            <Link href="/contact">
              <Button variant="outline" className="w-full">Contact Us</Button>
            </Link>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 border-t pt-16">
          <TourReviews 
            tourId={tour.id} 
            currentUserId={session.data?.user?.id}
            className="max-w-4xl"
          />
        </div>
      </div>
    </div>
  )
}
