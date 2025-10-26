"use client"

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, MoreHorizontal } from 'lucide-react'

const bookings = [
  {
    id: 'BK-001',
    customer: 'Sarah Johnson',
    tour: '3-Day Desert Safari',
    date: '2024-02-15',
    status: 'confirmed',
    amount: '$299',
    avatar: 'SJ',
  },
  {
    id: 'BK-002',
    customer: 'Ahmed Hassan',
    tour: 'Cultural Heritage Tour',
    date: '2024-02-18',
    status: 'pending',
    amount: '$199',
    avatar: 'AH',
  },
  {
    id: 'BK-003',
    customer: 'Maria Garcia',
    tour: 'Springs & Oasis Tour',
    date: '2024-02-20',
    status: 'confirmed',
    amount: '$149',
    avatar: 'MG',
  },
  {
    id: 'BK-004',
    customer: 'John Smith',
    tour: 'Overnight Camping',
    date: '2024-02-22',
    status: 'cancelled',
    amount: '$249',
    avatar: 'JS',
  },
  {
    id: 'BK-005',
    customer: 'Lisa Chen',
    tour: 'Photography Tour',
    date: '2024-02-25',
    status: 'confirmed',
    amount: '$179',
    avatar: 'LC',
  },
]

const statusColors = {
  confirmed: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-red-100 text-red-800',
}

export function RecentBookings() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tour
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-medium text-primary">
                        {booking.avatar}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {booking.customer}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{booking.tour}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{booking.date}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge 
                    className={statusColors[booking.status as keyof typeof statusColors]}
                    variant="secondary"
                  >
                    {booking.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {booking.amount}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}