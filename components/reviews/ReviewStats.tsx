"use client"

import { Star, Shield, TrendingUp } from 'lucide-react'
import { ReviewStats as ReviewStatsType } from '@/models/Review'

interface ReviewStatsProps {
  stats: ReviewStatsType
  className?: string
}

export function ReviewStats({ stats, className = '' }: ReviewStatsProps) {
  const { totalReviews, averageRating, ratingDistribution, verifiedReviews } = stats

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  const getPercentage = (count: number) => {
    return totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0
  }

  if (totalReviews === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 text-center ${className}`}>
        <Star className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد تقييمات بعد</h3>
        <p className="text-gray-600">كن أول من يقيم هذه الرحلة</p>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Overall Rating */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <span className="text-4xl font-bold text-gray-900 ml-2">
              {averageRating.toFixed(1)}
            </span>
            <div className="flex items-center">
              {renderStars(averageRating)}
            </div>
          </div>
          <p className="text-gray-600 mb-1">
            بناءً على {totalReviews} تقييم
          </p>
          <div className="flex items-center justify-center gap-1 text-sm text-green-600">
            <Shield className="h-4 w-4" />
            <span>جميع التقييمات من مسافرين مؤكدين</span>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = ratingDistribution[rating as keyof typeof ratingDistribution]
            const percentage = getPercentage(count)
            
            return (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-sm text-gray-600">{rating}</span>
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                </div>
                
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                
                <div className="flex items-center gap-2 w-16">
                  <span className="text-sm text-gray-600">{count}</span>
                  <span className="text-xs text-gray-500">({percentage}%)</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <TrendingUp className="h-5 w-5 text-blue-600 ml-1" />
            <span className="text-lg font-semibold text-gray-900">
              100%
            </span>
          </div>
          <p className="text-sm text-gray-600">تقييمات مؤكدة</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Star className="h-5 w-5 text-yellow-400 fill-current ml-1" />
            <span className="text-lg font-semibold text-gray-900">
              {ratingDistribution[5] + ratingDistribution[4]}
            </span>
          </div>
          <p className="text-sm text-gray-600">تقييمات إيجابية</p>
        </div>

        <div className="text-center md:col-span-1 col-span-2">
          <div className="flex items-center justify-center mb-1">
            <Shield className="h-5 w-5 text-green-600 ml-1" />
            <span className="text-lg font-semibold text-gray-900">
              {totalReviews > 0 ? Math.round(((ratingDistribution[5] + ratingDistribution[4]) / totalReviews) * 100) : 0}%
            </span>
          </div>
          <p className="text-sm text-gray-600">معدل الرضا</p>
        </div>
      </div>
    </div>
  )
}