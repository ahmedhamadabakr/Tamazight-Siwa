"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Send, Loader2, CheckCircle } from "lucide-react"
import { toast } from "sonner"

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Please enter your name")
      return false
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      toast.error("Please enter a valid email address")
      return false
    }
    if (!formData.message.trim()) {
      toast.error("Please enter your message")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      
      if (res.ok && data.success) {
        toast.success(data.message || "Message sent successfully!")
        setFormData({ name: "", email: "", subject: "", message: "" })
        setIsSubmitted(true)
      } else {
        toast.error(data.error || "Failed to send message. Please try again.")
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("An error occurred. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <section
      id="contact"
      className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/10"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10 opacity-10 bg-grid-small-black/[0.05] dark:bg-grid-small-white/[0.1]"></div>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.1),transparent_70%)] dark:opacity-20"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block text-sm font-medium text-primary mb-3">Contact Me</span>
            <h2 className="font-montserrat font-bold text-3xl sm:text-4xl md:text-5xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
              Get In Touch
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              I'm always happy to connect — whether it's about a project, opportunity, or just a chat about technology and innovation.
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-primary to-accent mx-auto mt-6 rounded-full"></div>
          </div>

          {/* Contact Form */}
          <Card className="border border-border/50 bg-background/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
            <CardContent className="p-6 sm:p-8 md:p-10">
              <div className="text-center mb-8">
                <h3 className="font-montserrat font-bold text-2xl md:text-3xl text-foreground mb-2">
                  Send a Message
                </h3>
                <p className="text-muted-foreground text-sm">I'll get back to you as soon as possible</p>
              </div>

              {isSubmitted && (
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl flex items-center justify-center gap-3 text-green-600 dark:text-green-400">
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium">Your message has been sent successfully! I'll get back to you soon.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-1">
                    <label htmlFor="name" className="text-sm font-medium text-muted-foreground">
                      Name <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isSubmitting || isSubmitted}
                      required
                      className="h-12 px-4 py-3 rounded-xl border-border/50 focus-visible:ring-2 focus-visible:ring-primary/50 transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                      Email <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isSubmitting || isSubmitted}
                      required
                      className="h-12 px-4 py-3 rounded-xl border-border/50 focus-visible:ring-2 focus-visible:ring-primary/50 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="subject" className="text-sm font-medium text-muted-foreground">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="How can I help you?"
                    value={formData.subject}
                    onChange={handleChange}
                    disabled={isSubmitting || isSubmitted}
                    className="h-12 px-4 py-3 rounded-xl border-border/50 focus-visible:ring-2 focus-visible:ring-primary/50 transition-all duration-200"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="message" className="text-sm font-medium text-muted-foreground">
                    Message <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Hello! I'd like to discuss..."
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    disabled={isSubmitting || isSubmitted}
                    required
                    className="min-h-[120px] p-4 rounded-xl border-border/50 focus-visible:ring-2 focus-visible:ring-primary/50 transition-all duration-200 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 md:h-16 rounded-xl font-semibold text-base md:text-lg bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-md hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02] transition-all duration-300 transform-gpu"
                  disabled={isSubmitting || isSubmitted}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
