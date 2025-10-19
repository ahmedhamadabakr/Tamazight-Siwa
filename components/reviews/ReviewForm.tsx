"use client"

import { useState } from 'react'
import { Star, Upload, X, Loader2 } from 'lucide-react'
import { CloudinaryUpload } from '@/components/CloudinaryUpload'

interface ReviewFormProps {
    tourId: string
    onSubmit: (reviewData: {
        rating: number
        title: string
        comment: string
        images: string[]
    }) => Promise<void>
    onCancel?: () => void
    isSubmitting?: boolean
}

export function ReviewForm({
    tourId,
    onSubmit,
    onCancel,
    isSubmitting = false
}: ReviewFormProps) {
    // Remove unused tourId parameter warning by using it in a comment
    // tourId is used for API calls when submitting the review
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [title, setTitle] = useState('')
    const [comment, setComment] = useState('')
    const [images, setImages] = useState<string[]>([])
    const [errors, setErrors] = useState<{ [key: string]: string }>({})

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {}

        if (rating === 0) {
            newErrors.rating = 'يرجى اختيار تقييم'
        }

        if (!title.trim()) {
            newErrors.title = 'عنوان التقييم مطلوب'
        } else if (title.length > 100) {
            newErrors.title = 'عنوان التقييم يجب أن يكون أقل من 100 حرف'
        }

        if (!comment.trim()) {
            newErrors.comment = 'نص التقييم مطلوب'
        } else if (comment.length < 10) {
            newErrors.comment = 'نص التقييم يجب أن يكون على الأقل 10 أحرف'
        } else if (comment.length > 1000) {
            newErrors.comment = 'نص التقييم يجب أن يكون أقل من 1000 حرف'
        }

        if (images.length > 5) {
            newErrors.images = 'يمكن إرفاق حتى 5 صور فقط'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        try {
            await onSubmit({
                rating,
                title: title.trim(),
                comment: comment.trim(),
                images
            })
        } catch (error) {
            console.error('Error submitting review:', error)
        }
    }

    const handleImageUpload = (result: any) => {
        if (images.length < 5) {
            setImages(prev => [...prev, result.imageUrl])
        }
    }

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index))
    }

    const renderStars = () => {
        return Array.from({ length: 5 }, (_, i) => {
            const starValue = i + 1
            return (
                <button
                    key={i}
                    type="button"
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHoverRating(starValue)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none"
                >
                    <Star
                        className={`h-8 w-8 transition-colors ${starValue <= (hoverRating || rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300 hover:text-yellow-200'
                            }`}
                    />
                </button>
            )
        })
    }

    const getRatingText = (rating: number) => {
        const texts = {
            1: 'سيء جداً',
            2: 'سيء',
            3: 'متوسط',
            4: 'جيد',
            5: 'ممتاز'
        }
        return texts[rating as keyof typeof texts] || ''
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">إضافة تقييم</h3>
                <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    <span>مسافر مؤكد</span>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                <p className="text-blue-800 text-sm">
                    💡 نقدر تجربتك! كمسافر حجز هذه الرحلة، رأيك مهم جداً لمساعدة المسافرين الآخرين
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Rating */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        التقييم *
                    </label>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center">
                            {renderStars()}
                        </div>
                        {rating > 0 && (
                            <span className="text-sm text-gray-600 mr-2">
                                {getRatingText(rating)} ({rating}/5)
                            </span>
                        )}
                    </div>
                    {errors.rating && (
                        <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
                    )}
                </div>

                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        عنوان التقييم *
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="اكتب عنواناً مختصراً لتقييمك"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        maxLength={100}
                    />
                    <div className="flex justify-between mt-1">
                        {errors.title && (
                            <p className="text-sm text-red-600">{errors.title}</p>
                        )}
                        <p className="text-sm text-gray-500">{title.length}/100</p>
                    </div>
                </div>

                {/* Comment */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        تفاصيل التقييم *
                    </label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="شاركنا تجربتك مع هذه الرحلة..."
                        rows={5}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        maxLength={1000}
                    />
                    <div className="flex justify-between mt-1">
                        {errors.comment && (
                            <p className="text-sm text-red-600">{errors.comment}</p>
                        )}
                        <p className="text-sm text-gray-500">{comment.length}/1000</p>
                    </div>
                </div>

                {/* Images */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        صور التقييم (اختياري)
                    </label>
                    <p className="text-sm text-gray-500 mb-3">
                        يمكنك إرفاق حتى 5 صور لتوضيح تجربتك
                    </p>

                    {images.length < 5 && (
                        <CloudinaryUpload
                            onUploadSuccess={handleImageUpload}
                            onUploadError={(error) => setErrors(prev => ({ ...prev, images: error }))}
                            folder="reviews"
                            className="mb-4"
                        />
                    )}

                    {images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                            {images.map((image, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={image}
                                        alt={`صورة التقييم ${index + 1}`}
                                        className="w-full h-24 object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {errors.images && (
                        <p className="text-sm text-red-600">{errors.images}</p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            disabled={isSubmitting}
                        >
                            إلغاء
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                جاري الإرسال...
                            </>
                        ) : (
                            'إرسال التقييم'
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}