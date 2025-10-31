"use client"

import { useState, useEffect } from 'react'
import { 
  Star, 
  MessageSquare, 
  Shield, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Search,
  Reply,
  Trash2
} from 'lucide-react'
import { Review } from '@/models/Review'
import Image from 'next/image'

interface ReviewsManagerProps {
  className?: string
}

interface ReviewStats {
  total: number
  pending: number
  approved: number
  rejected: number
  averageRating: number
}

export default function ReviewsManager({ className = '' }: ReviewsManagerProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    averageRating: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [showResponseModal, setShowResponseModal] = useState(false)
  const [adminResponse, setAdminResponse] = useState('')

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (statusFilter) params.append('status', statusFilter)
      else params.append('admin', 'true') // Get all reviews for admin

      console.log('Fetching reviews with params:', params.toString())
      const response = await fetch(`/api/reviews?${params.toString()}`)
      const data = await response.json()

      console.log('Reviews API response:', data)

      if (data.success) {
        setReviews(data.data.reviews)
        calculateStats(data.data.reviews)
        console.log('Reviews loaded:', data.data.reviews.length)
      } else {
        console.error('API Error:', data.message)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate statistics
  const calculateStats = (reviewsList: Review[]) => {
    const stats: ReviewStats = {
      total: reviewsList.length,
      pending: reviewsList.filter(r => r.status === 'pending').length,
      approved: reviewsList.filter(r => r.status === 'approved').length,
      rejected: reviewsList.filter(r => r.status === 'rejected').length,
      averageRating: 0
    }

    if (reviewsList.length > 0) {
      const totalRating = reviewsList.reduce((sum, review) => sum + review.rating, 0)
      stats.averageRating = Math.round((totalRating / reviewsList.length) * 10) / 10
    }

    setStats(stats)
  }

  useEffect(() => {
    fetchReviews()
  }, [searchTerm, statusFilter])

  // Update review status
  const updateReviewStatus = async (reviewId: string, status: string) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      const data = await response.json()
      if (data.success) {
        await fetchReviews() // Refresh list
      } else {
        alert(data.message || 'failed to update review status')
      }
    } catch (error) {
      console.error('Error updating review status:', error)
      alert('failed to update review status')
    }
  }

  // Send admin response
  const sendAdminResponse = async () => {
    if (!selectedReview || !adminResponse.trim()) return

    try {
      const response = await fetch(`/api/reviews/${selectedReview._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminResponse: { message: adminResponse.trim() }
        }),
      })

      const data = await response.json()
      if (data.success) {
        setShowResponseModal(false)
        setAdminResponse('')
        setSelectedReview(null)
        await fetchReviews() // Refresh list
      } else {
        alert(data.message || 'failed to send admin response')
      }
    } catch (error) {
      console.error('Error sending admin response:', error)
      alert('failed to send admin response')
    }
  }

  // Delete review
  const deleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return

    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      if (data.success) {
        await fetchReviews() // Refresh list
      } else {
        alert(data.message || 'failed to delete review')
      }
    } catch (error) {
      console.error('Error deleting review:', error)
      alert('failed to delete review')
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approved'
      case 'rejected':
        return 'Rejected'
      default:
        return 'Pending'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Reviews Manager</h1>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <div className="flex items-center space-x-3">
            <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xl sm:text-2xl font-semibold text-gray-900">{stats.total}</p>
              <p className="text-sm sm:text-base text-gray-600 truncate">Total Reviews</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <div className="flex items-center space-x-3">
            <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xl sm:text-2xl font-semibold text-gray-900">{stats.pending}</p>
              <p className="text-sm sm:text-base text-gray-600 truncate">Pending</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xl sm:text-2xl font-semibold text-gray-900">{stats.approved}</p>
              <p className="text-sm sm:text-base text-gray-600 truncate">Approved</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <div className="flex items-center space-x-3">
            <XCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xl sm:text-2xl font-semibold text-gray-900">{stats.rejected}</p>
              <p className="text-sm sm:text-base text-gray-600 truncate">Rejected</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <div className="flex items-center space-x-3">
            <Star className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xl sm:text-2xl font-semibold text-gray-900">{stats.averageRating.toFixed(1)}</p>
              <p className="text-sm sm:text-base text-gray-600 truncate">Average Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow animate-pulse p-6">
              <div className="flex items-center space-x-4 space-x-reverse mb-4">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter
              ? 'No reviews found matching the selected filters'
              : 'No reviews added yet'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            return (
              <div key={review._id} className="bg-white rounded-lg shadow p-4 sm:p-6">
                {/* Review Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-3">
                  <div className="flex items-center space-x-3">
                    {review.userImage ? (
                      <Image
                        src={review.userImage}
                        alt={review.userName}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-medium">
                          {review.userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900">{review.userName}</h4>
                        {review.verified && (
                          <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                            <Shield className="h-3 w-3" />
                            <span>Verified</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{new Date(review.createdAt).toLocaleDateString('en-US')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${getStatusColor(review.status)}`}>
                      {getStatusIcon(review.status)}
                      {getStatusText(review.status)}
                    </span>
                  </div>
                </div>

                {/* Rating and Title */}
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm text-gray-600">({review.rating}/5)</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">{review.title}</h3>
                </div>

                {/* Comment */}
                <p className="text-gray-700 mb-4">{review.comment}</p>

                {/* Review Images */}
                {review.images && review.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                    {review.images.slice(0, 3).map((image, index) => (
                      <Image
                        key={index}
                        src={image}
                        alt={`Review image ${index + 1}`}
                        width={100}
                        height={80}
                        className="rounded"
                        />
                    ))}
                  </div>
                )}

                {/* Admin Response */}
                {review.adminResponse && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">A</span>
                      </div>
                      <span className="font-medium text-blue-900">Admin Response</span>
                    </div>
                    <p className="text-blue-800">{review.adminResponse.message}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  {review.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateReviewStatus(review._id!, 'approved')}
                        className="bg-green-600 text-white px-3 py-1 text-sm rounded hover:bg-green-700 flex items-center gap-1"
                      >
                        <CheckCircle className="h-3 w-3" />
                        Approve
                      </button>
                      <button
                        onClick={() => updateReviewStatus(review._id!, 'rejected')}
                        className="bg-red-600 text-white px-3 py-1 text-sm rounded hover:bg-red-700 flex items-center gap-1"
                      >
                        <XCircle className="h-3 w-3" />
                        Reject
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => {
                      setSelectedReview(review)
                      setShowResponseModal(true)
                    } }
                    className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700 flex items-center gap-1"
                  >
                    <Reply className="h-3 w-3" />
                    Reply
                  </button>

                  <button
                    onClick={() => deleteReview(review._id!)}
                    className="bg-red-600 text-white px-3 py-1 text-sm rounded hover:bg-red-700 flex items-center gap-1"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Admin Response Modal */}
      {showResponseModal && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base sm:text-lg font-semibold mb-4">Admin Response</h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              Reply to review: {selectedReview.title}
            </p>
            <textarea
              value={adminResponse}
              onChange={(e) => setAdminResponse(e.target.value)}
              placeholder="Write admin response here..."
              rows={4}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button
                onClick={() => {
                  setShowResponseModal(false)
                  setAdminResponse('')
                  setSelectedReview(null)
                }}
                className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={sendAdminResponse}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm sm:text-base"
              >
                Send Response
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}