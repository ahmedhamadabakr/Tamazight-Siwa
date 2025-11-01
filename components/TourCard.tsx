"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, Users, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

interface Tour {
  _id?: string
  id?: string
  title: string
  slug?: string
  description: string
  duration: string
  groupSize?: string
  location: string
  price: number
  images: string[]
  category?: string
  featured?: boolean
}

interface TourCardProps {
  tour: Tour
  index?: number
}

export function TourCard({ tour, index = 0 }: TourCardProps) {
  const tourLink = `/tours/${tour.slug || tour._id || tour.id}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group h-full">
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={tour.images[0] || "/placeholder.svg"}
            alt={tour.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Image Count Badge */}
          {tour.images && tour.images.length > 1 && (
            <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
              {tour.images.length}
              Images
            </div>
          )}

          {/* Featured Badge */}
          {tour.featured && (
            <div className="absolute top-3 left-3 bg-primary text-white text-xs px-2 py-1 rounded-full">
              Featured
            </div>
          )}

          {/* Price Overlay */}
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-primary font-bold px-3 py-1 rounded-full">
            ${tour.price}
          </div>
        </div>

        {/* Content Section */}
        <CardHeader className="pb-3">
          <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors">
            {tour.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-0 flex flex-col h-full">
          {/* Description */}
          <p className="text-muted-foreground mb-4 line-clamp-3 flex-grow">
            {tour.description}
          </p>

          {/* Tour Details */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="w-4 h-4 mr-2 text-primary" />
              <span>{parseInt(tour.duration) > 1 ? `${tour.duration} days` : `${tour.duration} day`}</span>
            </div>

            {tour.groupSize && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="w-4 h-4 mr-2 text-primary" />
                <span>{tour.groupSize} {parseInt(tour.groupSize) > 1 ? 'People' : 'Person'}</span>
              </div>
            )}

            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mr-2 text-primary" />
              <span>{tour.location} {tour.location.split(',').length > 1 ? 'Locations' : 'Location'}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-auto">
            <Link href={tourLink} className="flex-1">
              <Button className="w-full bg-primary hover:bg-primary/90 transition-colors">
                Book Now
              </Button>
            </Link>
            <Link href={tourLink} className="flex-1">
              <Button variant="outline" className="w-full hover:bg-primary/10 transition-colors">
                Details
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}