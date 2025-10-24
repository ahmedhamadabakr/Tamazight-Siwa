export interface GalleryImage {
  _id?: string;
  title: string;
  description: string;
  imageUrl: string;
  publicId?: string; // Cloudinary public ID for deletion
  category: string;
  isActive: boolean;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
  createdAt: Date;
  updatedAt: Date;
}

export const GALLERY_CATEGORIES = ['Nature', 'Heritage', 'Landmarks', 'Activities', 'Food', 'Other'];

export function validateGalleryImage(data: Partial<GalleryImage>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.title || data.title.trim().length === 0) {
    errors.push('Image title is required');
  } else if (data.title.length > 100) {
    errors.push('Image title must be less than 100 characters');
  }

  if (!data.imageUrl || data.imageUrl.trim().length === 0) {
    errors.push('Image URL is required');
  }

  if (!data.category || !GALLERY_CATEGORIES.includes(data.category)) {
    errors.push('Image category is invalid');
  }

  if (data.description && data.description.length > 500) {
    errors.push('Image description must be less than 500 characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}