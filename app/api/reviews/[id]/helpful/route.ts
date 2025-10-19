import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { getAuthOptions } from '@/lib/auth'
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
    const authOptions = await getAuthOptions()
    const session = await getServerSession(authOptions) as CustomSession

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'يجب تسجيل الدخول للتصويت' },
        { status: 401 }
      )
    }

    const db = await dbConnect()
    const collection = db.collection(reviewCollectionName)

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, message: 'معرف التقييم غير صحيح' },
        { status: 400 }
      )
    }

    const review = await collection.findOne({ _id: ObjectId.createFromHexString(params.id) })

    if (!review) {
      return NextResponse.json(
        { success: false, message: 'التقييم غير موجود' },
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
      updateOperation
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'فشل في تحديث التصويت' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        helpful: newHelpfulCount,
        hasVoted: !hasVoted
      },
      message: hasVoted ? 'تم إلغاء التصويت' : 'تم التصويت بنجاح'
    })

  } catch (error) {
    console.error('Error toggling helpful vote:', error)
    return NextResponse.json(
      { success: false, message: 'فشل في التصويت' },
      { status: 500 }
    )
  }
}