"use client"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/siwa-oasis-sunset-salt-lakes-reflection.jpg"
          alt="Contact Tamazight Siwa"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white max-w-4xl mx-auto px-4"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl md:text-2xl opacity-90">
            Ready to start your Siwa adventure? We&apos;re here to help plan your perfect journey
          </p>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>
            <p className="text-muted-foreground mb-8">
              Tell us about your dream Siwa experience and we&apos;ll create the perfect itinerary for you.
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
                    <Input id="phone" type="tel" placeholder="+20 123 456 789" className="mt-2" />
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
                      placeholder="Tell us about your interests, preferred activities, etc."
                      className="mt-2 min-h-[120px]"
                    />
                  </div>
                  <Button size="lg" className="w-full bg-primary hover:scale-105 transition-transform">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
            <p className="text-muted-foreground mb-8">
              We&apos;re available 24/7 to answer your questions and help you plan your Siwa adventure.
            </p>

            <div className="space-y-6">
              {[
                { icon: Phone, title: "Phone & WhatsApp", details: ["+20 123 456 789", "+20 987 654 321"] },
                { icon: Mail, title: "Email", details: ["info@tamazightsiwa.com", "bookings@tamazightsiwa.com"] },
                { icon: MapPin, title: "Location", details: ["Shali Village, Siwa Oasis", "Matrouh, Egypt"] },
                { icon: Clock, title: "Office Hours", details: ["Daily: 8:00 AM - 10:00 PM", "Emergency: 24/7"] },
              ].map((item, i) => (
                <Card key={i} className="border-0 shadow-lg hover:shadow-xl transition-all">
                  <CardContent className="p-6 flex gap-4 items-start">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                      {item.details.map((d, j) => (
                        <p key={j} className="text-muted-foreground">{d}</p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">Quick answers to common questions about visiting Siwa</p>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="q1">
              <AccordionTrigger>What&apos;s the best time to visit Siwa?</AccordionTrigger>
              <AccordionContent>October to April offers the most comfortable weather, 15-25°C. Summer can reach 45°C.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>How do I get to Siwa?</AccordionTrigger>
              <AccordionContent>Road from Cairo (8h) or Alexandria (5h). We can arrange comfortable transport.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>What should I pack?</AccordionTrigger>
              <AccordionContent>Light clothing, sun protection, walking shoes, warm layers for nights. Detailed list provided upon booking.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>Are tours family-friendly?</AccordionTrigger>
              <AccordionContent>Yes, we offer family-friendly activities for all ages, guided by experts.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Social Media & CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Connect With Us</h2>
          <p className="text-xl text-muted-foreground mb-12">Follow our journey and get instant updates</p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { name: "WhatsApp", color: "bg-green-500", icon: <MessageCircle className="w-8 h-8 text-white" /> },
              { name: "Instagram", color: "bg-gradient-to-r from-pink-500 to-purple-500", icon: <span className="text-white font-bold text-xl">IG</span> },
              { name: "Facebook", color: "bg-blue-600", icon: <span className="text-white font-bold text-xl">FB</span> },
            ].map((s, i) => (
              <Card key={i} className="border-0 shadow-lg hover:scale-105 transition-transform cursor-pointer">
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 ${s.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    {s.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{s.name}</h3>
                  <Button variant="outline" className="w-full bg-transparent">Connect</Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="relative bg-primary text-primary-foreground rounded-lg p-12 overflow-hidden">
            <Image
              src="/great-sand-sea-dunes-golden-hour.jpg"
              alt="Siwa Adventure"
              fill
              className="object-cover opacity-20"
            />
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4">Ready to Book Your Adventure?</h3>
              <p className="text-lg opacity-90 mb-6">Don&apos;t wait – Siwa&apos;s magic is calling your name!</p>
              <Button size="lg" variant="secondary" className="bg-background text-foreground hover:scale-105 transition-transform">
                Start Planning Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
