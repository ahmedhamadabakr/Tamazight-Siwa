import { NextRequest, NextResponse } from 'next/server'
import { getServerAuthSession } from '@/lib/server-auth';



import dbConnect from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { reviewCollectionName } from '@/models/Review'

interface CustomSession {
  user?: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
  }
}

// POST - Toggle helpful vote
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerAuthSession() as CustomSession

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'You must be logged in to vote' },
        { status: 401 }
      )
    }

    const db = await dbConnect()
    const collection = db.collection(reviewCollectionName)

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid review ID' },
        { status: 400 }
      )
    }

    const review = await collection.findOne({ _id: ObjectId.createFromHexString(params.id) })

    if (!review) {
      return NextResponse.json(
        { success: false, message: 'Review not found' },
        { status: 404 }
      )
    }

    // Check if user already voted
    const helpfulVotes = review.helpfulVotes || []
    const hasVoted = helpfulVotes.includes(session.user.id)

    let updateOperation
    let newHelpfulCount

    if (hasVoted) {
      // Remove vote
      updateOperation = {
        $pull: { helpfulVotes: session.user.id },
        $inc: { helpful: -1 }
      }
      newHelpfulCount = Math.max(0, (review.helpful || 0) - 1)
    } else {
      // Add vote
      updateOperation = {
        $addToSet: { helpfulVotes: session.user.id },
        $inc: { helpful: 1 }
      }
      newHelpfulCount = (review.helpful || 0) + 1
    }

    const result = await collection.updateOne(
      { _id: ObjectId.createFromHexString(params.id) },
      updateOperation as any
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Failed to update vote' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        helpful: newHelpfulCount,
        hasVoted: !hasVoted
      },
      message: hasVoted ? 'Vote removed' : 'Vote added'
    })

  } catch (error) {
    console.error('Error toggling helpful vote:', error)
    return NextResponse.json(
      { success: false, message: 'Error toggling helpful vote' },
      { status: 500 }
    )
  }
}