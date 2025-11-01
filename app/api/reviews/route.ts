import { NextRequest, NextResponse } from 'next/server'
import { getServerAuthSession } from '@/lib/server-auth';



import dbConnect from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { Review, validateReview, reviewCollectionName } from '@/models/Review'

interface CustomSession {
  user?: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
  }
}

// GET - Fetch reviews
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tourId = searchParams.get('tourId')
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')
    const admin = searchParams.get('admin')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50') // Increase limit for admin
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Check if user is admin for admin requests
    if (admin === 'true') {
      const session = await getServerAuthSession() as CustomSession

      if (!session?.user || session.user.role !== 'manager') {
        return NextResponse.json(
          { success: false, message: 'Unauthorized' },
          { status: 403 }
        )
      }
    }

    const db = await dbConnect()
    const collection = db.collection(reviewCollectionName)

    let query: any = {}

    if (tourId) {
      query.tourId = tourId
    }

    if (userId) {
      query.userId = userId
    }

    if (status) {
      query.status = status
    } else if (admin !== 'true') {
      // Default to approved reviews for public viewing only
      query.status = 'approved'
    }

    // Add search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { comment: { $regex: search, $options: 'i' } },
        { userName: { $regex: search, $options: 'i' } }
      ]
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

    return NextResponse.json({
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
    })

  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

// POST - Create new review
export async function POST(request: NextRequest) {
  try {
    const session = await getServerAuthSession() as CustomSession

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Please log in to add a review' },
        { status: 401 }
      )
    }

    const db = await dbConnect()
    const body = await request.json()
    const { tourId, rating, title, comment, images } = body

    // Validation
    const validation = validateReview({
      tourId,
      userId: session.user.id,
      rating,
      title,
      comment,
      images
    })

    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, message: validation.errors.join(', ') },
        { status: 400 }
      )
    }

    // Check if user has booked this tour (for verified badge)
    const booking = await db.collection('bookings').findOne({
      tour: ObjectId.createFromHexString(tourId),
      user: ObjectId.createFromHexString(session.user.id),
      status: { $in: ['confirmed', 'completed'] }
    })

    const hasBooking = !!booking

    // Check if user already reviewed this tour
    const existingReview = await db.collection(reviewCollectionName).findOne({
      tourId,
      userId: session.user.id
    })

    if (existingReview) {
      return NextResponse.json(
        { success: false, message: 'You have already reviewed this tour' },
        { status: 400 }
      )
    }

    const newReview = {
      tourId,
      userId: session.user.id,
      userName: session.user.name || 'user',
      userEmail: session.user.email || '',
      userImage: session.user.image || undefined,
      rating: parseInt(rating),
      title: title.trim(),
      comment: comment.trim(),
      images: images || [],
      helpful: 0,
      helpfulVotes: [],
      verified: hasBooking, // True only if user has booking
      status: 'pending', // Reviews need approval
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection(reviewCollectionName).insertOne(newReview)
    const insertedReview = await db.collection(reviewCollectionName).findOne({ _id: result.insertedId })

    return NextResponse.json({
      success: true,
      data: insertedReview,
      message: 'Review submitted and will be reviewed soon'
    })

  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to add review' },
      { status: 500 }
    )
  }
}