"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Save, Shield, Key, AlertTriangle } from 'lucide-react'

export function SecuritySettings() {
  const [settings, setSettings] = useState({
    twoFactorAuth: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireSpecialChars: true,
    enableCaptcha: true,
    ipWhitelist: '',
    enableAuditLog: true,
  })

  const handleSave = () => {
    console.log('Saving security settings:', settings)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Authentication Security</span>
          </CardTitle>
          <CardDescription>
            Configure authentication and access control settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Two-Factor Authentication</Label>
              <p className="text-sm text-gray-500">
                Require 2FA for admin accounts
              </p>
            </div>
            <Switch
              checked={settings.twoFactorAuth}
              onCheckedChange={(checked) => 
                setSettings({ ...settings, twoFactorAuth: checked })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
              <Input
                id="maxLoginAttempts"
                type="number"
                value={settings.maxLoginAttempts}
                onChange={(e) => setSettings({ ...settings, maxLoginAttempts: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable CAPTCHA</Label>
              <p className="text-sm text-gray-500">
                Show CAPTCHA after failed login attempts
              </p>
            </div>
            <Switch
              checked={settings.enableCaptcha}
              onCheckedChange={(checked) => 
                setSettings({ ...settings, enableCaptcha: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="h-5 w-5" />
            <span>Password Policy</span>
          </CardTitle>
          <CardDescription>
            Set password requirements for user accounts.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
            <Input
              id="passwordMinLength"
              type="number"
              value={settings.passwordMinLength}
              onChange={(e) => setSettings({ ...settings, passwordMinLength: parseInt(e.target.value) })}
              className="w-32"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Require Special Characters</Label>
              <p className="text-sm text-gray-500">
                Passwords must contain special characters
              </p>
            </div>
            <Switch
              checked={settings.requireSpecialChars}
              onCheckedChange={(checked) => 
                setSettings({ ...settings, requireSpecialChars: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Access Control</span>
          </CardTitle>
          <CardDescription>
            Configure IP restrictions and audit logging.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="ipWhitelist">IP Whitelist</Label>
            <Input
              id="ipWhitelist"
              placeholder="192.168.1.1, 10.0.0.1 (comma separated)"
              value={settings.ipWhitelist}
              onChange={(e) => setSettings({ ...settings, ipWhitelist: e.target.value })}
            />
            <p className="text-sm text-gray-500">
              Leave empty to allow all IPs. Use comma-separated values for multiple IPs.
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Audit Logging</Label>
              <p className="text-sm text-gray-500">
                Log all admin actions for security auditing
              </p>
            </div>
            <Switch
              checked={settings.enableAuditLog}
              onCheckedChange={(checked) => 
                setSettings({ ...settings, enableAuditLog: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="flex items-center space-x-2">
          <Save className="h-4 w-4" />
          <span>Save Security Settings</span>
        </Button>
      </div>
    </div>
  )
}