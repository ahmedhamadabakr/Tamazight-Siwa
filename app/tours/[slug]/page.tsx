"use client"

import { useParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Star } from "lucide-react"
import Link from "next/link"
import { tours } from "@/app/data/tours"   // ✅ نفس المصدر

export default function TourDetailsPage() {
  const { slug } = useParams()
  const tour = tours.find((t) => t.title.toLowerCase().replace(/\s+/g, "-") === slug)

  if (!tour) {
    return <div className="p-10 text-center text-red-500">Tour not found!</div>
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
            <div className="flex flex-wrap gap-2 mb-8">
              {tour.highlights.map((h, i) => (
                <Badge key={i} variant="outline">{h}</Badge>
              ))}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> {tour.duration}</div>
              <div className="flex items-center gap-1"><Users className="w-4 h-4" /> {tour.groupSize}</div>
              <div className="flex items-center gap-1"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />{tour.rating} ({tour.reviews})</div>
            </div>
          </div>

          <div className="w-full md:w-72 p-6 border rounded-lg shadow-md bg-card">
            <div className="text-3xl font-bold text-primary mb-2">{tour.price}</div>
            <p className="text-muted-foreground mb-6">per person</p>
            <Button className="w-full mb-3">Book Now</Button>
            <Link href="/contact">
              <Button variant="outline" className="w-full">Contact Us</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
