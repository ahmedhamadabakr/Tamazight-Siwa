import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'

// Lazy load admin settings components
const GeneralSettings = dynamic(
  () => import('@/components/admin/settings/GeneralSettings').then(mod => ({ default: mod.GeneralSettings })),
  { loading: () => <Skeleton className="h-96 w-full" /> }
)

const SecuritySettings = dynamic(
  () => import('@/components/admin/settings/SecuritySettings').then(mod => ({ default: mod.SecuritySettings })),
  { loading: () => <Skeleton className="h-96 w-full" /> }
)

const NotificationSettings = dynamic(
  () => import('@/components/admin/settings/NotificationSettings').then(mod => ({ default: mod.NotificationSettings })),
  { loading: () => <Skeleton className="h-96 w-full" /> }
)

const PaymentSettings = dynamic(
  () => import('@/components/admin/settings/PaymentSettings').then(mod => ({ default: mod.PaymentSettings })),
  { loading: () => <Skeleton className="h-96 w-full" /> }
)

const SEOSettings = dynamic(
  () => import('@/components/admin/settings/SEOSettings').then(mod => ({ default: mod.SEOSettings })),
  { loading: () => <Skeleton className="h-96 w-full" /> }
)

export const metadata: Metadata = {
  title: 'Settings - Admin Panel',
  description: 'System configuration and settings',
}

function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>
      <Skeleton className="h-12 w-full" />
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  )
}

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">
          Manage your system configuration and preferences.
        </p>
      </div>

      {/* Settings Tabs */}
      <Suspense fallback={<SettingsSkeleton />}>
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <GeneralSettings />
          </TabsContent>

          <TabsContent value="security">
            <SecuritySettings />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentSettings />
          </TabsContent>

          <TabsContent value="seo">
            <SEOSettings />
          </TabsContent>
        </Tabs>
      </Suspense>
    </div>
  )
}
