'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { User, Plane, LogOut } from 'lucide-react'
import { motion } from 'framer-motion'
import { BookingCard } from '@/components/BookingCard'

interface User {
  _id: string
  name: string
  email: string
  phone?: string
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
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed' | 'on-demand'
  bookingDate: string
  price: number
  travelers: number
  bookingReference: string
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
    name: '',
    email: '',
    phone: '',
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated' && userId) {
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
          name: data.data.name,
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
      if (data.success) {
        setTrips(data.data || [])
      }
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
      // Create a copy of formData without the email field
      const { email, ...updateData } = formData;

      const res = await fetch(`/api/users/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(session as any)?.accessToken}`
        },
        body: JSON.stringify(updateData), // Only send name and phone
      })

      const data = await res.json()

      if (data.success) {
        setUser(prev => {
          if (!prev) return null; // Handle the case where prev is null
          return {
            ...prev,
            ...updateData,
            email: prev.email // email is guaranteed to exist if prev is not null
          };
        });
        setEditMode(false)
        router.refresh()
        alert('Profile updated successfully ')
      } else {
        alert(`Error updating profile : ${data.message || 'Error updating profile'}`)
      }
    } catch (err) {
      alert('Error updating profile. Please try again later.')
    }
  }

  const cancelTrip = async (tripId: string) => {
    if (!confirm('Are you sure you want to cancel this trip?')) return
    try {
      const res = await fetch(`/api/bookings/${tripId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      })
      const data = await res.json()
      if (data.success) {
        fetchUserTrips(userId)
        alert('Trip cancelled successfully ✅')
      } else {
        alert('Error cancelling the trip ❌')
      }
    } catch (err) {
      alert('Error cancelling the trip. Please try again later.')
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
      pending: 'Pending',
      confirmed: 'Confirmed',
      completed: 'Completed',
      cancelled: 'Cancelled',
    }
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${colorMap[status]}`}
      >
        {labelMap[status]}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold text-gray-700">
          Error loading data
        </h2>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
        >
          Reload Page
        </button>
      </div>
    )
  }

  const getInitial = () => user?.name?.charAt(0)?.toUpperCase() || ''


  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-white rounded-2xl shadow border border-gray-200 p-5">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-3xl font-semibold mb-3">
              {getInitial()}
            </div>
            <h3 className="font-semibold text-lg text-gray-800">{user.name}</h3>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center justify-start gap-2 w-full px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'profile'
                  ? 'bg-blue-100 text-blue-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
            >
              <User size={18} /> Profile
            </button>
            <button
              onClick={() => setActiveTab('trips')}
              className={`flex items-center justify-start gap-2 w-full px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'trips'
                  ? 'bg-blue-100 text-blue-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
            >
              <Plane size={18} /> My Trips
            </button>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center justify-start gap-2 w-full px-4 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 bg-white rounded-2xl shadow border border-gray-200 p-6"
        >

          {activeTab === 'trips' && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">My Trips</h2>
                <div className="text-sm text-gray-500">
                  Total Trips: {trips.length}
                </div>
              </div>

              {trips.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Plane className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No trips found</h3>
                  <p className="text-gray-500 mb-6">Start your next trip with us and explore amazing destinations</p>
                  <button
                    onClick={() => router.push('/tours')}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Browse available tours
                  </button>
                </div>
              ) : (
                <>
                  {/* Stats Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-600">
                        {trips.filter(t => t.status === 'confirmed').length}
                      </div>
                      <div className="text-sm text-green-700">Confirmed</div>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="text-2xl font-bold text-yellow-600">
                        {trips.filter(t => t.status === 'pending').length}
                      </div>
                      <div className="text-sm text-yellow-700">Pending</div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="text-2xl font-bold text-blue-600">
                        {trips.filter(t => t.status === 'completed').length}
                      </div>
                      <div className="text-sm text-blue-700">Completed</div>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="text-2xl font-bold text-red-600">
                        {trips.filter(t => t.status === 'cancelled').length}
                      </div>
                      <div className="text-sm text-red-700">Cancelled</div>
                    </div>
                  </div>

                  {/* Bookings List */}
                  <div className="space-y-4">
                    {trips.map((trip) => (
                      <BookingCard
                        key={trip._id}
                        booking={trip}
                        onCancel={() => fetchUserTrips(userId)}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
          {activeTab === 'profile' && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Profile</h2>
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
                  >
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSubmit}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditMode(false)
                        setFormData({
                          name: user.name,
                          email: user.email,
                          phone: user.phone || '',
                        })
                      }}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {editMode ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
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
                      Phone
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
                <div className="space-y-5">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="text-gray-800 font-medium">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-800 font-medium">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-800 font-medium">
                      {user.phone || 'Not set'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Joined On</p>
                    <p className="text-gray-800 font-medium">
                      {new Date(user.createdAt).toLocaleDateString('en-US')}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

        </motion.div>
      </div>
    </div>
  )
}
