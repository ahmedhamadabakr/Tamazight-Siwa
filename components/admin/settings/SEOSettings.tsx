"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Save, Search, Globe, BarChart3 } from 'lucide-react'

export function SEOSettings() {
  const [settings, setSettings] = useState({
    siteTitle: 'Siwa With Us - Authentic Desert Experiences',
    metaDescription: 'Discover the magic of Siwa Oasis with authentic eco-tourism experiences, cultural heritage tours, and premium desert adventures.',
    keywords: 'Siwa Oasis, desert tourism, Egypt tours, eco-tourism, cultural heritage',
    googleAnalyticsId: 'GA-XXXXXXXXX',
    googleSearchConsole: true,
    facebookPixelId: '',
    twitterCard: 'summary_large_image',
    openGraphImage: '/og-image.jpg',
    robotsTxt: 'User-agent: *\nAllow: /',
    sitemapEnabled: true,
    structuredDataEnabled: true,
    breadcrumbsEnabled: true,
  })

  const handleSave = () => {
    console.log('Saving SEO settings:', settings)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Basic SEO Settings</span>
          </CardTitle>
          <CardDescription>
            Configure basic SEO metadata for your website.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="siteTitle">Site Title</Label>
            <Input
              id="siteTitle"
              value={settings.siteTitle}
              onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
            />
            <p className="text-sm text-gray-500">
              Appears in search results and browser tabs (50-60 characters recommended)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea
              id="metaDescription"
              value={settings.metaDescription}
              onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
              rows={3}
            />
            <p className="text-sm text-gray-500">
              Brief description for search results (150-160 characters recommended)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords</Label>
            <Input
              id="keywords"
              value={settings.keywords}
              onChange={(e) => setSettings({ ...settings, keywords: e.target.value })}
            />
            <p className="text-sm text-gray-500">
              Comma-separated keywords relevant to your business
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Analytics & Tracking</span>
          </CardTitle>
          <CardDescription>
            Configure analytics and tracking codes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
            <Input
              id="googleAnalyticsId"
              placeholder="GA-XXXXXXXXX or G-XXXXXXXXXX"
              value={settings.googleAnalyticsId}
              onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="facebookPixelId">Facebook Pixel ID</Label>
            <Input
              id="facebookPixelId"
              placeholder="123456789012345"
              value={settings.facebookPixelId}
              onChange={(e) => setSettings({ ...settings, facebookPixelId: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Google Search Console</Label>
              <p className="text-sm text-gray-500">
                Enable Google Search Console integration
              </p>
            </div>
            <Switch
              checked={settings.googleSearchConsole}
              onCheckedChange={(checked) => 
                setSettings({ ...settings, googleSearchConsole: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>Social Media & Open Graph</span>
          </CardTitle>
          <CardDescription>
            Configure social media sharing settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="openGraphImage">Open Graph Image URL</Label>
            <Input
              id="openGraphImage"
              value={settings.openGraphImage}
              onChange={(e) => setSettings({ ...settings, openGraphImage: e.target.value })}
            />
            <p className="text-sm text-gray-500">
              Image shown when sharing on social media (1200x630px recommended)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="twitterCard">Twitter Card Type</Label>
            <select
              id="twitterCard"
              value={settings.twitterCard}
              onChange={(e) => setSettings({ ...settings, twitterCard: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="summary">Summary</option>
              <option value="summary_large_image">Summary Large Image</option>
              <option value="app">App</option>
              <option value="player">Player</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Technical SEO</CardTitle>
          <CardDescription>
            Configure technical SEO features and automation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="robotsTxt">Robots.txt Content</Label>
            <Textarea
              id="robotsTxt"
              value={settings.robotsTxt}
              onChange={(e) => setSettings({ ...settings, robotsTxt: e.target.value })}
              rows={4}
              className="font-mono text-sm"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>XML Sitemap</Label>
              <p className="text-sm text-gray-500">
                Automatically generate and update XML sitemap
              </p>
            </div>
            <Switch
              checked={settings.sitemapEnabled}
              onCheckedChange={(checked) => 
                setSettings({ ...settings, sitemapEnabled: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Structured Data</Label>
              <p className="text-sm text-gray-500">
                Enable JSON-LD structured data markup
              </p>
            </div>
            <Switch
              checked={settings.structuredDataEnabled}
              onCheckedChange={(checked) => 
                setSettings({ ...settings, structuredDataEnabled: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Breadcrumb Navigation</Label>
              <p className="text-sm text-gray-500">
                Show breadcrumb navigation for better UX and SEO
              </p>
            </div>
            <Switch
              checked={settings.breadcrumbsEnabled}
              onCheckedChange={(checked) => 
                setSettings({ ...settings, breadcrumbsEnabled: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="flex items-center space-x-2">
          <Save className="h-4 w-4" />
          <span>Save SEO Settings</span>
        </Button>
      </div>
    </div>
  )
}