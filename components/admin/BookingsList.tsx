'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  Users,
  Calendar,
  MapPin,
  CreditCard,
  Download
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from 'sonner'

interface Booking {
  _id: string
  user: {
    name: string
    email: string
    phone?: string
  }
  tour: {
    title: string
    destination: string
    startDate: string
    endDate: string
    price: number
  }
  travelers: number
  totalAmount: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed'
  bookingReference: string
  specialRequests?: string
  createdAt: string
}

interface BookingsListProps {
  limit?: number
  showFilters?: boolean
  title?: string
}

export function BookingsList({ limit, showFilters = true, title = "الحجوزات" }: BookingsListProps) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [paymentFilter, setPaymentFilter] = useState<string>('all')

  useEffect(() => {
    fetchBookings()
  }, [])

  useEffect(() => {
    filterBookings()
  }, [bookings, searchTerm, statusFilter, paymentFilter])

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/admin/bookings')
      const data = await response.json()

      if (data.success) {
        let bookingsData = data.data
        if (limit) {
          bookingsData = bookingsData.slice(0, limit)
        }
        setBookings(bookingsData)
      } else {
        toast.error('فشل في تحميل الحجوزات')
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
      toast.error('حدث خطأ في تحميل الحجوزات')
    } finally {
      setLoading(false)
    }
  }

  const filterBookings = () => {
    let filtered = bookings

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.bookingReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.tour.destination.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter)
    }

    // Payment filter
    if (paymentFilter !== 'all') {
      filtered = filtered.filter(booking => booking.paymentStatus === paymentFilter)
    }

    setFilteredBookings(filtered)
  }

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      const data = await response.json()

      if (data.success) {
        toast.success('تم تحديث حالة الحجز بنجاح')
        fetchBookings()
      } else {
        toast.error('فشل في تحديث حالة الحجز')
      }
    } catch (error) {
      console.error('Error updating booking status:', error)
      toast.error('حدث خطأ في تحديث حالة الحجز')
    }
  }

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
        return <Clock className="w-4 h-4 text-gray-600" />
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
        return 'مؤكد'
      case 'pending':
        return 'في الانتظار'
      case 'cancelled':
        return 'ملغي'
      case 'completed':
        return 'مكتمل'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {!limit && (
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 ml-2" />
              تصدير
            </Button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="px-6 py-4 border-b bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="البحث..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">جميع الحالات</option>
              <option value="pending">في الانتظار</option>
              <option value="confirmed">مؤكد</option>
              <option value="completed">مكتمل</option>
              <option value="cancelled">ملغي</option>
            </select>

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">جميع حالات الدفع</option>
              <option value="pending">في الانتظار</option>
              <option value="paid">مدفوع</option>
              <option value="refunded">مسترد</option>
              <option value="failed">فشل</option>
            </select>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                رقم الحجز
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                العميل
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الرحلة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الأفراد
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                المبلغ
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الحالة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBookings.map((booking) => (
              <motion.tr
                key={booking._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {booking.bookingReference}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(booking.createdAt).toLocaleDateString('ar-SA')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {booking.user.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {booking.user.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {booking.tour.title}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center">
                    <MapPin className="w-3 h-3 ml-1" />
                    {booking.tour.destination}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <Users className="w-4 h-4 ml-1" />
                    {booking.travelers}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {booking.totalAmount.toLocaleString()} ريال
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                    {getStatusIcon(booking.status)}
                    <span className="mr-1">{getStatusText(booking.status)}</span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/booking-confirmation/${booking._id}`, '_blank')}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    
                    {booking.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                        className="text-green-600 hover:text-green-700"
                      >
                        تأكيد
                      </Button>
                    )}
                    
                    {(booking.status === 'pending' || booking.status === 'confirmed') && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                        className="text-red-600 hover:text-red-700"
                      >
                        إلغاء
                      </Button>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredBookings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">لا توجد حجوزات تطابق المعايير المحددة</p>
        </div>
      )}
    </div>
  )
}