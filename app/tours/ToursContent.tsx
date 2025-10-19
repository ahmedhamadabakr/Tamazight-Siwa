"use client"

import { useState, useEffect } from "react"
import React from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Tour } from "@/types/tour"
import { TourCard } from "@/components/TourCard"
const categories = ["All", "Cultural", "Adventure", "Wellness", "Photography", "Extreme"]

export default function ToursContent() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [tour, setTour] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTour = async () => {
    try {
      const params = new URLSearchParams();
      if (activeCategory !== "All") params.append('category', activeCategory as string);

      const response = await fetch(`/api/tours?${params.toString()}`);
      const data = await response.json();
      if (data.success) {
        setTour(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching tours:', error);
    } finally {
      setLoading(false);
    }
  };

  // استدعاء fetchTour عند تحميل الكومبوننت
  React.useEffect(() => {
    fetchTour();
  }, [activeCategory]);

  if (!tour) {
    return <div className="p-10 text-center text-red-500">Tour not found!</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Tours Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                onClick={() => setActiveCategory(category)}
                className="transition-all duration-300"
              >
                {category === "All" ? "All" : category}
              </Button>
            ))}
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-6 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded mb-4"></div>
                  <div className="bg-gray-200 h-10 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            /* Tours Grid */
            <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tour?.map((tourItem, index) => (
                <TourCard key={tourItem._id} tour={tourItem} index={index} />
              ))}
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && tour?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No tours available in this category</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
