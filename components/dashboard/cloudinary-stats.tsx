"use client"

import { useState, useEffect } from 'react'
import { Cloud, HardDrive, Image as ImageIcon, TrendingUp, Loader2 } from 'lucide-react'

interface CloudinaryStats {
  totalImages: number
  totalBytes: number
  formats: { [key: string]: number }
  avgWidth: number
  avgHeight: number
}

export default function CloudinaryStats() {
  const [stats, setStats] = useState<CloudinaryStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/cloudinary/stats')
      const data = await response.json()

      if (data.success) {
        setStats(data.stats)
      } else {
        setError(data.message || 'فشل في جلب الإحصائيات')
      }
    } catch (error) {
      console.error('Error fetching Cloudinary stats:', error)
      setError('حدث خطأ أثناء جلب الإحصائيات')
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center h-32">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button
            onClick={fetchStats}
            className="mt-2 text-blue-600 hover:text-blue-800 underline"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Cloud className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">إحصائيات Cloudinary</h2>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <ImageIcon className="h-8 w-8 text-blue-600" />
            <div className="mr-4">
              <p className="text-2xl font-semibold text-gray-900">{stats.totalImages}</p>
              <p className="text-gray-600">إجمالي الصور</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <HardDrive className="h-8 w-8 text-green-600" />
            <div className="mr-4">
              <p className="text-2xl font-semibold text-gray-900">
                {formatFileSize(stats.totalBytes)}
              </p>
              <p className="text-gray-600">المساحة المستخدمة</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <div className="mr-4">
              <p className="text-2xl font-semibold text-gray-900">
                {stats.avgWidth} × {stats.avgHeight}
              </p>
              <p className="text-gray-600">متوسط الأبعاد</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Cloud className="h-8 w-8 text-orange-600" />
            <div className="mr-4">
              <p className="text-2xl font-semibold text-gray-900">
                {Object.keys(stats.formats).length}
              </p>
              <p className="text-gray-600">أنواع الملفات</p>
            </div>
          </div>
        </div>
      </div>

      {/* Format Distribution */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">توزيع أنواع الملفات</h3>
        <div className="space-y-3">
          {Object.entries(stats.formats).map(([format, count]) => {
            const percentage = (count / stats.totalImages) * 100
            return (
              <div key={format} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700 uppercase">
                    {format}
                  </span>
                  <span className="text-sm text-gray-500">({count} صور)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-left">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Storage Usage */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">استخدام التخزين</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">المساحة المستخدمة</span>
            <span className="font-semibold">{formatFileSize(stats.totalBytes)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">متوسط حجم الصورة</span>
            <span className="font-semibold">
              {stats.totalImages > 0 
                ? formatFileSize(stats.totalBytes / stats.totalImages)
                : '0 بايت'
              }
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">أكبر صورة</span>
            <span className="font-semibold text-green-600">تحسين تلقائي</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">ضغط الصور</span>
            <span className="font-semibold text-green-600">مفعل</span>
          </div>
        </div>
      </div>
    </div>
  )
}