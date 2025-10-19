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

export const GALLERY_CATEGORIES = ['طبيعة', 'تراث', 'مناظر', 'أنشطة', 'طعام', 'أخرى'];

export function validateGalleryImage(data: Partial<GalleryImage>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.title || data.title.trim().length === 0) {
    errors.push('عنوان الصورة مطلوب');
  } else if (data.title.length > 100) {
    errors.push('عنوان الصورة يجب أن يكون أقل من 100 حرف');
  }

  if (!data.imageUrl || data.imageUrl.trim().length === 0) {
    errors.push('رابط الصورة مطلوب');
  }

  if (!data.category || !GALLERY_CATEGORIES.includes(data.category)) {
    errors.push('فئة الصورة غير صحيحة');
  }

  if (data.description && data.description.length > 500) {
    errors.push('وصف الصورة يجب أن يكون أقل من 500 حرف');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}