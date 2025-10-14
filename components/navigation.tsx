"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Session } from "next-auth"
import { Button } from "@/components/ui/button"
import { Menu, X, Phone, User, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session, status } = useSession()
  
  // Type assertion to ensure TypeScript recognizes the extended session type
  const typedSession = session as Session & {
    user: {
      id: string
      email: string
      name: string
      role: string
    }
  } | null

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

            {/* Auth Section */}
            {status === 'loading' ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            ) : session ? (
              <div className="flex items-center space-x-4">
                <Link 
                  href={`/dashboard/${typedSession?.user?.id}/user`}
                  className="flex items-center space-x-2 hover:underline"
                >
                  <User className="w-4 h-4" />
                  <span>{session.user?.name}</span>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 9l6 6 6-6"/>
                      </svg>
                      <span className="sr-only">Toggle user menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/${typedSession?.user?.id}/user`} className="w-full cursor-pointer">لوحة التحكم</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/user/${typedSession?.user?.id}/`} className="w-full cursor-pointer">الملف الشخصي</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                      <LogOut className="w-4 h-4 ml-2" />
                      تسجيل الخروج
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login">
                  <Button variant="ghost" className="text-foreground hover:text-primary">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Register
                  </Button>
                </Link>
              </div>
            )}
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

              {/* Mobile Auth Section */}
              {status === 'loading' ? (
                <div className="w-full h-10 bg-gray-200 rounded animate-pulse" />
              ) : session ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 p-2 bg-muted rounded">
                    <User className="w-4 h-4" />
                    <span className="text-sm">{session.user?.name}</span>
                  </div>
                  <Link href="/dashboard">
                    <Button variant="outline" className="w-full">
                      لوحة التحكم
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => signOut()}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    تسجيل الخروج
                  </Button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Link href="/login" className="flex-1">
                    <Button variant="outline" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register" className="flex-1">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      Register
                    </Button>
                  </Link>
                </div>
              )}

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
