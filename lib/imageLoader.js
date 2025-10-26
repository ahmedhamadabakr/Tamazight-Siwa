// Custom image loader for performance optimization
export default function imageLoader({ src, width, quality }) {
  // Handle external URLs
  if (src.startsWith('http')) {
    return src
  }

  // Handle Cloudinary images
  if (src.includes('cloudinary')) {
    const params = [`w_${width}`, `q_${quality || 75}`, 'f_auto', 'c_limit']
    return src.replace('/upload/', `/upload/${params.join(',')}/`)
  }

  // Handle local images with optimization
  const params = new URLSearchParams()
  params.set('w', width.toString())
  params.set('q', (quality || 75).toString())

  // Add format optimization
  params.set('f', 'auto')
  
  // Add responsive sizing
  if (width <= 640) {
    params.set('c', 'thumb')
  } else if (width <= 1200) {
    params.set('c', 'scale')
  } else {
    params.set('c', 'limit')
  }

  return `/_next/image?url=${encodeURIComponent(src)}&${params.toString()}`
}