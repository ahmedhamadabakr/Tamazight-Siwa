import { Metadata } from 'next'
import { DashboardStats } from '@/components/admin/DashboardStats'
import { RecentBookings } from '@/components/admin/RecentBookings'
import { RevenueChart } from '@/components/admin/RevenueChart'
import { QuickActions } from '@/components/admin/QuickActions'
import { SystemHealth } from '@/components/admin/SystemHealth'

export const metadata: Metadata = {
  title: 'Dashboard - Admin Panel',
  description: 'Administrative dashboard overview',
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back! Here's what's happening with your tours today.
        </p>
      </div>

      {/* Dashboard Stats */}
      <DashboardStats />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts and Analytics */}
        <div className="lg:col-span-2 space-y-6">
          <RevenueChart />
          <RecentBookings />
        </div>

        {/* Right Column - Quick Actions and System Info */}
        <div className="space-y-6">
          <QuickActions />
          <SystemHealth />
        </div>
      </div>
    </div>
  )
}