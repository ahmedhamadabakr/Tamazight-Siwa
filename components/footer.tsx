import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Image
                src="/brand-logo.webp"
                alt="Tamazight Siwa logo"
                width={32}
                height={32}
                className="rounded"
                loading="lazy"
              />
              <span className="font-bold text-xl">Tamazight Siwa</span>
            </div>
            <p className="text-background/80 text-pretty">
              Authentic eco-tourism experiences in the magical Siwa Oasis, connecting travelers with Egypt's most
              pristine desert paradise.
            </p>
            <div className="flex space-x-4">
              <Link href="https://www.facebook.com/tamazight.siwa/" aria-label="Follow us on Facebook" className="text-background/60 hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="https://www.instagram.com/tamazight_siwa/" aria-label="Follow us on Instagram" className="text-background/60 hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-background/80 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/tours" className="text-background/80 hover:text-primary transition-colors">
                  Tours & Experiences
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-background/80 hover:text-primary transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-background/80 hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Services</h4>
            <ul className="space-y-2">
              <li className="text-background/80">Desert Safari Tours</li>
              <li className="text-background/80">Cultural Heritage Tours</li>
              <li className="text-background/80">Eco-Lodge Accommodation</li>
              <li className="text-background/80">Transportation Services</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-primary" />
                <span className="text-background/80">+201552624123</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-background/80">tamazight.siwa@gmail.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-primary mt-1" />
                <span className="text-background/80">Siwa Oasis, Matrouh Governorate, Egypt</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 mt-12 pt-8 text-center">
          <p className="text-background/60">
            © 2025 Tamazight Siwa. All rights reserved. | Designed with passion for authentic desert experiences.
          </p>
        </div>
      </div>
    </footer>
  )
}
