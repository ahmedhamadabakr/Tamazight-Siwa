"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Save, Mail, Bell, MessageSquare } from 'lucide-react'

export function NotificationSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: {
      newBooking: true,
      paymentReceived: true,
      customerMessage: true,
      systemAlerts: true,
      weeklyReport: false,
      monthlyReport: true,
    },
    pushNotifications: {
      newBooking: true,
      urgentAlerts: true,
      systemMaintenance: true,
    },
    smsNotifications: {
      criticalAlerts: true,
      paymentIssues: true,
    }
  })

  const handleSave = () => {
    console.log('Saving notification settings:', settings)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Email Notifications</span>
          </CardTitle>
          <CardDescription>
            Configure which events trigger email notifications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>New Booking Notifications</Label>
              <p className="text-sm text-gray-500">
                Get notified when a new booking is made
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications.newBooking}
              onCheckedChange={(checked) => 
                setSettings({
                  ...settings,
                  emailNotifications: { ...settings.emailNotifications, newBooking: checked }
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Payment Received</Label>
              <p className="text-sm text-gray-500">
                Notification when payment is successfully processed
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications.paymentReceived}
              onCheckedChange={(checked) => 
                setSettings({
                  ...settings,
                  emailNotifications: { ...settings.emailNotifications, paymentReceived: checked }
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Customer Messages</Label>
              <p className="text-sm text-gray-500">
                Get notified when customers send messages
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications.customerMessage}
              onCheckedChange={(checked) => 
                setSettings({
                  ...settings,
                  emailNotifications: { ...settings.emailNotifications, customerMessage: checked }
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>System Alerts</Label>
              <p className="text-sm text-gray-500">
                Important system notifications and errors
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications.systemAlerts}
              onCheckedChange={(checked) => 
                setSettings({
                  ...settings,
                  emailNotifications: { ...settings.emailNotifications, systemAlerts: checked }
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Weekly Reports</Label>
              <p className="text-sm text-gray-500">
                Weekly summary of bookings and revenue
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications.weeklyReport}
              onCheckedChange={(checked) => 
                setSettings({
                  ...settings,
                  emailNotifications: { ...settings.emailNotifications, weeklyReport: checked }
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Monthly Reports</Label>
              <p className="text-sm text-gray-500">
                Monthly business analytics and insights
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications.monthlyReport}
              onCheckedChange={(checked) => 
                setSettings({
                  ...settings,
                  emailNotifications: { ...settings.emailNotifications, monthlyReport: checked }
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Push Notifications</span>
          </CardTitle>
          <CardDescription>
            Configure browser push notifications for real-time alerts.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>New Booking Alerts</Label>
              <p className="text-sm text-gray-500">
                Instant notification for new bookings
              </p>
            </div>
            <Switch
              checked={settings.pushNotifications.newBooking}
              onCheckedChange={(checked) => 
                setSettings({
                  ...settings,
                  pushNotifications: { ...settings.pushNotifications, newBooking: checked }
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Urgent System Alerts</Label>
              <p className="text-sm text-gray-500">
                Critical system issues requiring immediate attention
              </p>
            </div>
            <Switch
              checked={settings.pushNotifications.urgentAlerts}
              onCheckedChange={(checked) => 
                setSettings({
                  ...settings,
                  pushNotifications: { ...settings.pushNotifications, urgentAlerts: checked }
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Maintenance Notifications</Label>
              <p className="text-sm text-gray-500">
                Scheduled maintenance and system updates
              </p>
            </div>
            <Switch
              checked={settings.pushNotifications.systemMaintenance}
              onCheckedChange={(checked) => 
                setSettings({
                  ...settings,
                  pushNotifications: { ...settings.pushNotifications, systemMaintenance: checked }
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>SMS Notifications</span>
          </CardTitle>
          <CardDescription>
            Configure SMS alerts for critical events only.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Critical System Alerts</Label>
              <p className="text-sm text-gray-500">
                Server downtime and critical system failures
              </p>
            </div>
            <Switch
              checked={settings.smsNotifications.criticalAlerts}
              onCheckedChange={(checked) => 
                setSettings({
                  ...settings,
                  smsNotifications: { ...settings.smsNotifications, criticalAlerts: checked }
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Payment Issues</Label>
              <p className="text-sm text-gray-500">
                Failed payments and payment gateway issues
              </p>
            </div>
            <Switch
              checked={settings.smsNotifications.paymentIssues}
              onCheckedChange={(checked) => 
                setSettings({
                  ...settings,
                  smsNotifications: { ...settings.smsNotifications, paymentIssues: checked }
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="flex items-center space-x-2">
          <Save className="h-4 w-4" />
          <span>Save Notification Settings</span>
        </Button>
      </div>
    </div>
  )
}