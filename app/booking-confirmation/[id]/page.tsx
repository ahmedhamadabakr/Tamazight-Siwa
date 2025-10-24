'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { CheckCircle, Calendar, Users, MapPin, Phone, Mail, Download, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { toast } from 'sonner'

interface BookingDetails {
  _id: string
  user: {
    name: string
    email: string
    phone?: string
  }
  tour: {
    _id: string
    title: string
    destination: string
    duration: number
    price: number
    startDate: string
    endDate: string
  }
  travelers: number
  specialRequests?: string
  totalAmount: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed'
  bookingReference: string
  createdAt: string
}

interface BookingConfirmationProps {
  params: {
    id: string
  }
}

export default function BookingConfirmation({ params }: BookingConfirmationProps) {
  const { id: bookingId } = params
  const { data: session, status } = useSession()
  const router = useRouter()
  const [booking, setBooking] = useState<BookingDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated' && bookingId) {
      fetchBookingDetails()
    }
  }, [status, bookingId])

  const fetchBookingDetails = async () => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch booking details')
      }

      if (data.success) {
        setBooking(data.data)
      } else {
        setError(data.message || 'Booking not found')
      }
    } catch (error) {
      console.error('Error fetching booking:', error)
      setError('Failed to fetch booking details')
    } finally {
      setLoading(false)
    }
  }

  const downloadConfirmation = async () => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/pdf`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `booking-confirmation-${booking?.bookingReference}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success('Booking confirmation downloaded successfully')
      } else {
        toast.error('Failed to download booking confirmation')
      }
    } catch (error) {
      console.error('Error downloading confirmation:', error)
      toast.error('Failed to download booking confirmation')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-50'
      case 'pending':
        return 'text-yellow-600 bg-yellow-50'
      case 'cancelled':
        return 'text-red-600 bg-red-50'
      case 'completed':
        return 'text-blue-600 bg-blue-50'
      default:
        return 'text-gray-600 bg-gray-50'
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking not found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => router.push('/tours')} variant="outline">
            <ArrowLeft className="ml-2 h-4 w-4" />
            Back to tours
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking confirmed successfully!</h1>
          <p className="text-gray-600">Booking reference: {booking.bookingReference}</p>
        </motion.div>

        {/* Booking Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden mb-6"
        >
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Booking details</h2>
          </div>

          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Tour Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Tour Information</h3>

                <div className="flex items-start space-x-3 space-x-reverse">
                  <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">{booking.tour.title}</p>
                    <p className="text-gray-600">{booking.tour.destination}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 space-x-reverse">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Tour Date</p>
                    <p className="text-gray-600">
                      {new Date(booking.tour.startDate).toLocaleDateString('ar-EG')} - {new Date(booking.tour.endDate).toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 space-x-reverse">
                  <Users className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Number of travelers</p>
                    <p className="text-gray-600">{booking.travelers} people</p>
                  </div>
                </div>

                {booking.specialRequests && (
                  <div>
                    <p className="font-medium text-gray-900 mb-1">Special Requests</p>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-md">{booking.specialRequests}</p>
                  </div>
                )}
              </div>

              {/* Customer Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Customer Information</h3>

                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{booking.user.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Name</p>
                    <p className="text-gray-600">{booking.user.name}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 space-x-reverse">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-gray-600">{booking.user.email}</p>
                  </div>
                </div>

                {booking.user.phone && (
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Phone Number</p>
                      <p className="text-gray-600">{booking.user.phone}</p>
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900"> Booking Status</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                      {getStatusText(booking.status)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">Payment Status</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.paymentStatus)}`}>
                      {getStatusText(booking.paymentStatus)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div className="mt-6 pt-6 border-t">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Price per person</span>
                  <span className="text-gray-900">{booking.tour.price.toLocaleString()}Dollar</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Number of travelers</span>
                  <span className="text-gray-900">{booking.travelers}</span>
                </div>
                <div className="flex items-center justify-between text-lg font-semibold border-t pt-2">
                  <span className="text-gray-900">Total amount</span>
                  <span className="text-blue-600">{booking.totalAmount.toLocaleString()} Dollar</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button onClick={downloadConfirmation} className="flex items-center">
            <Download className="ml-2 h-4 w-4" />
            Download Booking Confirmation
          </Button>

          <Button variant="outline" onClick={() => router.push('/tours')}>
            <ArrowLeft className="ml-2 h-4 w-4" />
            Browse More Tours
          </Button>

          <Button variant="outline" onClick={() => router.push(`/user/${(session?.user as any)?.id}`)}>
            View My Bookings
          </Button>
        </motion.div>

        {/* Important Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Important Notes</h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 ml-3 flex-shrink-0"></span>
              Booking confirmation will be sent to your email within 24 hours
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 ml-3 flex-shrink-0"></span>
              Please keep your booking number for reference
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 ml-3 flex-shrink-0"></span>
              In case of any questions, please contact us at the number: 966501234567+
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 ml-3 flex-shrink-0"></span>
              You can cancel the booking before 48 hours from the tour date
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  )
}