'use client'

import { DashboardLayout } from '@/components/dashboard/sidebar'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

export default function NewTrip() {
  const router = useRouter()

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    duration: string;
    price: string;
    location: string;
    category: string;
    featured: boolean;
    groupSize: string;
    difficulty: string;
    highlights: string[];
    images: string[];
    startDate: string;
    endDate: string;
  }>({
    title: '',
    description: '',
    duration: '',
    price: '',
    location: '',
    category: '',
    featured: false,
    groupSize: '',
    difficulty: 'Easy',
    highlights: [],
    images: [],
    startDate: '',
    endDate: '',
  })

  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [newHighlight, setNewHighlight] = useState('')


  const { data: session } = useSession();

  useEffect(() => {
    if (!session || (session.user as any)?.role !== 'manager') {
      router.push('/');
    }
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/tours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, images }),
      })

      const data = await response.json()
      if (data.success) {
        alert('Trip added successfully!')
        router.push('/dashboard/trips')
      } else {
        alert(data.error || 'Failed to add trip.')
      }
    } catch (error) {
      console.error('Error adding tour:', error)
      alert('Failed to add trip.')
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const uploadFormData = new FormData()
      uploadFormData.append('image', file)

      const response = await fetch('/api/tours/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      const data = await response.json()
      if (data.success) {
        setImages(prev => [...prev, data.data.url])
      } else {
        alert(data.error || 'Image upload failed.')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Image upload failed.')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleAddHighlight = () => {
    if (newHighlight.trim() && !formData.highlights.includes(newHighlight.trim())) {
      setFormData(prev => ({
        ...prev,
        highlights: [...prev.highlights, newHighlight.trim()]
      }))
      setNewHighlight('')
    }
  }

  const handleRemoveHighlight = (index: number) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }))
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-sm border border-gray-100">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4 sm:mb-6">Add New Trip</h1>
          <p className="text-gray-500 mb-6 sm:mb-8">Create a new tour and add all the details below.</p>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Title Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">
                  Title (English)
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2 sm:p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  required
                />
              </div>
            </div>

            {/* Description Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">
                  Description (English)
                </label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 sm:p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  rows={4}
                  required
                />
              </div>
            </div>

            {/* Duration / Price / Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">Duration</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={e => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g. 3 days"
                  className="w-full p-2 sm:p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">Price $</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                  className="w-full p-2 sm:p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className="w-full p-2 sm:p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  required
                />
              </div>
            </div>

            {/* Start Date / End Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">
                 Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">
                 End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                  min={formData.startDate}
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Category & Featured */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select category</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Nature">Nature</option>
                  <option value="Beach">Beach</option>
                  <option value="Historical">Historical</option>
                </select>
              </div>

              <div className="flex items-center mt-6">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                  className="mr-2 accent-blue-600"
                />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                  Featured Trip
                </label>
              </div>
            </div>

            {/* Group Size & Difficulty */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">Group Size</label>
                <input
                  type="text"
                  value={formData.groupSize}
                  onChange={e => setFormData({ ...formData, groupSize: e.target.value })}
                  placeholder="e.g. 2-10 people"
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">Difficulty</label>
                <select
                  value={formData.difficulty}
                  onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="Easy">Easy</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Challenging">Challenging</option>
                  <option value="Difficult">Difficult</option>
                </select>
              </div>
            </div>

            {/* Highlights */}
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">Tour Highlights</label>
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={newHighlight}
                    onChange={e => setNewHighlight(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddHighlight())}
                    placeholder="Add a highlight..."
                    className="flex-1 p-2 sm:p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={handleAddHighlight}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
                  >
                    Add
                  </button>
                </div>
                {formData.highlights.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.highlights.map((highlight, index) => (
                      <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2">
                        <span>{highlight}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveHighlight(index)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">Trip Images</label>
              <div className="space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="w-full p-2 border rounded-lg"
                />
                {uploading && <p className="text-blue-600">Uploading image...</p>}

                {images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 mt-2">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <Image
                          src={image}
                          alt={`Trip ${index + 1}`}
                          className="w-full h-28 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 sm:pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
              >
                Add Trip
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
