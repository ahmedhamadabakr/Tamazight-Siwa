"use client"

import { useState, useEffect } from 'react'
import { Filter, SortAsc, SortDesc, Star, Shield, Loader2 } from 'lucide-react'
import { ReviewCard } from './ReviewCard'
import { Review } from '@/models/Review'

interface ReviewsListProps {
  tourId: string
  currentUserId?: string
  initialReviews?: Review[]
  showFilters?: boolean
}

interface Filters {
  rating: string
  sortBy: string
  sortOrder: string
}

export function ReviewsList({ 
  tourId, 
  currentUserId, 
  initialReviews = [],
  showFilters = true 
}: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [filters, setFilters] = useState<Filters>({
    rating: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })

  const fetchReviews = async (resetList = false) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: resetList ? '1' : page.toString(),
        limit: '10',
        ...filters
      })

      const response = await fetch(`/api/tours/${tourId}/reviews?${params}`)
      const data = await response.json()

      if (data.success) {
        if (resetList) {
          setReviews(data.data.reviews)
          setPage(1)
        } else {
          setReviews(prev => [...prev, ...data.data.reviews])
        }
        setHasMore(data.data.pagination.hasNext)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const handleHelpfulVote = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: 'POST'
      })

      if (response.ok) {
        // Update local state
        setReviews(prev => prev.map(review => 
          review._id === reviewId 
            ? { 
                ...review, 
                helpful: (review.helpful || 0) + (review.helpfulVotes?.includes(currentUserId!) ? -1 : 1),
                helpfulVotes: review.helpfulVotes?.includes(currentUserId!) 
                  ? review.helpfulVotes.filter(id => id !== currentUserId)
                  : [...(review.helpfulVotes || []), currentUserId!]
              }
            : review
        ))
      }
    } catch (error) {
      console.error('Error voting:', error)
    }
  }

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1)
    }
  }

  // Fetch reviews when filters change
  useEffect(() => {
    fetchReviews(true)
  }, [filters])

  // Fetch more reviews when page changes
  useEffect(() => {
    if (page > 1) {
      fetchReviews(false)
    }
  }, [page])

  return (
    <div className="space-y-6">
      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <h3 className="font-medium text-gray-900">تصفية التقييمات</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                التقييم
              </label>
              <select
                value={filters.rating}
                onChange={(e) => handleFilterChange('rating', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">جميع التقييمات</option>
                <option value="5">5 نجوم</option>
                <option value="4">4 نجوم</option>
                <option value="3">3 نجوم</option>
                <option value="2">نجمتان</option>
                <option value="1">نجمة واحدة</option>
              </select>
            </div>

            {/* Info about verified reviews */}
            <div className="flex items-center justify-center bg-green-50 border border-green-200 rounded-lg p-3">
              <Shield className="h-4 w-4 text-green-600 ml-2" />
              <span className="text-sm text-green-800 font-medium">
                جميع التقييمات من مسافرين حجزوا الرحلة فعلاً
              </span>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ترتيب حسب
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="createdAt">التاريخ</option>
                <option value="rating">التقييم</option>
                <option value="helpful">الأكثر إفادة</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الترتيب
              </label>
              <select
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="desc">تنازلي</option>
                <option value="asc">تصاعدي</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 && !loading ? (
          <div className="text-center py-12">
            <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              لا توجد تقييمات
            </h3>
            <p className="text-gray-600">
              {filters.rating || filters.verified 
                ? 'لا توجد تقييمات تطابق المرشحات المحددة'
                : 'لم يتم إضافة أي تقييمات لهذه الرحلة بعد'
              }
            </p>
          </div>
        ) : (
          <>
            {reviews.map((review) => (
              <ReviewCard
                key={review._id}
                review={review}
                onHelpfulVote={currentUserId ? handleHelpfulVote : undefined}
                currentUserId={currentUserId}
              />
            ))}

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center pt-6">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2 mx-auto"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      جاري التحميل...
                    </>
                  ) : (
                    'عرض المزيد'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}