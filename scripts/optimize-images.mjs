#!/usr/bin/env node

/**
 * Image optimization script for mobile and web performance
 */

import { promises as fs } from 'fs'
import path from 'path'
import sharp from 'sharp'

const PUBLIC_DIR = './public'
const OPTIMIZED_DIR = './public/optimized'

// Image optimization settings
const OPTIMIZATION_SETTINGS = {
  jpeg: {
    quality: 75,
    progressive: true,
    mozjpeg: true
  },
  webp: {
    quality: 75,
    effort: 6
  },
  avif: {
    quality: 65,
    effort: 9
  },
  png: {
    quality: 80,
    compressionLevel: 9,
    progressive: true
  }
}

// Responsive image sizes for mobile-first approach
const RESPONSIVE_SIZES = [
  { width: 320, suffix: '-mobile' },
  { width: 640, suffix: '-tablet' },
  { width: 1024, suffix: '-desktop' },
  { width: 1920, suffix: '-xl' }
]

async function ensureDir(dir) {
  try {
    await fs.access(dir)
  } catch {
    await fs.mkdir(dir, { recursive: true })
  }
}

async function optimizeImage(inputPath, outputDir, filename) {
  const baseName = path.parse(filename).name
  const ext = path.parse(filename).ext.toLowerCase()
  
  console.log(`Optimizing: ${filename}`)
  
  try {
    const image = sharp(inputPath)
    const metadata = await image.metadata()
    
    // Skip if image is too small
    if (metadata.width < 300 || metadata.height < 200) {
      console.log(`Skipping small image: ${filename}`)
      return
    }
    
    // Generate responsive sizes
    for (const size of RESPONSIVE_SIZES) {
      if (size.width <= metadata.width) {
        const resizedImage = image.clone().resize(size.width, null, {
          withoutEnlargement: true,
          fit: 'inside'
        })
        
        // Generate WebP
        await resizedImage
          .webp(OPTIMIZATION_SETTINGS.webp)
          .toFile(path.join(outputDir, `${baseName}${size.suffix}.webp`))
        
        // Generate AVIF for modern browsers
        await resizedImage
          .avif(OPTIMIZATION_SETTINGS.avif)
          .toFile(path.join(outputDir, `${baseName}${size.suffix}.avif`))
        
        // Generate optimized original format
        if (ext === '.jpg' || ext === '.jpeg') {
          await resizedImage
            .jpeg(OPTIMIZATION_SETTINGS.jpeg)
            .toFile(path.join(outputDir, `${baseName}${size.suffix}.jpg`))
        } else if (ext === '.png') {
          await resizedImage
            .png(OPTIMIZATION_SETTINGS.png)
            .toFile(path.join(outputDir, `${baseName}${size.suffix}.png`))
        }
      }
    }
    
    // Generate thumbnail (for lazy loading placeholders)
    await image
      .clone()
      .resize(20, 20, { fit: 'inside' })
      .blur(2)
      .webp({ quality: 20 })
      .toFile(path.join(outputDir, `${baseName}-thumb.webp`))
    
    console.log(`✅ Optimized: ${filename}`)
    
  } catch (error) {
    console.error(`❌ Error optimizing ${filename}:`, error.message)
  }
}

async function processDirectory(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    
    if (entry.isDirectory() && entry.name !== 'optimized') {
      await processDirectory(fullPath)
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase()
      
      if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
        await optimizeImage(fullPath, OPTIMIZED_DIR, entry.name)
      }
    }
  }
}

async function generateImageManifest() {
  const manifestPath = path.join(OPTIMIZED_DIR, 'manifest.json')
  const images = await fs.readdir(OPTIMIZED_DIR)
  
  const manifest = {
    generated: new Date().toISOString(),
    images: images.filter(img => !img.endsWith('.json')),
    totalImages: images.length - 1, // Exclude manifest.json
    formats: ['avif', 'webp', 'jpg', 'png'],
    sizes: RESPONSIVE_SIZES.map(s => s.width)
  }
  
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2))
  console.log(`📋 Generated image manifest: ${images.length - 1} images`)
}

async function main() {
  console.log('🖼️  Starting image optimization...')
  console.log(`📁 Source: ${PUBLIC_DIR}`)
  console.log(`📁 Output: ${OPTIMIZED_DIR}`)
  
  // Ensure output directory exists
  await ensureDir(OPTIMIZED_DIR)
  
  // Process all images
  await processDirectory(PUBLIC_DIR)
  
  // Generate manifest
  await generateImageManifest()
  
  console.log('✨ Image optimization complete!')
  console.log('')
  console.log('📊 Optimization Summary:')
  console.log('• Generated responsive sizes: 320px, 640px, 1024px, 1920px')
  console.log('• Formats: AVIF (best), WebP (good), JPEG/PNG (fallback)')
  console.log('• Quality: AVIF 65%, WebP 75%, JPEG 75%')
  console.log('• Features: Progressive JPEG, optimized PNG, blur thumbnails')
  console.log('')
  console.log('🚀 Usage in components:')
  console.log('import { MobileOptimizedImage } from "@/lib/mobile-image-optimizer"')
  console.log('<MobileOptimizedImage src="/optimized/image-mobile.webp" ... />')
}

// Run the script
main().catch(console.error)