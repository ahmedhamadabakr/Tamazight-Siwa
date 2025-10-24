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
        throw new Error(data.message || 'فشل في تحميل تفاصيل الحجز')
      }

      if (data.success) {
        setBooking(data.data)
      } else {
        setError(data.message || 'لم يتم العثور على الحجز')
      }
    } catch (error) {
      console.error('Error fetching booking:', error)
      setError('حدث خطأ في تحميل تفاصيل الحجز')
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
        toast.success('تم تحميل تأكيد الحجز بنجاح')
      } else {
        toast.error('فشل في تحميل تأكيد الحجز')
      }
    } catch (error) {
      console.error('Error downloading confirmation:', error)
      toast.error('حدث خطأ في تحميل تأكيد الحجز')
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">خطأ في تحميل الحجز</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => router.push('/tours')} variant="outline">
            <ArrowLeft className="ml-2 h-4 w-4" />
            العودة للرحلات
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">تم تأكيد حجزك بنجاح!</h1>
          <p className="text-gray-600">رقم الحجز: {booking.bookingReference}</p>
        </motion.div>

        {/* Booking Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden mb-6"
        >
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">تفاصيل الحجز</h2>
          </div>

          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Tour Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">معلومات الرحلة</h3>

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
                    <p className="font-medium text-gray-900">تاريخ الرحلة</p>
                    <p className="text-gray-600">
                      {new Date(booking.tour.startDate).toLocaleDateString('ar-SA')} - {new Date(booking.tour.endDate).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 space-x-reverse">
                  <Users className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">عدد الأفراد</p>
                    <p className="text-gray-600">{booking.travelers} أشخاص</p>
                  </div>
                </div>

                {booking.specialRequests && (
                  <div>
                    <p className="font-medium text-gray-900 mb-1">الطلبات الخاصة</p>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-md">{booking.specialRequests}</p>
                  </div>
                )}
              </div>

              {/* Customer Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">معلومات العميل</h3>

                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{booking.user.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">الاسم</p>
                    <p className="text-gray-600">{booking.user.name}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 space-x-reverse">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">البريد الإلكتروني</p>
                    <p className="text-gray-600">{booking.user.email}</p>
                  </div>
                </div>

                {booking.user.phone && (
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">رقم الهاتف</p>
                      <p className="text-gray-600">{booking.user.phone}</p>
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">حالة الحجز</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                      {getStatusText(booking.status)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">حالة الدفع</span>
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
                  <span className="text-gray-600">سعر الفرد الواحد</span>
                  <span className="text-gray-900">{booking.tour.price.toLocaleString()} ريال</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">عدد الأفراد</span>
                  <span className="text-gray-900">{booking.travelers}</span>
                </div>
                <div className="flex items-center justify-between text-lg font-semibold border-t pt-2">
                  <span className="text-gray-900">المجموع الكلي</span>
                  <span className="text-blue-600">{booking.totalAmount.toLocaleString()} ريال</span>
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
            تحميل تأكيد الحجز
          </Button>

          <Button variant="outline" onClick={() => router.push('/tours')}>
            <ArrowLeft className="ml-2 h-4 w-4" />
            تصفح المزيد من الرحلات
          </Button>

          <Button variant="outline" onClick={() => router.push(`/user/${(session?.user as any)?.id}`)}>
            عرض حجوزاتي
          </Button>
        </motion.div>

        {/* Important Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-blue-900 mb-3">ملاحظات مهمة</h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 ml-3 flex-shrink-0"></span>
              سيتم إرسال تأكيد الحجز إلى بريدك الإلكتروني خلال 24 ساعة
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 ml-3 flex-shrink-0"></span>
              يرجى الاحتفاظ برقم الحجز للمراجعة
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 ml-3 flex-shrink-0"></span>
              في حالة وجود أي استفسارات، يرجى التواصل معنا على الرقم: 966501234567+
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 ml-3 flex-shrink-0"></span>
              يمكن إلغاء الحجز قبل 48 ساعة من موعد الرحلة
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  )
}