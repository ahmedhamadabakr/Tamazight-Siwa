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
import { BookingForm } from '@/components/BookingForm'
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
  const session = useSession()
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
    price: string;
    featured: boolean;
    status: string;
    location: string;
    image: string;
  }



  useEffect(() => {
    fetchTour();
  }, [slug]);

  const fetchTour = async () => {
    try {
      setIsLoading(true);
      const apiUrl = `/api/tours/${slug}`;
      console.log('API URL:', apiUrl);
      
      const response = await fetch(apiUrl);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('API Response data:', data);
      
      if (data.success) {
        if (data.data) {
          console.log('Tour data found:', data.data);
          setTour(data.data);
        } else {
          console.error('API returned success but no data:', data);
          setTour(null);
        }
      } else {
        console.error('API returned error:', data.error || 'Unknown error');
        setTour(null);
      }
    } catch (error) {
      console.error('Error in fetchTour:', error);
      setTour(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // Add a proper loading state
  }

  if (!tour) {
    return <div>Tour not found</div>; // Handle case when tour is not found
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Image */}
      <section className="relative h-[50vh]">
        <Image src={tour.image} alt={tour.title} fill className="object-cover" />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white">{tour.title}</h1>
        </div>
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
                احجز الآن
              </Button>

              <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
                <DialogContent className="sm:max-w-[425px] rtl">
                  <DialogHeader>
                    <DialogTitle>حجز الرحلة</DialogTitle>
                  </DialogHeader>
                  <BookingForm
                    tourId={tour.id}
                    price={parseFloat(tour.price.replace(/[^0-9.]/g, ''))}
                    onSuccess={() => {
                      setIsBookingOpen(false)
                      router.push(`/user/${session?.data?.user?.id}`)
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
      </div>
    </div>
  )
}
