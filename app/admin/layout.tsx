import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerAuthSession } from '@/lib/server-auth';


import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'

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
  const session = await getServerAuthSession()

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
      <AdminSidebar />
      <div className="lg:pl-64">
        <AdminHeader user={session.user} />
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}