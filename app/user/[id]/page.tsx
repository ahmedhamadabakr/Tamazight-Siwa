'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { User, Plane, LogOut } from 'lucide-react'
import { motion } from 'framer-motion'

interface User {
  _id: string
  fullName: string
  email: string
  phone: string
  role: string
  status: string
  createdAt: string
  updatedAt: string
}

interface Trip {
  _id: string
  destination: string
  startDate: string
  endDate: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  bookingDate: string
  price: number
}

interface UserDashboardProps {
  params: {
    id: string
  }
}

export default function UserDashboard({ params }: UserDashboardProps) {
  const { id: userId } = params
  const { data: session, status } = useSession()
  const router = useRouter()

  const [activeTab, setActiveTab] = useState<'profile' | 'trips'>('profile')
  const [user, setUser] = useState<User | null>(null)
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
  })

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    else if (status === 'authenticated' && userId) {
      fetchUserData(userId)
      fetchUserTrips(userId)
    }
  }, [status, userId])

  const fetchUserData = async (userId: string) => {
    try {
      const res = await fetch(`/api/users/${userId}`)
      const data = await res.json()
      if (data.success) {
        setUser(data.data)
        setFormData({
          fullName: data.data.fullName,
          email: data.data.email,
          phone: data.data.phone || '',
        })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserTrips = async (userId: string) => {
    try {
      const res = await fetch(`/api/bookings/user/${userId}`)
      const data = await res.json()
      if (data.success) setTrips(data.data || [])
    } catch (err) {
      console.error(err)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.success) {
        setUser(data.data)
        setEditMode(false)
        alert('تم تحديث البيانات بنجاح ✅')
      } else {
        alert('حدث خطأ أثناء تحديث البيانات ❌')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const cancelTrip = async (tripId: string) => {
    if (!confirm('هل أنت متأكد من إلغاء هذه الرحلة؟')) return
    try {
      const res = await fetch(`/api/bookings/${tripId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      })
      const data = await res.json()
      if (data.success) {
        fetchUserTrips(userId)
        alert('تم إلغاء الرحلة بنجاح ✅')
      } else alert('حدث خطأ أثناء إلغاء الحجز ❌')
    } catch (err) {
      console.error(err)
    }
  }

  const getStatusBadge = (status: string) => {
    const colorMap: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
    }

    const labelMap: Record<string, string> = {
      pending: 'قيد الانتظار',
      confirmed: 'مؤكد',
      completed: 'مكتمل',
      cancelled: 'ملغي',
    }

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${colorMap[status]}`}
      >
        {labelMap[status]}
      </span>
    )
  }

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    )

  if (!user)
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold text-gray-700">
          حدث خطأ في تحميل البيانات
        </h2>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
        >
          إعادة تحميل الصفحة
        </button>
      </div>
    )

  const getInitial = () => user?.fullName?.charAt(0).toUpperCase() || 'U'

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-white rounded-2xl shadow p-4 border border-gray-100">
          <div className="text-center mb-6">
            <div className="w-24 h-24 mx-auto bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-3xl font-semibold mb-3">
              {getInitial()}
            </div>
            <h3 className="font-semibold text-lg">{user.fullName}</h3>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center justify-end gap-2 w-full px-4 py-2 rounded-md text-sm font-medium transition ${
                activeTab === 'profile'
                  ? 'bg-blue-100 text-blue-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              الملف الشخصي <User size={16} />
            </button>

            <button
              onClick={() => setActiveTab('trips')}
              className={`flex items-center justify-end gap-2 w-full px-4 py-2 rounded-md text-sm font-medium transition ${
                activeTab === 'trips'
                  ? 'bg-blue-100 text-blue-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              رحلاتي <Plane size={16} />
            </button>

            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center justify-end gap-2 w-full px-4 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition"
            >
              تسجيل الخروج <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 bg-white rounded-2xl shadow p-6 border border-gray-100"
        >
          {activeTab === 'profile' && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  الملف الشخصي
                </h2>
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
                  >
                    تعديل
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSubmit}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm"
                    >
                      حفظ
                    </button>
                    <button
                      onClick={() => {
                        setEditMode(false)
                        setFormData({
                          fullName: user.fullName,
                          email: user.email,
                          phone: user.phone || '',
                        })
                      }}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md text-sm"
                    >
                      إلغاء
                    </button>
                  </div>
                )}
              </div>

              {editMode ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الاسم الكامل
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      رقم الهاتف
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">الاسم الكامل</p>
                    <p className="text-gray-800 font-medium">{user.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                    <p className="text-gray-800 font-medium">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">رقم الهاتف</p>
                    <p className="text-gray-800 font-medium">
                      {user.phone || 'غير مضبوط'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">تاريخ التسجيل</p>
                    <p className="text-gray-800 font-medium">
                      {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'trips' && (
            <>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                رحلاتي
              </h2>
              {trips.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500 mb-4">لا توجد رحلات بعد</p>
                  <button
                    onClick={() => router.push('/tours')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
                  >
                    تصفح الرحلات
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-100">
                  <table className="min-w-full text-sm text-right">
                    <thead className="bg-gray-100 text-gray-700">
                      <tr>
                        <th className="px-6 py-3">الوجهة</th>
                        <th className="px-6 py-3">تاريخ الحجز</th>
                        <th className="px-6 py-3">الفترة</th>
                        <th className="px-6 py-3">السعر</th>
                        <th className="px-6 py-3">الحالة</th>
                        <th className="px-6 py-3">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {trips.map((trip) => (
                        <tr
                          key={trip._id}
                          className={`hover:bg-gray-50 ${
                            trip.status === 'cancelled' ? 'bg-red-50/40' : ''
                          }`}
                        >
                          <td className="px-6 py-3">{trip.destination}</td>
                          <td className="px-6 py-3">
                            {new Date(trip.bookingDate).toLocaleDateString(
                              'ar-EG'
                            )}
                          </td>
                          <td className="px-6 py-3">
                            {new Date(trip.startDate).toLocaleDateString(
                              'ar-EG'
                            )}{' '}
                            -{' '}
                            {new Date(trip.endDate).toLocaleDateString('ar-EG')}
                          </td>
                          <td className="px-6 py-3">{trip.price} ج.م</td>
                          <td className="px-6 py-3">
                            {getStatusBadge(trip.status)}
                          </td>
                          <td className="px-6 py-3 text-sm">
                            {trip.status === 'pending' ||
                            trip.status === 'confirmed' ? (
                              <button
                                onClick={() => cancelTrip(trip._id)}
                                className="text-red-600 hover:text-red-900 mr-3"
                              >
                                إلغاء
                              </button>
                            ) : null}
                            <button
                              onClick={() =>
                                router.push(`/bookings/${trip._id}`)
                              }
                              className="text-blue-600 hover:text-blue-900"
                            >
                              التفاصيل
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}
