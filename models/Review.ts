// MongoDB ObjectId type is handled by the database layer

export interface Review {
  _id?: string
  tourId: string
  userId: string
  userName: string
  userEmail: string
  userImage?: string
  rating: number // 1-5 stars
  title: string
  comment: string
  images?: string[] // Optional review images
  helpful: number // Number of helpful votes
  helpfulVotes: string[] // User IDs who voted helpful
  verified: boolean // Whether user actually booked this tour
  status: 'pending' | 'approved' | 'rejected'
  adminResponse?: {
    message: string
    respondedBy: string
    respondedAt: Date
  }
  createdAt: Date
  updatedAt: Date
}

export interface ReviewStats {
  totalReviews: number
  averageRating: number
  ratingDistribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
  verifiedReviews: number
  recentReviews: Review[]
}

export const reviewCollectionName = 'reviews'

// Validation function
export function validateReview(data: Partial<Review>): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.tourId || data.tourId.trim().length === 0) {
    errors.push('معرف الرحلة مطلوب')
  }

  if (!data.userId || data.userId.trim().length === 0) {
    errors.push('معرف المستخدم مطلوب')
  }

  if (!data.rating || data.rating < 1 || data.rating > 5) {
    errors.push('التقييم يجب أن يكون بين 1 و 5 نجوم')
  }

  if (!data.title || data.title.trim().length === 0) {
    errors.push('عنوان التقييم مطلوب')
  } else if (data.title.length > 100) {
    errors.push('عنوان التقييم يجب أن يكون أقل من 100 حرف')
  }

  if (!data.comment || data.comment.trim().length === 0) {
    errors.push('نص التقييم مطلوب')
  } else if (data.comment.length < 10) {
    errors.push('نص التقييم يجب أن يكون على الأقل 10 أحرف')
  } else if (data.comment.length > 1000) {
    errors.push('نص التقييم يجب أن يكون أقل من 1000 حرف')
  }

  if (data.images && data.images.length > 5) {
    errors.push('يمكن إرفاق حتى 5 صور فقط')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Helper function to calculate review stats
export function calculateReviewStats(reviews: Review[]): ReviewStats {
  const approvedReviews = reviews.filter(review => review.status === 'approved')
  const totalReviews = approvedReviews.length
  
  if (totalReviews === 0) {
    return {
      totalReviews: 0,
      averageRating: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      verifiedReviews: 0,
      recentReviews: []
    }
  }

  const totalRating = approvedReviews.reduce((sum, review) => sum + review.rating, 0)
  const averageRating = Math.round((totalRating / totalReviews) * 10) / 10

  const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  approvedReviews.forEach(review => {
    ratingDistribution[review.rating as keyof typeof ratingDistribution]++
  })

  const verifiedReviews = approvedReviews.filter(review => review.verified).length
  const recentReviews = approvedReviews
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return {
    totalReviews,
    averageRating,
    ratingDistribution,
    verifiedReviews,
    recentReviews
  }
}