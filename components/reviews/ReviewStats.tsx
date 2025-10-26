'use client'

import { Star, Users, Shield } from 'lucide-react'
import { ReviewStats as ReviewStatsType } from '@/models/Review'
import Image from 'next/image'

interface ReviewStatsProps {
  stats: ReviewStatsType
}

export function ReviewStats({ stats }: ReviewStatsProps) {
  if (stats.totalReviews === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <div className="text-gray-400 mb-2">
          <Star className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
        <p className="text-gray-600">Be the first to review this tour!</p>
      </div>
    )
  }

  const getProgressWidth = (count: number) => {
    return stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Overall Rating */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-4xl font-bold text-gray-900">
              {stats.averageRating.toFixed(1)}
            </span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 ${
                    star <= Math.round(stats.averageRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <p className="text-gray-600 mb-4">
            Based on {stats.totalReviews} reviews
          </p>

          <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{stats.totalReviews} reviews</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              <span>{stats.verifiedReviews} verified</span>
            </div>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 mb-3">Rating Distribution</h4>
          
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-16">
                <span className="text-sm text-gray-600">{rating}</span>
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              </div>
              
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressWidth(stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution])}%` }}
                />
              </div>
              
              <span className="text-sm text-gray-600 w-8 text-left">
                {stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Reviews Preview */}
      {stats.recentReviews.length > 0 && (
        <div className="mt-8 pt-6 border-t">
          <h4 className="font-medium text-gray-900 mb-4">Recent Reviews</h4>
          <div className="space-y-4">
            {stats.recentReviews.slice(0, 3).map((review) => (
              <div key={review._id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-md">
                <div className="flex-shrink-0">
                  {review.userImage ? (
                    <Image
                      src={review.userImage}
                      alt={review.userName}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {review.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900 text-sm">
                      {review.userName}
                    </span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 ${
                            star <= review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    {review.verified && (
                      <Shield className="w-3 h-3 text-green-500" />
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 font-medium mb-1">
                    {review.title}
                  </p>
                  
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {review.comment}
                  </p>
                  
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(review.createdAt).toLocaleDateString('ar-EG')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}