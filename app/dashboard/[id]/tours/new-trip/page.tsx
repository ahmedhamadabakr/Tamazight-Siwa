'use client'

import { DashboardLayout } from '@/components/dashboard/sidebar'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function NewTrip() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    price: '',
    location: '',
    category: '',
    featured: false,
  })

  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)


  const { data: session } = useSession();

  useEffect(() => {
    if (!session || session.user?.role !== 'manager') {
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

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 py-10 px-6">
        <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">Add New Trip</h1>
          <p className="text-gray-500 mb-8">Create a new tour and add all the details below.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">
                  Title (English)
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Description Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">
                  Description (English)
                </label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  required
                />
              </div>
            </div>

            {/* Duration / Price / Location */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">Duration</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={e => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g. 3 days"
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">Price ($)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Category & Featured */}
            <div className="grid md:grid-cols-2 gap-6">
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

            {/* Images */}
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
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
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
            <div className="flex justify-end gap-3 pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
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
