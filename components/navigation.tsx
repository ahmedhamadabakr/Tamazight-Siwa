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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session, status } = useSession()

  const typedSession =
    (session as
      | (Session & {
          user: { id: string; email: string; name: string; role: string; image?: string | null }
        })
      | null) ?? null

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary via-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <span className="text-white font-bold text-lg">TS</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-gray-900 group-hover:text-primary transition-colors duration-300">Tamazight Siwa</span>
              <span className="text-xs text-gray-500 -mt-1">Authentic Experiences</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <div className="flex items-center space-x-1">
              <Link href="/" className="relative px-4 py-2 text-gray-700 hover:text-primary transition-all duration-300 rounded-lg hover:bg-gray-50 font-medium whitespace-nowrap">
                Home
              </Link>
              <Link href="/about" className="relative px-4 py-2 text-gray-700 hover:text-primary transition-all duration-300 rounded-lg hover:bg-gray-50 font-medium whitespace-nowrap">
                About Us
              </Link>
              <Link href="/tours" className="relative px-4 py-2 text-gray-700 hover:text-primary transition-all duration-300 rounded-lg hover:bg-gray-50 font-medium whitespace-nowrap">
                Tours & Experiences
              </Link>
              <Link href="/gallery" className="relative px-4 py-2 text-gray-700 hover:text-primary transition-all duration-300 rounded-lg hover:bg-gray-50 font-medium whitespace-nowrap">
                Gallery
              </Link>
              <Link href="/contact" className="relative px-4 py-2 text-gray-700 hover:text-primary transition-all duration-300 rounded-lg hover:bg-gray-50 font-medium whitespace-nowrap">
                Contact
              </Link>
            </div>

            {/* Auth Section */}
            {status === "loading" ? (
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
            ) : session ? (
              <div className="flex items-center space-x-3">
                <Link
                  href={`/user/${typedSession?.user?.id}`}
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors duration-300 p-2 rounded-lg hover:bg-gray-50"
                >
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user?.name || "User"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 text-primary" />
                    )}
                  </div>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                      <span className="sr-only">Toggle user menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/dashboard/${typedSession?.user?.id}/user`}
                        className="w-full cursor-pointer"
                      >
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/user/${typedSession?.user?.id}`}
                        className="w-full cursor-pointer"
                      >
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => signOut()}
                      className="cursor-pointer text-red-600 focus:text-red-600"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login">
                  <Button variant="ghost" className="text-gray-700 hover:text-primary hover:bg-gray-50">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all duration-300">
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
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-primary transition-all duration-300 px-3 py-2 rounded-lg hover:bg-gray-50 whitespace-nowrap"
            >
              <Phone className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium">+20 123 456 789</span>
            </a>

            <Button className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-md hover:shadow-lg transition-all duration-300 font-semibold px-6 whitespace-nowrap">
              Book Your Trip
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-primary transition-all duration-300"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-6 border-t border-gray-200 bg-white">
            <div className="flex flex-col space-y-2">
              <Link href="/" className="px-4 py-3 text-gray-700 hover:text-primary hover:bg-gray-50 transition-all duration-300 rounded-lg font-medium">
                Home
              </Link>
              <Link href="/about" className="px-4 py-3 text-gray-700 hover:text-primary hover:bg-gray-50 transition-all duration-300 rounded-lg font-medium">
                About Us
              </Link>
              <Link href="/tours" className="px-4 py-3 text-gray-700 hover:text-primary hover:bg-gray-50 transition-all duration-300 rounded-lg font-medium">
                Tours & Experiences
              </Link>
              <Link href="/gallery" className="px-4 py-3 text-gray-700 hover:text-primary hover:bg-gray-50 transition-all duration-300 rounded-lg font-medium">
                Gallery
              </Link>
              <Link href="/contact" className="px-4 py-3 text-gray-700 hover:text-primary hover:bg-gray-50 transition-all duration-300 rounded-lg font-medium">
                Contact
              </Link>

              {/* Mobile Auth Section */}
              {status === "loading" ? (
                <div className="px-4 py-3">
                  <div className="w-full h-10 bg-gray-200 rounded-lg animate-pulse" />
                </div>
              ) : session ? (
                <div className="px-4 space-y-3">
                  <Link
                    href={`/user/${typedSession?.user?.id}`}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
                      {session.user?.image ? (
                        <img
                          src={session.user.image}
                          alt={session.user?.name || "User"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-700">{session.user?.name}</div>
                      <div className="text-xs text-gray-500">View Profile</div>
                    </div>
                  </Link>
                  <Link href={`/dashboard/${typedSession?.user?.id}/user`}>
                    <Button variant="outline" className="w-full justify-start border-gray-300 hover:bg-gray-50">
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-600 border-red-300 hover:bg-red-50"
                    onClick={() => signOut()}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="px-4 space-y-3">
                  <Link href="/login" className="block">
                    <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-50">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register" className="block">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white shadow-md">
                      Register
                    </Button>
                  </Link>
                </div>
              )}

              <div className="px-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-4">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium">+20 123 456 789</span>
                </div>
                <Button className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-md font-semibold">
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
