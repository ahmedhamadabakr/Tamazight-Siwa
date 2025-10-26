"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Save, Upload } from 'lucide-react'

export function GeneralSettings() {
  const [settings, setSettings] = useState({
    siteName: 'Siwa With Us',
    siteDescription: 'Authentic desert experiences and eco-tourism in Siwa Oasis, Egypt',
    contactEmail: 'info@siwa-with-us.com',
    contactPhone: '+20 123 456 789',
    address: 'Siwa Oasis, Matrouh Governorate, Egypt',
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: true,
  })

  const handleSave = () => {
    // Save settings logic here
    console.log('Saving settings:', settings)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Site Information</CardTitle>
          <CardDescription>
            Basic information about your website and business.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="siteDescription">Site Description</Label>
            <Textarea
              id="siteDescription"
              value={settings.siteDescription}
              onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Business Address</Label>
              <Input
                id="address"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Site Logo</CardTitle>
          <CardDescription>
            Upload your site logo and favicon.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label>Main Logo</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <Button variant="outline">Upload Logo</Button>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  PNG, JPG up to 2MB
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <Label>Favicon</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <Button variant="outline">Upload Favicon</Button>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  ICO, PNG 32x32px
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Site Settings</CardTitle>
          <CardDescription>
            Configure general site behavior and user registration.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Maintenance Mode</Label>
              <p className="text-sm text-gray-500">
                Put the site in maintenance mode for updates
              </p>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) => 
                setSettings({ ...settings, maintenanceMode: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Allow User Registration</Label>
              <p className="text-sm text-gray-500">
                Allow new users to register accounts
              </p>
            </div>
            <Switch
              checked={settings.allowRegistration}
              onCheckedChange={(checked) => 
                setSettings({ ...settings, allowRegistration: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Require Email Verification</Label>
              <p className="text-sm text-gray-500">
                Users must verify their email before accessing the site
              </p>
            </div>
            <Switch
              checked={settings.requireEmailVerification}
              onCheckedChange={(checked) => 
                setSettings({ ...settings, requireEmailVerification: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="flex items-center space-x-2">
          <Save className="h-4 w-4" />
          <span>Save Changes</span>
        </Button>
      </div>
    </div>
  )
}