"use client"

import { useState, useEffect } from 'react'
import { Plus, Search, Filter, Eye, EyeOff, Edit, Trash2, Image as ImageIcon } from 'lucide-react'
import { CloudinaryImage } from '@/components/CloudinaryImage'
import GalleryForm from './gallery-form'
import Image from 'next/image'

interface GalleryImage {
  _id: string
  title: string
  description: string
  imageUrl: string
  publicId?: string
  category: string
  isActive: boolean
  width?: number
  height?: number
  format?: string
  bytes?: number
  createdAt: string
  updatedAt: string
}

interface GalleryStats {
  total: number
  active: number
  inactive: number
  categories: { [key: string]: number }
}

const CATEGORIES = ['Nature', 'Heritage', 'Landmarks', 'Activities', 'Food', 'Other']

export default function GalleryManager() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null)
  const [stats, setStats] = useState<GalleryStats>({
    total: 0,
    active: 0,
    inactive: 0,
    categories: {}
  })

  // Fetch images
  const fetchImages = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (categoryFilter) params.append('category', categoryFilter)

      const response = await fetch(`/api/gallery?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setImages(data.data)
        calculateStats(data.data)
      }
    } catch (error) {
      console.error('Error fetching images:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate statistics
  const calculateStats = (imageList: GalleryImage[]) => {
    const stats: GalleryStats = {
      total: imageList.length,
      active: imageList.filter(img => img.isActive).length,
      inactive: imageList.filter(img => !img.isActive).length,
      categories: {}
    }

    CATEGORIES.forEach(cat => {
      stats.categories[cat] = imageList.filter(img => img.category === cat).length
    })

    setStats(stats)
  }

  // Filter images
  useEffect(() => {
    let filtered = images

    if (searchTerm) {
      filtered = filtered.filter(img =>
        img.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        img.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (categoryFilter) {
      filtered = filtered.filter(img => img.category === categoryFilter)
    }

    setFilteredImages(filtered)
  }, [images, searchTerm, categoryFilter])

  // Load images on mount
  useEffect(() => {
    fetchImages()
  }, [])

  // Delete image
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return

    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      if (data.success) {
        await fetchImages() // Refresh list
      } else {
        alert(data.message || 'Failed to delete image')
      }
    } catch (error) {
      console.error('Error deleting image:', error)
      alert('Failed to delete image')
    }
  }

  // Toggle status
  const handleStatusToggle = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      const data = await response.json()
      if (data.success) {
        await fetchImages() // Refresh list
      } else {
        alert(data.message || 'Failed to update image status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update image status')
    }
  }

  // Save image
  const handleSaveImage = async (imageData: Partial<GalleryImage>) => {
    try {
      const url = editingImage ? `/api/gallery/${editingImage._id}` : '/api/gallery'
      const method = editingImage ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(imageData),
      })

      const data = await response.json()
      if (data.success) {
        await fetchImages() // Refresh list
        setShowForm(false)
        setEditingImage(null)
      } else {
        throw new Error(data.message || 'Failed to save image')
      }
    } catch (error) {
      console.error('Error saving image:', error)
      throw error
    }
  }

  // Format file size
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A'
    const sizes = ['Byte', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gallery Manager</h1>
        <button
          onClick={() => {
            setEditingImage(null)
            setShowForm(true)
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <Plus className="h-4 w-4" />
          Add New Image
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <div className="flex items-center space-x-3">
            <ImageIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xl sm:text-2xl font-semibold text-gray-900">{stats.total}</p>
              <p className="text-sm sm:text-base text-gray-600 truncate">Total Images</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <div className="flex items-center space-x-3">
            <Eye className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xl sm:text-2xl font-semibold text-gray-900">{stats.active}</p>
              <p className="text-sm sm:text-base text-gray-600 truncate">Active Images</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <div className="flex items-center space-x-3">
            <EyeOff className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xl sm:text-2xl font-semibold text-gray-900">{stats.inactive}</p>
              <p className="text-sm sm:text-base text-gray-600 truncate">Inactive Images</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <div className="flex items-center space-x-3">
            <Filter className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xl sm:text-2xl font-semibold text-gray-900">{Object.keys(stats.categories).length}</p>
              <p className="text-sm sm:text-base text-gray-600 truncate">Categories</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by title and description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>
                {cat} ({stats.categories[cat] || 0})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Images Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow animate-pulse">
              <div className="h-48 bg-gray-300 rounded-t-lg"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-3 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No images found</h3>
          <p className="text-gray-600">
            {searchTerm || categoryFilter ? 'No images match your search' : 'Start adding new images'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredImages.map((image) => (
            <div key={image._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="relative h-40 sm:h-48 rounded-t-lg overflow-hidden">
                <Image
                  src={image.imageUrl}
                  alt={image.title}
                  fill
                  quality={75}
                
                />
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    image.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {image.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              <div className="p-3 sm:p-4">
                <h3 className="font-semibold text-gray-900 mb-1 truncate text-sm sm:text-base">{image.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">{image.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">{image.category}</span>
                  <span className="text-xs">{formatFileSize(image.bytes)}</span>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => handleStatusToggle(image._id, image.isActive)}
                    className={`flex-1 px-3 py-1 text-xs rounded ${
                      image.isActive 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {image.isActive ? 'Hide' : 'Show'}
                  </button>
                  <button
                    onClick={() => {
                      setEditingImage(image)
                      setShowForm(true)
                    }}
                    className="flex-1 bg-blue-100 text-blue-700 px-3 py-1 text-xs rounded hover:bg-blue-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(image._id)}
                    className="flex-1 bg-red-100 text-red-700 px-3 py-1 text-xs rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <GalleryForm
          image={editingImage}
          onClose={() => {
            setShowForm(false)
            setEditingImage(null)
          }}
          onSave={handleSaveImage}
        />
      )}
    </div>
  )
}