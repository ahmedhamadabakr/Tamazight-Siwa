import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary

// Helper functions for Cloudinary operations
export const uploadImage = async (
  buffer: Buffer,
  options: {
    folder?: string
    publicId?: string
    transformation?: any[]
    tags?: string[]
  } = {}
) => {
  const { folder = 'siwa', publicId, transformation, tags = [] } = options

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        folder: `siwa/${folder}`,
        public_id: publicId,
        transformation: transformation || [
          { quality: 'auto', fetch_format: 'auto' },
          { width: 1920, height: 1080, crop: 'limit' }
        ],
        tags: ['siwa', folder, ...tags]
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      }
    ).end(buffer)
  })
}

export const deleteImage = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error)
    throw error
  }
}

export const getImageInfo = async (publicId: string) => {
  try {
    const result = await cloudinary.api.resource(publicId)
    return result
  } catch (error) {
    console.error('Error getting image info from Cloudinary:', error)
    throw error
  }
}

// Generate optimized URL
export const generateOptimizedUrl = (
  publicId: string,
  options: {
    width?: number
    height?: number
    quality?: number
    format?: string
    crop?: string
    transformation?: string
  } = {}
) => {
  const {
    width,
    height,
    quality = 80,
    format = 'auto',
    crop = 'fill',
    transformation
  } = options

  if (transformation) {
    return cloudinary.url(publicId, {
      transformation: transformation
    })
  }

  const transformations: any = {
    quality: quality,
    fetch_format: format
  }

  if (width && height) {
    transformations.width = width
    transformations.height = height
    transformations.crop = crop
  } else if (width) {
    transformations.width = width
  } else if (height) {
    transformations.height = height
  }

  return cloudinary.url(publicId, { transformation: transformations })
}

// Batch operations
export const uploadMultipleImages = async (
  files: { buffer: Buffer; filename: string }[],
  options: {
    folder?: string
    transformation?: any[]
    tags?: string[]
  } = {}
) => {
  const uploadPromises = files.map((file, index) => {
    const publicId = `${options.folder || 'gallery'}_${Date.now()}_${index}`
    return uploadImage(file.buffer, {
      ...options,
      publicId
    })
  })

  return Promise.all(uploadPromises)
}

export const deleteMultipleImages = async (publicIds: string[]) => {
  const deletePromises = publicIds.map(publicId => deleteImage(publicId))
  return Promise.all(deletePromises)
}

// Search and filter images
export const searchImages = async (
  query: string,
  options: {
    folder?: string
    maxResults?: number
    sortBy?: string
  } = {}
) => {
  const { folder = 'siwa', maxResults = 50, sortBy = 'created_at' } = options

  try {
    const result = await cloudinary.search
      .expression(`folder:${folder} AND ${query}`)
      .sort_by(sortBy, 'desc')
      .max_results(maxResults)
      .execute()

    return result
  } catch (error) {
    console.error('Error searching images in Cloudinary:', error)
    throw error
  }
}

// Get folder statistics
export const getFolderStats = async (folder: string = 'siwa') => {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: folder,
      max_results: 500
    })

    const stats = {
      totalImages: result.resources.length,
      totalBytes: result.resources.reduce((sum: number, resource: any) => sum + resource.bytes, 0),
      formats: {} as { [key: string]: number },
      avgWidth: 0,
      avgHeight: 0
    }

    result.resources.forEach((resource: any) => {
      stats.formats[resource.format] = (stats.formats[resource.format] || 0) + 1
    })

    const totalPixels = result.resources.reduce((sum: number, resource: any) => {
      return sum + (resource.width * resource.height)
    }, 0)

    if (result.resources.length > 0) {
      stats.avgWidth = Math.round(
        result.resources.reduce((sum: number, resource: any) => sum + resource.width, 0) / result.resources.length
      )
      stats.avgHeight = Math.round(
        result.resources.reduce((sum: number, resource: any) => sum + resource.height, 0) / result.resources.length
      )
    }

    return stats
  } catch (error) {
    console.error('Error getting folder stats from Cloudinary:', error)
    throw error
  }
}