"use client"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const testimonials = [
    {
        id: 1,
        name: "John Smith",
        location: "New York, USA",
        rating: 5,
        text: "An amazing and unforgettable experience in Siwa Oasis! The team is very professional and the service is excellent. I recommend everyone to visit Siwa with this outstanding team.",
        image: "/placeholder-user.jpg",
        tour: "Great Desert Journey"
    },
    {
        id: 2,
        name: "Emily Jones",
        location: "London, UK",
        rating: 5,
        text: "One of the most beautiful trips I've ever taken in my life. The natural scenery is breathtaking and the hospitality is wonderful. Thank you for this amazing experience.",
        image: "/placeholder-user.jpg",
        tour: "Natural Springs Tour"
    },
    {
        id: 3,
        name: "Michael Müller",
        location: "Berlin, Germany",
        rating: 5,
        text: "First-class professional service. Everything was perfectly organized, from transportation to accommodation and food. An experience worth repeating.",
        image: "/placeholder-user.jpg",
        tour: "Cultural Heritage Journey"
    },
    {
        id: 4,
        name: "Sophie Dubois",
        location: "Paris, France",
        rating: 5,
        text: "The best desert trip ever! The team is friendly and cooperative, and the activities are diverse and exciting. I highly recommend this unique experience.",
        image: "/placeholder-user.jpg",
        tour: "Sand Dunes Adventure"
    },
    {
        id: 5,
        name: "David Lee",
        location: "Sydney, Australia",
        rating: 5,
        text: "An exceptional experience by all standards. The traditional food is delicious and the accommodation is comfortable. Thank you for the beautiful memories.",
        image: "/placeholder-user.jpg",
        tour: "Traditional Food Experience"
    }
]

export function TestimonialsSection() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)

    useEffect(() => {
        if (isAutoPlaying) {
            const interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % testimonials.length)
            }, 5000)
            return () => clearInterval(interval)
        }
    }, [isAutoPlaying])

    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }

    const prevTestimonial = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    }

    const goToSlide = (index: number) => {
        setCurrentIndex(index)
    }

    return (
        <section className="py-20 bg-gradient-to-b from-muted/20 to-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="inline-block bg-yellow-500/10 rounded-full px-6 py-2 mb-4">
                        <span className="text-yellow-600 font-medium">⭐ Customer Reviews</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
                        What Our Visitors Say About Us
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                        Discover real experiences from previous visitors who lived unforgettable moments with us in Siwa Oasis
                    </p>
                </div>

                {/* Main Testimonial Display */}
                <div className="relative max-w-4xl mx-auto mb-12">
                    <Card className="bg-white/70 backdrop-blur-sm border-none shadow-2xl overflow-hidden">
                        <CardContent className="p-0">
                            <div className="relative">
                                {/* Background Pattern */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5"></div>

                                {/* Quote Icon */}
                                <div className="absolute top-6 right-6 text-primary/20">
                                    <Quote className="w-16 h-16" />
                                </div>

                                <div className="relative p-12">
                                    {/* Stars */}
                                    <div className="flex justify-center mb-6">
                                        {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                                            <Star key={i} className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                                        ))}
                                    </div>

                                    {/* Testimonial Text */}
                                    <blockquote className="text-xl md:text-2xl text-foreground text-center mb-8 leading-relaxed font-medium">
                                        "{testimonials[currentIndex].text}"
                                    </blockquote>

                                    {/* User Info */}
                                    <div className="flex items-center justify-center gap-4">
                                        <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-primary/20">
                                            <Image
                                                src={testimonials[currentIndex].image}
                                                alt={testimonials[currentIndex].name}
                                                width={64}
                                                height={64}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="text-center">
                                            <h3 className="font-bold text-foreground text-lg">
                                                {testimonials[currentIndex].name}
                                            </h3>
                                            <p className="text-muted-foreground text-sm">
                                                {testimonials[currentIndex].location}
                                            </p>
                                            <p className="text-primary text-sm font-medium">
                                                {testimonials[currentIndex].tour}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Navigation Buttons */}
                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm border-white/20 hover:bg-white/90 rounded-full w-12 h-12"
                        aria-label="Previous testimonial"
                        onClick={prevTestimonial}
                        onMouseEnter={() => setIsAutoPlaying(false)}
                        onMouseLeave={() => setIsAutoPlaying(true)}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm border-white/20 hover:bg-white/90 rounded-full w-12 h-12"
                        aria-label="Next testimonial"
                        onClick={nextTestimonial}
                        onMouseEnter={() => setIsAutoPlaying(false)}
                        onMouseLeave={() => setIsAutoPlaying(true)}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                </div>

                {/* Dots Indicator */}
                <div className="flex justify-center gap-2 mb-12">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-4 h-4 p-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary ${index === currentIndex
                                ? 'bg-primary w-8'
                                : 'bg-primary/30 hover:bg-primary/50'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                            aria-current={index === currentIndex ? 'true' : undefined}
                        />
                    ))}
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                    <div className="text-center bg-white/50 backdrop-blur-sm rounded-2xl p-6">
                        <div className="text-3xl font-bold text-primary mb-2">4.9/5</div>
                        <div className="text-muted-foreground">Average Rating</div>
                    </div>
                    <div className="text-center bg-white/50 backdrop-blur-sm rounded-2xl p-6">
                        <div className="text-3xl font-bold text-secondary mb-2">500+</div>
                        <div className="text-muted-foreground">Positive Reviews</div>
                    </div>
                    <div className="text-center bg-white/50 backdrop-blur-sm rounded-2xl p-6">
                        <div className="text-3xl font-bold text-accent mb-2">98%</div>
                        <div className="text-muted-foreground">Customer Satisfaction</div>
                    </div>
                </div>
            </div>
        </section>
    )
}