import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from "lucide-react"
import Image from "next/image"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30" />
        <Image
          src="/placeholder.svg?height=500&width=1200"
          alt="Contact Tamazight Siwa"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">Contact Us</h1>
          <p className="text-xl md:text-2xl text-balance">
            Ready to start your Siwa adventure? We're here to help plan your perfect journey
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Send Us a Message</h2>
              <p className="text-muted-foreground mb-8">
                Tell us about your dream Siwa experience and we'll create the perfect itinerary for you.
              </p>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="Your first name" className="mt-2" />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Your last name" className="mt-2" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="your@email.com" className="mt-2" />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" className="mt-2" />
                    </div>

                    <div>
                      <Label htmlFor="travelDates">Preferred Travel Dates</Label>
                      <Input id="travelDates" placeholder="e.g., March 15-22, 2024" className="mt-2" />
                    </div>

                    <div>
                      <Label htmlFor="groupSize">Group Size</Label>
                      <Input id="groupSize" placeholder="Number of travelers" className="mt-2" />
                    </div>

                    <div>
                      <Label htmlFor="interests">Interests & Preferences</Label>
                      <Textarea
                        id="interests"
                        placeholder="Tell us about your interests, preferred activities, accommodation preferences, dietary requirements, etc."
                        className="mt-2 min-h-[120px]"
                      />
                    </div>

                    <Button size="lg" className="w-full bg-primary hover:bg-primary/90">
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Get in Touch</h2>
              <p className="text-muted-foreground mb-8">
                We're available 24/7 to answer your questions and help you plan your Siwa adventure.
              </p>

              <div className="space-y-6">
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Phone & WhatsApp</h3>
                        <p className="text-muted-foreground mb-2">Available 24/7 for immediate assistance</p>
                        <p className="font-medium">+20 123 456 789</p>
                        <p className="font-medium">+20 987 654 321</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Email</h3>
                        <p className="text-muted-foreground mb-2">We'll respond within 2 hours</p>
                        <p className="font-medium">info@tamazightsiwa.com</p>
                        <p className="font-medium">bookings@tamazightsiwa.com</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Location</h3>
                        <p className="text-muted-foreground mb-2">Visit us in the heart of Siwa</p>
                        <p className="font-medium">Shali Village, Siwa Oasis</p>
                        <p className="font-medium">Matrouh Governorate, Egypt</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Office Hours</h3>
                        <p className="text-muted-foreground mb-2">Local Siwa time (GMT+2)</p>
                        <p className="font-medium">Daily: 8:00 AM - 10:00 PM</p>
                        <p className="text-sm text-muted-foreground">Emergency support available 24/7</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">Quick answers to common questions about visiting Siwa</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">What's the best time to visit Siwa?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  October to April offers the most comfortable weather, with temperatures ranging from 15-25°C. Summer
                  months can be very hot, reaching 45°C during the day.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">How do I get to Siwa?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Siwa is accessible by road from Cairo (560km, 8-hour drive) or Alexandria (300km, 5-hour drive). We
                  can arrange comfortable transportation as part of your package.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">What should I pack for Siwa?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Light, breathable clothing, sun protection, comfortable walking shoes, and warm layers for desert
                  nights. We'll provide a detailed packing list upon booking.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Are your tours suitable for families?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We offer family-friendly tours with activities suitable for all ages. Our guides are experienced in
                  accommodating families with children.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Media & Instant Contact */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Connect With Us</h2>
          <p className="text-xl text-muted-foreground mb-12">
            Follow our journey and get instant updates from Siwa Oasis
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">WhatsApp</h3>
                <p className="text-muted-foreground mb-4">Instant messaging and quick responses</p>
                <Button variant="outline" className="w-full bg-transparent">
                  Chat on WhatsApp
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">IG</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Instagram</h3>
                <p className="text-muted-foreground mb-4">Daily photos and stories from Siwa</p>
                <Button variant="outline" className="w-full bg-transparent">
                  @tamazight_siwa
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">FB</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Facebook</h3>
                <p className="text-muted-foreground mb-4">Community updates and travel tips</p>
                <Button variant="outline" className="w-full bg-transparent">
                  Follow Us
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="bg-primary text-primary-foreground rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">Ready to Book Your Adventure?</h3>
            <p className="text-lg opacity-90 mb-6">Don't wait - Siwa's magic is calling your name!</p>
            <Button size="lg" variant="secondary" className="bg-background text-foreground hover:bg-background/90">
              Start Planning Now
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
