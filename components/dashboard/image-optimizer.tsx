"use client"

import { useState } from 'react'
import { Zap, Settings, Play, Pause, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

interface OptimizationJob {
  id: string
  imageId: string
  title: string
  originalUrl: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  originalSize?: number
  optimizedSize?: number
  savings?: number
}

export default function ImageOptimizer() {
  const [jobs, setJobs] = useState<OptimizationJob[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [settings, setSettings] = useState({
    quality: 80,
    maxWidth: 1920,
    maxHeight: 1080,
    format: 'auto',
    enableWebP: true,
    enableAVIF: false
  })

  const startOptimization = async () => {
    setIsRunning(true)
    try {
      // Fetch all images that need optimization
      const response = await fetch('/api/gallery')
      const data = await response.json()
      
      if (data.success) {
        const imagesToOptimize = data.data.map((image: any) => ({
          id: `opt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          imageId: image._id,
          title: image.title,
          originalUrl: image.imageUrl,
          status: 'pending' as const
        }))
        
        setJobs(imagesToOptimize)
        
        // Process each image
        for (const job of imagesToOptimize) {
          await processOptimization(job)
        }
      }
    } catch (error) {
      console.error('Error starting optimization:', error)
    } finally {
      setIsRunning(false)
    }
  }

  const processOptimization = async (job: OptimizationJob) => {
    // Update job status to processing
    setJobs(prev => prev.map(j => 
      j.id === job.id ? { ...j, status: 'processing' } : j
    ))

    try {
      // Simulate optimization process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real implementation, you would:
      // 1. Download the original image
      // 2. Apply optimizations using Cloudinary transformations
      // 3. Update the database with new URL
      // 4. Calculate savings
      
      const mockSavings = Math.floor(Math.random() * 40) + 10 // 10-50% savings
      
      setJobs(prev => prev.map(j => 
        j.id === job.id ? { 
          ...j, 
          status: 'completed',
          originalSize: 1024 * 1024, // 1MB mock
          optimizedSize: 1024 * 1024 * (100 - mockSavings) / 100,
          savings: mockSavings
        } : j
      ))
    } catch (error) {
      setJobs(prev => prev.map(j => 
        j.id === job.id ? { ...j, status: 'failed' } : j
      ))
    }
  }

  const formatFileSize = (bytes: number) => {
    const sizes = ['bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getStatusIcon = (status: OptimizationJob['status']) => {
    switch (status) {
      case 'pending':
        return <div className="w-4 h-4 bg-gray-300 rounded-full" />
      case 'processing':
        return <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-600" />
    }
  }

  const totalSavings = jobs
    .filter(job => job.status === 'completed' && job.savings)
    .reduce((sum, job) => sum + (job.originalSize! - job.optimizedSize!), 0)

  const completedJobs = jobs.filter(job => job.status === 'completed').length
  const failedJobs = jobs.filter(job => job.status === 'failed').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-yellow-600" />
          <h2 className="text-xl font-semibold text-gray-900">Image Optimizer</h2>
        </div>
        <button
          onClick={startOptimization}
          disabled={isRunning}
          className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 disabled:opacity-50 flex items-center gap-2"
        >
          {isRunning ? (
            <>
              <Pause className="h-4 w-4" />
              Optimizing...
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Start Optimizing
            </>
          )}
        </button>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Optimization Settings</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image Quality
            </label>
            <input
              type="range"
              min="60"
              max="100"
              value={settings.quality}
              onChange={(e) => setSettings(prev => ({ ...prev, quality: parseInt(e.target.value) }))}
              className="w-full"
            />
            <span className="text-sm text-gray-500">{settings.quality}%</span>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Width
            </label>
            <input
              type="number"
              value={settings.maxWidth}
              onChange={(e) => setSettings(prev => ({ ...prev, maxWidth: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Height
            </label>
            <input
              type="number"
              value={settings.maxHeight}
              onChange={(e) => setSettings(prev => ({ ...prev, maxHeight: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image Format
            </label>
            <select
              value={settings.format}
              onChange={(e) => setSettings(prev => ({ ...prev, format: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="auto">Auto</option>
              <option value="webp">WebP</option>
              <option value="avif">AVIF</option>
              <option value="jpg">JPEG</option>
              <option value="png">PNG</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="enableWebP"
              checked={settings.enableWebP}
              onChange={(e) => setSettings(prev => ({ ...prev, enableWebP: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600"
            />
            <label htmlFor="enableWebP" className="mr-2 text-sm text-gray-700">
              Enable WebP
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="enableAVIF"
              checked={settings.enableAVIF}
              onChange={(e) => setSettings(prev => ({ ...prev, enableAVIF: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600"
            />
            <label htmlFor="enableAVIF" className="mr-2 text-sm text-gray-700">
              Enable AVIF
            </label>
          </div>
        </div>
      </div>

      {/* Statistics */}
      {jobs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-2xl font-semibold text-gray-900">{jobs.length}</p>
            <p className="text-gray-600">Total Images</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-2xl font-semibold text-green-600">{completedJobs}</p>
            <p className="text-gray-600">Optimized</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-2xl font-semibold text-red-600">{failedJobs}</p>
            <p className="text-gray-600">Failed</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-2xl font-semibold text-blue-600">
              {totalSavings > 0 ? formatFileSize(totalSavings) : '0 bytes'}
            </p>
            <p className="text-gray-600">Space saved</p>
          </div>
        </div>
      )}

      {/* Jobs List */}
      {jobs.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Optimization Log</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {jobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-4 border-b last:border-b-0">
                <div className="flex items-center gap-3">
                  {getStatusIcon(job.status)}
                  <div>
                    <p className="font-medium text-gray-900">{job.title}</p>
                    <p className="text-sm text-gray-500">
                      {job.status === 'pending' && 'Pending'}
                      {job.status === 'processing' && 'Processing'}
                      {job.status === 'completed' && `Optimized - saved ${job.savings}%`}
                      {job.status === 'failed' && 'Failed'}
                    </p>
                  </div>
                </div>
                
                {job.status === 'completed' && job.originalSize && job.optimizedSize && (
                  <div className="text-left">
                    <p className="text-sm text-gray-600">
                      {formatFileSize(job.originalSize)} → {formatFileSize(job.optimizedSize)}
                    </p>
                    <p className="text-sm text-green-600">
                      -{formatFileSize(job.originalSize - job.optimizedSize)}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}