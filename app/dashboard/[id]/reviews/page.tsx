'use client'

import { DashboardLayout } from '@/components/dashboard/sidebar'
import ReviewsManager from '@/components/dashboard/reviews-manager'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ReviewsPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/login')
      return
    }

    if (!session.user || (session.user as any)?.role !== 'manager') {
      router.push('/')
      return
    }

    if (!session.user || (session.user as any)?.id !== params.id) {
      router.push(`/dashboard/${(session.user as any)?.id}`)
      return
    }
  }, [session, status, router, params.id])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session || (session.user as any)?.role !== 'manager') {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reviews Management</h1>
          <p className="text-gray-600 mt-2">
            Manage and moderate user reviews for tours
          </p>
        </div>
        
        <ReviewsManager />
      </div>
    </DashboardLayout>
  )
}