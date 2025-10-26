"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Settings, 
  BarChart3,
  MessageSquare,
  Image,
  FileText,
  Shield,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Tours', href: '/admin/tours', icon: MapPin },
  { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Revenue', href: '/admin/revenue', icon: DollarSign },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Gallery', href: '/admin/gallery', icon: Image },
  { name: 'Reviews', href: '/admin/reviews', icon: MessageSquare },
  { name: 'Content', href: '/admin/content', icon: FileText },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
  { name: 'Security', href: '/admin/security', icon: Shield },
]

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile backdrop */}
      <div className="lg:hidden fixed inset-0 z-40 bg-gray-600 bg-opacity-75" />
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          {!collapsed && (
            <Link href="/admin/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SW</span>
              </div>
              <span className="font-bold text-lg text-gray-900">Admin Panel</span>
            </Link>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
                title={collapsed ? item.name : undefined}
              >
                <item.icon
                  className={`flex-shrink-0 h-5 w-5 ${
                    collapsed ? 'mx-auto' : 'mr-3'
                  } ${
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {!collapsed && item.name}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              <p>Siwa With Us Admin</p>
              <p>v1.0.0</p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}