import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import { reviewCollectionName, calculateReviewStats } from '@/models/Review'

// GET - Fetch reviews for a specific tour
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const rating = searchParams.get('rating')
    const verified = searchParams.get('verified')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const includeStats = searchParams.get('includeStats') === 'true'

    const db = await dbConnect()
    const collection = db.collection(reviewCollectionName)

    let query: any = {
      tourId: params.id,
      status: 'approved' // Only show approved reviews
    }

    if (rating) {
      query.rating = parseInt(rating)
    }

    if (verified === 'true') {
      query.verified = true
    }

    const skip = (page - 1) * limit
    const sortOptions: any = {}
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1

    const [reviews, totalCount] = await Promise.all([
      collection
        .find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(query)
    ])

    const totalPages = Math.ceil(totalCount / limit)

    const response: any = {
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    }

    // Include stats if requested
    if (includeStats) {
      const allReviews = await collection
        .find({ tourId: params.id, status: 'approved' })
        .toArray()
      
      response.data.stats = calculateReviewStats(allReviews as any[])
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Error fetching tour reviews:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch tour reviews'  },
      { status: 500 }
    )
  }
}