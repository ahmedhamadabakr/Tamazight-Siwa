'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { CloudinaryUpload } from '@/components/CloudinaryUpload';

interface GalleryImage {
  _id?: string;
  title: string;
  description: string;
  imageUrl: string;
  publicId?: string;
  category: string;
  isActive: boolean;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
}

interface GalleryFormProps {
  image?: GalleryImage | null;
  onClose: () => void;
  onSave: (imageData: Partial<GalleryImage>) => Promise<void>;
}

export default function GalleryForm({ image, onClose, onSave }: GalleryFormProps) {
  const [formData, setFormData] = useState({
    title: image?.title || '',
    description: image?.description || '',
    category: image?.category || 'Nature',
    isActive: image?.isActive ?? true,
  });
  const [cloudinaryData, setCloudinaryData] = useState<{
    imageUrl: string;
    publicId: string;
    width: number;
    height: number;
    format: string;
    bytes: number;
  } | null>(
    image?.imageUrl ? {
      imageUrl: image.imageUrl,
      publicId: image.publicId || '',
      width: image.width || 0,
      height: image.height || 0,
      format: image.format || '',
      bytes: image.bytes || 0
    } : null
  );
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');

  const categories = ['Nature', 'Heritage', 'Landmarks', 'Activities', 'Food', 'Other'];

  const handleUploadSuccess = (result: {
    imageUrl: string;
    publicId: string;
    width: number;
    height: number;
    format: string;
    bytes: number;
  }) => {
    setCloudinaryData(result);
    setUploadError('');
  };

  const handleUploadError = (error: string) => {
    setUploadError(error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUploadError('');

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        setUploadError('Please enter an image title');
        return;
      }

      if (!cloudinaryData?.imageUrl) {
        setUploadError('Please select an image');
        return;
      }

      await onSave({
        ...formData,
        ...cloudinaryData,
      });

      onClose();
    } catch (error) {
      console.error('Error saving image:', error);
      setUploadError('Failed to save image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 sm:p-6 border-b">
          <h3 className="text-lg sm:text-xl font-semibold">
            {image ? 'Edit Image' : 'Add New Image'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image *
            </label>
            <CloudinaryUpload
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
              folder="gallery"
              currentImage={image?.imageUrl}
              disabled={loading}
            />
            {uploadError && (
              <p className="mt-2 text-sm text-red-600">{uploadError}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter image title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter image description (optional)"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="mr-2 text-sm font-medium text-gray-700">
              Active (Will be displayed in the gallery)
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white px-4 py-2 sm:py-3 rounded-lg hover:bg-gray-600 font-medium text-sm sm:text-base"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 sm:py-3 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 text-sm sm:text-base"
              disabled={loading}
            >
              {loading ? 'Saving...' : (image ? 'Update' : 'Add')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}