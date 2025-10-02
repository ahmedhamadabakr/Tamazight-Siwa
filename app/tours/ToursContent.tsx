"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Star } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import Link from "next/link"
import { tours } from "@/app/data/tours"   // ✅ استيراد الداتا من ملف واحد

const categories = ["All", "Cultural", "Adventure", "Wellness", "Photography", "Extreme"]

export default function ToursContent() {
  const [activeCategory, setActiveCategory] = useState("All")
  const filteredTours =
    activeCategory === "All" ? tours : tours.filter((tour) => tour.category === activeCategory)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* باقي الكود بتاع عرض الكروت زي ما هو */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTours.map((tour) => (
              <motion.div key={tour.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}>
                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition group">
                  <div className="relative h-48">
                    <Image src={tour.image} alt={tour.title} fill className="object-cover" />
                  </div>

                  <CardHeader>
                    <CardTitle className="text-xl">{tour.title}</CardTitle>
                    <div className="text-2xl font-bold text-primary">{tour.price}</div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-muted-foreground mb-4">{tour.description}</p>
                    <div className="flex gap-2">
                      <Link href={`/tours/${tour.title.toLowerCase().replace(/\s+/g, "-")}`} className="flex-1">
                        <Button className="w-full bg-primary">Book Now</Button>
                      </Link>
                      <Link href={`/tours/${tour.title.toLowerCase().replace(/\s+/g, "-")}`} className="flex-1">
                        <Button variant="outline" className="w-full">Learn More</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
