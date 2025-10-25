'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function NavigationSkeleton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary via-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">TS</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-gray-900">Tamazight Siwa</span>
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
            </div>

            {/* Loading skeleton for auth buttons */}
            <div className="flex items-center space-x-3 ml-4">
              <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:bg-gray-100"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu skeleton */}
        {isOpen && (
          <div className="md:hidden py-2 space-y-2">
            <div className="px-2 space-y-1">
              <Link 
                href="/" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/about" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                About Us
              </Link>
              <Link 
                href="/tours" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                Tours & Experiences
              </Link>
              <Link 
                href="/gallery" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                Gallery
              </Link>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="px-2 space-y-2">
                <div className="w-full h-10 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-full h-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}