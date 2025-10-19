"use client"

import { useState, useEffect } from 'react'
import { Star, Plus, MessageSquare } from 'lucide-react'
import { ReviewsList } from '@/components/reviews/ReviewsList'
import { ReviewStats } from '@/components/reviews/ReviewStats'
import { ReviewForm } from '@/components/reviews/ReviewForm'
import { Review, ReviewStats as ReviewStatsType, calculateReviewStats } from '@/models/Review'

interface TourReviewsProps {
  tourId: string
  currentUserId?: string
  className?: string
}

export function TourReviews({ tourId, currentUserId, className = '' }: TourReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStatsType | null>(null)
  const [loading, setLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [reviewEligibility, setReviewEligibility] = useState<{
    canReview: boolean
    reason: string
    message: string
    existingReview?: any
    bookingStatus?: string
  } | null>(null)

  // Check if user can review this tour
  const checkReviewEligibility = async () => {
    if (!currentUserId) {
      setReviewEligibility({
        canReview: false,
        reason: 'not_logged_in',
        message: 'يجب تسجيل الدخول لإضافة تقييم'
      })
      return
    }

    try {
      const response = await fetch(`/api/tours/${tourId}/can-review`)
      const data = await response.json()

      if (data.success) {
        setReviewEligibility(data.data)
      }
    } catch (error) {
      console.error('Error checking review eligibility:', error)
    }
  }

  // Fetch reviews and stats
  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/tours/${tourId}/reviews?includeStats=true`)
      const data = await response.json()

      if (data.success) {
        setReviews(data.data.reviews)
        setStats(data.data.stats)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
    checkReviewEligibility()
  }, [tourId, currentUserId])

  // Submit new review
  const handleSubmitReview = async (reviewData: {
    rating: number
    title: string
    comment: string
    images: string[]
  }) => {
    setSubmitting(true)
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tourId,
          ...reviewData
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setShowReviewForm(false)
        await fetchReviews() // Refresh reviews
        await checkReviewEligibility() // Refresh eligibility
        alert('تم إرسال التقييم بنجاح وسيتم مراجعته قريباً')
      } else {
        alert(data.message || 'فشل في إرسال التقييم')
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('حدث خطأ أثناء إرسال التقييم')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
          <div className="bg-gray-300 rounded-lg h-32 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-300 rounded-lg h-24"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <MessageSquare className="h-6 w-6" />
          تقييمات الرحلة
        </h2>
        
        {reviewEligibility?.canReview && !showReviewForm && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            إضافة تقييم
          </button>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <ReviewForm
          tourId={tourId}
          onSubmit={handleSubmitReview}
          onCancel={() => setShowReviewForm(false)}
          isSubmitting={submitting}
        />
      )}

      {/* Review Eligibility Messages */}
      {reviewEligibility && !reviewEligibility.canReview && !showReviewForm && (
        <div className={`border rounded-lg p-4 ${
          reviewEligibility.reason === 'not_logged_in' 
            ? 'bg-blue-50 border-blue-200' 
            : reviewEligibility.reason === 'already_reviewed'
            ? 'bg-green-50 border-green-200'
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex items-center gap-2">
            {reviewEligibility.reason === 'not_logged_in' && (
              <>
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <p className="text-blue-800">
                  <a href="/login" className="font-medium hover:underline">
                    سجل دخولك
                  </a>
                  {' '}لتتمكن من إضافة تقييم لهذه الرحلة
                </p>
              </>
            )}
            {reviewEligibility.reason === 'already_reviewed' && (
              <>
                <Star className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-green-800 font-medium">
                    شكراً لك! لقد قمت بتقييم هذه الرحلة من قبل
                  </p>
                  {reviewEligibility.existingReview && (
                    <p className="text-green-700 text-sm mt-1">
                      تقييمك: {reviewEligibility.existingReview.rating} نجوم - {reviewEligibility.existingReview.title}
                      {reviewEligibility.existingReview.status === 'pending' && ' (في انتظار المراجعة)'}
                    </p>
                  )}
                </div>
              </>
            )}
            {reviewEligibility.reason === 'no_booking' && (
              <>
                <MessageSquare className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-yellow-800 font-medium">
                    يجب حجز الرحلة أولاً لتتمكن من تقييمها
                  </p>
                  <p className="text-yellow-700 text-sm mt-1">
                    فقط المسافرون الذين حجزوا الرحلة يمكنهم إضافة تقييمات
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Booking Status Info */}
      {reviewEligibility?.canReview && reviewEligibility.bookingStatus && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-green-800 font-medium">
                {reviewEligibility.message}
              </p>
              <p className="text-green-700 text-sm mt-1">
                حالة الحجز: {reviewEligibility.bookingStatus === 'confirmed' ? 'مؤكد' : 'مكتمل'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Review Statistics */}
      {stats && (
        <ReviewStats stats={stats} />
      )}

      {/* Reviews List */}
      <ReviewsList
        tourId={tourId}
        currentUserId={currentUserId}
        initialReviews={reviews}
        showFilters={true}
      />
    </div>
  )
}