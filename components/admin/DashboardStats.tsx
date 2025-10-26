"use client"

import { TrendingUp, TrendingDown, Users, MapPin, DollarSign, Calendar } from 'lucide-react'

const stats = [
  {
    name: 'Total Bookings',
    value: '2,847',
    change: '+12.5%',
    changeType: 'increase',
    icon: Calendar,
    color: 'bg-blue-500',
  },
  {
    name: 'Active Tours',
    value: '24',
    change: '+2',
    changeType: 'increase',
    icon: MapPin,
    color: 'bg-green-500',
  },
  {
    name: 'Total Customers',
    value: '1,923',
    change: '+8.2%',
    changeType: 'increase',
    icon: Users,
    color: 'bg-purple-500',
  },
  {
    name: 'Monthly Revenue',
    value: '$45,231',
    change: '-2.1%',
    changeType: 'decrease',
    icon: DollarSign,
    color: 'bg-yellow-500',
  },
]

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex items-center">
            {stat.changeType === 'increase' ? (
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span
              className={`text-sm font-medium ${
                stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {stat.change}
            </span>
            <span className="text-sm text-gray-500 ml-1">from last month</span>
          </div>
        </div>
      ))}
    </div>
  )
}