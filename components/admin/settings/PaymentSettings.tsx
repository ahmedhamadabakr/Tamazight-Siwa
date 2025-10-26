"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Save, CreditCard, DollarSign, Shield } from 'lucide-react'

export function PaymentSettings() {
  const [settings, setSettings] = useState({
    stripeEnabled: true,
    stripePublicKey: 'pk_test_...',
    stripeSecretKey: '••••••••••••••••',
    paypalEnabled: true,
    paypalClientId: 'sb-...',
    paypalClientSecret: '••••••••••••••••',
    defaultCurrency: 'USD',
    acceptedCurrencies: ['USD', 'EUR', 'EGP'],
    taxRate: 14,
    processingFee: 2.9,
    refundPolicy: 'flexible',
    autoRefund: false,
  })

  const handleSave = () => {
    console.log('Saving payment settings:', settings)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Payment Gateways</span>
          </CardTitle>
          <CardDescription>
            Configure payment processors and their settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Stripe Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Stripe Payment Gateway</Label>
                <p className="text-sm text-gray-500">
                  Accept credit cards and digital payments
                </p>
              </div>
              <Switch
                checked={settings.stripeEnabled}
                onCheckedChange={(checked) => 
                  setSettings({ ...settings, stripeEnabled: checked })
                }
              />
            </div>

            {settings.stripeEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 border-l-2 border-gray-200">
                <div className="space-y-2">
                  <Label htmlFor="stripePublicKey">Stripe Public Key</Label>
                  <Input
                    id="stripePublicKey"
                    value={settings.stripePublicKey}
                    onChange={(e) => setSettings({ ...settings, stripePublicKey: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stripeSecretKey">Stripe Secret Key</Label>
                  <Input
                    id="stripeSecretKey"
                    type="password"
                    value={settings.stripeSecretKey}
                    onChange={(e) => setSettings({ ...settings, stripeSecretKey: e.target.value })}
                  />
                </div>
              </div>
            )}
          </div>

          {/* PayPal Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>PayPal Payment Gateway</Label>
                <p className="text-sm text-gray-500">
                  Accept PayPal and digital wallet payments
                </p>
              </div>
              <Switch
                checked={settings.paypalEnabled}
                onCheckedChange={(checked) => 
                  setSettings({ ...settings, paypalEnabled: checked })
                }
              />
            </div>

            {settings.paypalEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 border-l-2 border-gray-200">
                <div className="space-y-2">
                  <Label htmlFor="paypalClientId">PayPal Client ID</Label>
                  <Input
                    id="paypalClientId"
                    value={settings.paypalClientId}
                    onChange={(e) => setSettings({ ...settings, paypalClientId: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paypalClientSecret">PayPal Client Secret</Label>
                  <Input
                    id="paypalClientSecret"
                    type="password"
                    value={settings.paypalClientSecret}
                    onChange={(e) => setSettings({ ...settings, paypalClientSecret: e.target.value })}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Currency & Pricing</span>
          </CardTitle>
          <CardDescription>
            Configure currency settings and pricing rules.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="defaultCurrency">Default Currency</Label>
              <Select
                value={settings.defaultCurrency}
                onValueChange={(value) => setSettings({ ...settings, defaultCurrency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="EGP">EGP - Egyptian Pound</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                step="0.1"
                value={settings.taxRate}
                onChange={(e) => setSettings({ ...settings, taxRate: parseFloat(e.target.value) })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="processingFee">Processing Fee (%)</Label>
            <Input
              id="processingFee"
              type="number"
              step="0.1"
              value={settings.processingFee}
              onChange={(e) => setSettings({ ...settings, processingFee: parseFloat(e.target.value) })}
              className="w-32"
            />
            <p className="text-sm text-gray-500">
              Additional fee charged for payment processing
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Refund Policy</span>
          </CardTitle>
          <CardDescription>
            Configure refund rules and automation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="refundPolicy">Refund Policy</Label>
            <Select
              value={settings.refundPolicy}
              onValueChange={(value) => setSettings({ ...settings, refundPolicy: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flexible">Flexible - Full refund up to 24 hours before</SelectItem>
                <SelectItem value="moderate">Moderate - 50% refund up to 48 hours before</SelectItem>
                <SelectItem value="strict">Strict - No refunds after booking</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Automatic Refunds</Label>
              <p className="text-sm text-gray-500">
                Automatically process refunds based on policy
              </p>
            </div>
            <Switch
              checked={settings.autoRefund}
              onCheckedChange={(checked) => 
                setSettings({ ...settings, autoRefund: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="flex items-center space-x-2">
          <Save className="h-4 w-4" />
          <span>Save Payment Settings</span>
        </Button>
      </div>
    </div>
  )
}