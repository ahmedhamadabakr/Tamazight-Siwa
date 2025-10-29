"use client"
import { ClientOnlyNavigation } from "@/components/ClientOnlyNavigation"
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
import { ContactSection } from "@/components/contact-section"
import Link from "next/link"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <ClientOnlyNavigation />

      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/siwa-oasis-sunset-salt-lakes-reflection.jpg"
          alt="Contact Tamazight Siwa"
          fill
          className="object-cover"
          priority
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
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

          <ContactSection />
          </motion.div>

          {/* Contact Info */}
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
            <p className="text-muted-foreground mb-8">
              We&apos;re available 24/7 to answer your questions and help you plan your Siwa adventure.
            </p>

            <div className="space-y-6">
              {[
                { icon: Phone, title: "Phone & WhatsApp", details: ["+20 155 262 4123"], },
                { icon: Mail, title: "Email", details: ["tamazight.siwa@gmail.com"], },
                { icon: MapPin, title: "Location", details: [" Siwa Oasis", "Matrouh, Egypt"] },
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
              { 
                name: "WhatsApp", 
                color: "bg-green-500", 
                icon: <MessageCircle className="w-8 h-8 text-white" />,
                url: "https://wa.me/+201552624123"
              },
              { 
                name: "Instagram", 
                color: "bg-gradient-to-r from-pink-500 to-purple-500", 
                icon: <span className="text-white font-bold text-xl">IG</span>,
                url: "https://instagram.com/YOUR_INSTAGRAM"
              },
              { 
                name: "Facebook", 
                color: "bg-blue-600", 
                icon: <span className="text-white font-bold text-xl">FB</span>,
                url: "https://facebook.com/YOUR_FACEBOOK_PAGE"
              },
            ].map((social, index) => (
              <Card key={social.name} className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <CardContent className="p-8 text-center h-full flex flex-col">
                  <div className={`w-16 h-16 ${social.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    {social.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-4">{social.name}</h3>
                  <Link
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-auto inline-block w-full"
                  >
                    <Button 
                      variant="outline" 
                      className="w-full bg-transparent hover:bg-foreground/5 transition-colors"
                    >
                      Connect on {social.name}
                    </Button>
                  </Link>
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
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4">Ready to Book Your Adventure?</h3>
              <p className="text-lg opacity-90 mb-6">Don&apos;t wait – Siwa&apos;s magic is calling your name!</p>
              <Link 
                href="/tours"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 hover:scale-105 transition-transform"
              >
                Start Planning Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
