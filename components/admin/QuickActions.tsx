"use client"

import { Plus, Users, MapPin, Calendar, MessageSquare, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const actions = [
  {
    name: 'Add New Tour',
    description: 'Create a new tour package',
    icon: Plus,
    href: '/admin/tours/new',
    color: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    name: 'Manage Bookings',
    description: 'View and manage bookings',
    icon: Calendar,
    href: '/admin/bookings',
    color: 'bg-green-500 hover:bg-green-600',
  },
  {
    name: 'Customer Support',
    description: 'Handle customer inquiries',
    icon: MessageSquare,
    href: '/admin/support',
    color: 'bg-purple-500 hover:bg-purple-600',
  },
  {
    name: 'User Management',
    description: 'Manage user accounts',
    icon: Users,
    href: '/admin/users',
    color: 'bg-orange-500 hover:bg-orange-600',
  },
  {
    name: 'Tour Locations',
    description: 'Manage tour destinations',
    icon: MapPin,
    href: '/admin/locations',
    color: 'bg-red-500 hover:bg-red-600',
  },
  {
    name: 'System Settings',
    description: 'Configure system settings',
    icon: Settings,
    href: '/admin/settings',
    color: 'bg-gray-500 hover:bg-gray-600',
  },
]

export function QuickActions() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4">
          {actions.map((action) => (
            <Link key={action.name} href={action.href}>
              <Button
                variant="outline"
                className="w-full h-auto p-4 justify-start hover:shadow-md transition-all"
              >
                <div className={`p-2 rounded-lg ${action.color} mr-4`}>
                  <action.icon className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">{action.name}</div>
                  <div className="text-sm text-gray-500">{action.description}</div>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}