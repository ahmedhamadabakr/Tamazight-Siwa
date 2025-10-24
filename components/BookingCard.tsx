'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Users, 
  MapPin, 
  CreditCard, 
  Eye, 
  X, 
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { toast } from 'sonner'

interface BookingCardProps {
  booking: {
    _id: string
    destination: string
    bookingDate: string
    startDate: string
    endDate: string
    price: number
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
    paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed' | 'on-demand'
    travelers: number
    bookingReference: string
  }
  onCancel?: (bookingId: string) => void
}

export function BookingCard({ booking, onCancel }: BookingCardProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-600" />
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-blue-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'completed':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed'
      case 'pending':
        return 'Pending'
      case 'cancelled':
        return 'Cancelled'
      case 'completed':
        return 'Completed'
      default:
        return status
    }
  }

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Paid'
      case 'pending':
        return 'Pending'
      case 'refunded':
        return 'Refunded'
      case 'failed':
        return 'Failed'
      default:
        return status
    }
  }

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this booking?')) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/bookings/${booking._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success('Booking cancelled successfully')
        if (onCancel) {
          onCancel(booking._id)
        }
      } else {
        toast.error('Failed to cancel booking')
      }
    } catch (error) {
      console.error('Cancel booking error:', error)
      toast.error('Failed to cancel booking')
    } finally {
      setIsLoading(false)
    }
  }

  const canCancel = booking.status === 'pending' || booking.status === 'confirmed'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow ${
        booking.status === 'cancelled' ? 'opacity-75' : ''
      }`}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{booking.destination}</h3>
              <p className="text-sm text-gray-500">Booking Reference: {booking.bookingReference}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 space-x-reverse">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
              {getStatusIcon(booking.status)}
              <span className="mr-1">{getStatusText(booking.status)}</span>
            </span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Booking Date: {new Date(booking.bookingDate).toLocaleDateString('ar-EG')}</span>
          </div>
          
          <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>{booking.travelers} People</span>
          </div>
          
          <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(booking.startDate).toLocaleDateString('ar-EG')} - {new Date(booking.endDate).toLocaleDateString('ar-EG')}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
            <CreditCard className="w-4 h-4" />
            <span>{getPaymentStatusText(booking.paymentStatus)}</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4 pt-4 border-t">
          <span className="text-sm text-gray-600">Total Amount</span>
          <span className="text-lg font-bold text-blue-600">{booking.price.toLocaleString()} Dollar</span>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3 space-x-reverse">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/booking-confirmation/${booking._id}`)}
            className="flex items-center"
          >
            <Eye className="w-4 h-4 ml-1" />
            View Details
          </Button>
          
          {canCancel && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={isLoading}
              className="flex items-center text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="w-4 h-4 ml-1" />
              {isLoading ? 'Canceling...' : 'Cancel Booking'}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  )
}