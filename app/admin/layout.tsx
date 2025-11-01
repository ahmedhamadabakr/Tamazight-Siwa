import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

import { DashboardLayout } from '@/components/dashboard/sidebar'

export const metadata: Metadata = {
  title: 'Admin Dashboard - Siwa With Us',
  description: 'Administrative dashboard for Siwa With Us tour management',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  // Check if user is authenticated and has admin/manager role
  if (!session?.user) {
    redirect('/login?callbackUrl=/admin/dashboard')
  }

  const userRole = (session.user as any)?.role
  if (userRole !== 'admin' && userRole !== 'manager') {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
    <DashboardLayout>
      <main className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      </DashboardLayout>
    </div>
  )
}