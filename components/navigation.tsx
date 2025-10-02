"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Phone } from "lucide-react"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">TS</span>
            </div>
            <span className="font-bold text-xl text-foreground">Tamazight Siwa</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-foreground hover:text-primary transition-colors">
              About Us
            </Link>
            <Link href="/tours" className="text-foreground hover:text-primary transition-colors">
              Tours & Experiences
            </Link>
            <Link href="/gallery" className="text-foreground hover:text-primary transition-colors">
              Gallery
            </Link>
            <Link href="/contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </div>

          {/* Contact & Book Button */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="tel:+20123456789"
              className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition"
            >
              <Phone className="w-4 h-4" />
              <span>+20 123 456 789</span>
            </a>

            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Book Your Trip
            </Button>
          </div>


          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-foreground hover:bg-muted"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/about" className="text-foreground hover:text-primary transition-colors">
                About Us
              </Link>
              <Link href="/tours" className="text-foreground hover:text-primary transition-colors">
                Tours & Experiences
              </Link>
              <Link href="/gallery" className="text-foreground hover:text-primary transition-colors">
                Gallery
              </Link>
              <Link href="/contact" className="text-foreground hover:text-primary transition-colors">
                Contact
              </Link>
              <div className="pt-4 border-t border-border">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                  <Phone className="w-4 h-4" />
                  <span>+20 123 456 789</span>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Book Your Trip
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
