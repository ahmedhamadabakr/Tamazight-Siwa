import { Metadata } from 'next'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GeneralSettings } from '@/components/admin/settings/GeneralSettings'
import { SecuritySettings } from '@/components/admin/settings/SecuritySettings'
import { NotificationSettings } from '@/components/admin/settings/NotificationSettings'
import { PaymentSettings } from '@/components/admin/settings/PaymentSettings'
import { SEOSettings } from '@/components/admin/settings/SEOSettings'

export const metadata: Metadata = {
  title: 'Settings - Admin Panel',
  description: 'System configuration and settings',
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
    </div>
  )
}