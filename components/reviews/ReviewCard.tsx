"use client"

import { useState } from 'react'
import { Star, ThumbsUp, Shield, Calendar, MoreHorizontal } from 'lucide-react'
import { CloudinaryImage } from '@/components/CloudinaryImage'
import { Review } from '@/models/Review'

interface ReviewCardProps {
  review: Review
  onHelpfulVote?: (reviewId: string) => void
  showActions?: boolean
  currentUserId?: string
}

export function ReviewCard({ 
  review, 
  onHelpfulVote, 
  showActions = true,
  currentUserId 
}: ReviewCardProps) {
  const [isVoting, setIsVoting] = useState(false)
  const [hasVoted, setHasVoted] = useState(
    currentUserId ? review.helpfulVotes?.includes(currentUserId) : false
  )
  const [helpfulCount, setHelpfulCount] = useState(review.helpful || 0)

  const handleHelpfulVote = async () => {
    if (!onHelpfulVote || isVoting) return

    setIsVoting(true)
    try {
      await onHelpfulVote(review._id!)
      setHasVoted(!hasVoted)
      setHelpfulCount(prev => hasVoted ? prev - 1 : prev + 1)
    } catch (error) {
      console.error('Error voting:', error)
    } finally {
      setIsVoting(false)
    }
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
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

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3 space-x-reverse">
          {review.userImage ? (
            <CloudinaryImage
              src={review.userImage}
              alt={review.userName}
              width={40}
              height={40}
              className="rounded-full"
              transformation="w_40,h_40,c_fill,q_80,f_auto"
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
              <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                <Shield className="h-3 w-3" />
                <span>مسافر مؤكد</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(review.createdAt)}</span>
            </div>
          </div>
        </div>

        {showActions && (
          <button className="text-gray-400 hover:text-gray-600">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Rating and Title */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center">
            {renderStars(review.rating)}
          </div>
          <span className="text-sm text-gray-600">({review.rating}/5)</span>
        </div>
        <h3 className="font-semibold text-gray-900 text-lg">{review.title}</h3>
      </div>

      {/* Comment */}
      <p className="text-gray-700 leading-relaxed">{review.comment}</p>

      {/* Review Images */}
      {review.images && review.images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {review.images.slice(0, 6).map((image, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
              <CloudinaryImage
                src={image}
                alt={`صورة التقييم ${index + 1}`}
                fill
                className="hover:scale-105 transition-transform duration-200"
                transformation="w_200,h_200,c_fill,q_80,f_auto"
              />
            </div>
          ))}
        </div>
      )}

      {/* Admin Response */}
      {review.adminResponse && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">إ</span>
            </div>
            <span className="font-medium text-blue-900">رد الإدارة</span>
            <span className="text-sm text-blue-600">
              {formatDate(review.adminResponse.respondedAt)}
            </span>
          </div>
          <p className="text-blue-800">{review.adminResponse.message}</p>
        </div>
      )}

      {/* Actions */}
      {showActions && currentUserId && (
        <div className="flex items-center justify-between pt-4 border-t">
          <button
            onClick={handleHelpfulVote}
            disabled={isVoting}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              hasVoted
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            } disabled:opacity-50`}
          >
            <ThumbsUp className={`h-4 w-4 ${hasVoted ? 'fill-current' : ''}`} />
            <span>مفيد ({helpfulCount})</span>
          </button>

          <div className="text-sm text-gray-500">
            هل كان هذا التقييم مفيداً؟
          </div>
        </div>
      )}
    </div>
  )
}