"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Star, MapPin, Calendar, Camera } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

const tours = [{
    id: 1,
    title: "Classic Siwa Discovery",
    duration: "3 Days / 2 Nights",
    groupSize: "2-8 people",
    price: "$299",
    rating: 4.9,
    reviews: 127,
    image: "/siwa-oasis-salt-lakes-sunset.jpg",
    highlights: ["Cleopatra's Bath", "Salt Lakes", "Shali Fortress", "Traditional Dinner"],
    description:
        "Perfect introduction to Siwa's natural wonders and ancient history. Visit iconic landmarks and experience authentic Siwan hospitality.",
    difficulty: "Easy",
    category: "Cultural",
},
{
    id: 2,
    title: "Desert Safari Adventure",
    duration: "4 Days / 3 Nights",
    groupSize: "4-12 people",
    price: "$449",
    rating: 4.8,
    reviews: 89,
    image: "/great-sand-sea-dunes-4x4-safari.jpg",
    highlights: ["Great Sand Sea", "Fossil Valley", "Hot Springs", "Stargazing"],
    description:
        "Thrilling 4x4 expedition into the Great Sand Sea with camping under the stars and fossil hunting adventures.",
    difficulty: "Moderate",
    category: "Adventure",
},
{
    id: 3,
    title: "Wellness & Relaxation Retreat",
    duration: "5 Days / 4 Nights",
    groupSize: "2-6 people",
    price: "$599",
    rating: 5.0,
    reviews: 45,
    image: "/siwa-hot-springs-natural-pools-wellness.jpg",
    highlights: ["Natural Hot Springs", "Spa Treatments", "Meditation Sessions", "Organic Meals"],
    description:
        "Rejuvenate your body and soul with natural hot springs, traditional treatments, and peaceful desert meditation.",
    difficulty: "Easy",
    category: "Wellness",
},
{
    id: 4,
    title: "Photography Expedition",
    duration: "6 Days / 5 Nights",
    groupSize: "3-8 people",
    price: "$749",
    rating: 4.9,
    reviews: 67,
    image: "/siwa-oasis-photography-golden-hour-palm-trees.jpg",
    highlights: ["Golden Hour Shoots", "Portrait Sessions", "Landscape Photography", "Post-Processing Workshop"],
    description:
        "Capture Siwa's stunning landscapes with professional guidance. Perfect for photographers of all levels.",
    difficulty: "Moderate",
    category: "Photography",
},
{
    id: 5,
    title: "Cultural Immersion Experience",
    duration: "7 Days / 6 Nights",
    groupSize: "2-10 people",
    price: "$899",
    rating: 4.8,
    reviews: 34,
    image: "/siwa-traditional-crafts-berber-culture.jpg",
    highlights: ["Traditional Crafts", "Language Lessons", "Family Homestay", "Cooking Classes"],
    description: "Deep dive into Siwan culture with homestays, traditional crafts, and authentic cultural exchanges.",
    difficulty: "Easy",
    category: "Cultural",
},
{
    id: 6,
    title: "Extreme Desert Challenge",
    duration: "8 Days / 7 Nights",
    groupSize: "4-8 people",
    price: "$1299",
    rating: 4.7,
    reviews: 23,
    image: "/extreme-desert-expedition-camping-sand-dunes.jpg",
    highlights: ["Multi-day Trekking", "Survival Skills", "Remote Camping", "Navigation Training"],
    description: "Ultimate desert adventure for experienced travelers. Push your limits in the vast Sahara wilderness.",
    difficulty: "Challenging",
    category: "Extreme",
},]

const categories = ["All", "Cultural", "Adventure", "Wellness", "Photography", "Extreme"]

export default function ToursContent() {
    const [activeCategory, setActiveCategory] = useState("All")

    const filteredTours =
        activeCategory === "All" ? tours : tours.filter((tour) => tour.category === activeCategory)

    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            {/* Hero Section */}
            <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30" />
                <Image
                    src="/siwa-oasis-tours-desert-adventure.jpg"
                    alt="Siwa tours and experiences"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="text-4xl md:text-6xl font-bold mb-6 text-balance"
                    >
                        Tours & Experiences
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl md:text-2xl text-balance"
                    >
                        Discover the magic of Siwa Oasis through our carefully crafted adventures
                    </motion.p>
                </div>
            </section>

            {/* Filter Section */}
            <section className="py-12 px-4 bg-muted/30">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-wrap gap-4 justify-center">
                        {categories.map((category) => (
                            <Button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                variant={activeCategory === category ? "default" : "outline"}
                                className="rounded-full transition"
                            >
                                {category}
                            </Button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tours Grid */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        layout
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {filteredTours.map((tour) => (
                            <motion.div
                                key={tour.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true }}
                            >
                                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition group">
                                    <div className="relative h-48">
                                        <Image
                                            src={tour.image || "/placeholder.svg"}
                                            alt={tour.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <Badge variant="secondary" className="bg-background/90 text-foreground">
                                                {tour.category}
                                            </Badge>
                                        </div>
                                        <div className="absolute top-4 right-4">
                                            <Badge
                                                variant={
                                                    tour.difficulty === "Easy"
                                                        ? "default"
                                                        : tour.difficulty === "Moderate"
                                                            ? "secondary"
                                                            : "destructive"
                                                }
                                                className="bg-background/90"
                                            >
                                                {tour.difficulty}
                                            </Badge>
                                        </div>
                                    </div>

                                    <CardHeader>
                                        <div className="flex justify-between items-start mb-2">
                                            <CardTitle className="text-xl">{tour.title}</CardTitle>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-primary">{tour.price}</div>
                                                <div className="text-sm text-muted-foreground">per person</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {tour.duration}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Users className="w-4 h-4" />
                                                {tour.groupSize}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                <span className="font-semibold">{tour.rating}</span>
                                            </div>
                                            <span className="text-sm text-muted-foreground">({tour.reviews} reviews)</span>
                                        </div>
                                    </CardHeader>

                                    <CardContent>
                                        <p className="text-muted-foreground mb-4 leading-relaxed">
                                            {tour.description}
                                        </p>

                                        <div className="mb-6">
                                            <h4 className="font-semibold mb-2">Highlights:</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {tour.highlights.map((highlight, index) => (
                                                    <Badge key={index} variant="outline" className="text-xs">
                                                        {highlight}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button className="flex-1 bg-primary hover:bg-primary/90">Book Now</Button>
                                            <Button variant="outline" className="flex-1 bg-transparent">
                                                Learn More
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Custom Tours CTA */}
            <section className="py-20 bg-muted/30">
                <div className="max-w-4xl mx-auto text-center px-4">
                    <div className="mb-8">
                        <Calendar className="w-16 h-16 text-primary mx-auto mb-6" />
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Need a Custom Experience?
                        </h2>
                        <p className="text-xl text-muted-foreground mb-8">
                            We specialize in creating personalized adventures tailored to your interests, schedule, and group size.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        <div className="text-center">
                            <MapPin className="w-8 h-8 text-primary mx-auto mb-4" />
                            <h3 className="font-semibold mb-2">Flexible Itineraries</h3>
                            <p className="text-sm text-muted-foreground">Customize your route and activities</p>
                        </div>
                        <div className="text-center">
                            <Users className="w-8 h-8 text-primary mx-auto mb-4" />
                            <h3 className="font-semibold mb-2">Private Groups</h3>
                            <p className="text-sm text-muted-foreground">Exclusive experiences for your party</p>
                        </div>
                        <div className="text-center">
                            <Camera className="w-8 h-8 text-primary mx-auto mb-4" />
                            <h3 className="font-semibold mb-2">Special Interests</h3>
                            <p className="text-sm text-muted-foreground">Photography, wellness, adventure, culture</p>
                        </div>
                    </div>

                    <Button size="lg" className="bg-primary hover:bg-primary/90">
                        Plan My Custom Tour
                    </Button>
                </div>
            </section>

            <Footer />
        </div>
    )
}
