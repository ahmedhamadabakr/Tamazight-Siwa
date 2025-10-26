"use client"
import { useEffect, useState } from 'react'

// Combined SEO and Performance optimization
export function SEOPerformanceOptimizer() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Critical SEO optimizations
    const optimizeSEO = () => {
      // Add missing alt attributes to images
      const images = document.querySelectorAll('img:not([alt])')
      images.forEach((img, index) => {
        img.setAttribute('alt', `Siwa Oasis image ${index + 1}`)
      })

      // Optimize heading structure
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
      let h1Count = 0
      headings.forEach(heading => {
        if (heading.tagName === 'H1') {
          h1Count++
          if (h1Count > 1) {
            // Convert extra H1s to H2s
            const newH2 = document.createElement('h2')
            newH2.innerHTML = heading.innerHTML
            newH2.className = heading.className
            heading.parentNode?.replaceChild(newH2, heading)
          }
        }
      })

      // Add title attributes to links without them
      const links = document.querySelectorAll('a:not([title])')
      links.forEach(link => {
        const text = link.textContent?.trim()
        if (text) {
          link.setAttribute('title', text)
        }
      })

      // Optimize internal links
      const internalLinks = document.querySelectorAll('a[href^="/"], a[href^="#"]')
      internalLinks.forEach(link => {
        if (!link.getAttribute('aria-label')) {
          const text = link.textContent?.trim()
          if (text) {
            link.setAttribute('aria-label', `Navigate to ${text}`)
          }
        }
      })

      // Add schema markup to missing elements
      const articles = document.querySelectorAll('article:not([itemscope])')
      articles.forEach(article => {
        article.setAttribute('itemscope', '')
        article.setAttribute('itemtype', 'https://schema.org/Article')
      })
    }

    // Performance optimizations that help SEO
    const optimizePerformance = () => {
      // Lazy load images below the fold
      const lazyImages = document.querySelectorAll('img[data-src]')
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            img.src = img.dataset.src!
            img.removeAttribute('data-src')
            imageObserver.unobserve(img)
          }
        })
      })

      lazyImages.forEach(img => imageObserver.observe(img))

      // Preload critical resources
      const criticalResources = [
        '/siwa-oasis-sunset-salt-lakes-reflection.jpg',
        '/logo.png'
      ]

      criticalResources.forEach(resource => {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.as = 'image'
        link.href = resource
        document.head.appendChild(link)
      })

      // Optimize font loading for better CLS
      if ('fonts' in document) {
        document.fonts.ready.then(() => {
          document.body.classList.add('fonts-loaded')
        })
      }
    }

    // Core Web Vitals optimization
    const optimizeWebVitals = () => {
      // Reduce Cumulative Layout Shift (CLS)
      const images = document.querySelectorAll('img')
      images.forEach(img => {
        if (!img.width || !img.height) {
          // Set aspect ratio to prevent layout shift
          img.style.aspectRatio = '16/9'
        }
      })

      // Optimize Largest Contentful Paint (LCP)
      const heroImage = document.querySelector('.hero-section img')
      if (heroImage) {
        heroImage.setAttribute('fetchpriority', 'high')
      }

      // Improve First Input Delay (FID)
      const heavyScripts = document.querySelectorAll('script[src*="analytics"], script[src*="tracking"]')
      heavyScripts.forEach(script => {
        script.setAttribute('defer', '')
      })
    }

    // SEO monitoring and reporting
    const monitorSEO = () => {
      const seoIssues: string[] = []

      // Check for missing meta description
      const metaDescription = document.querySelector('meta[name="description"]')
      if (!metaDescription || !metaDescription.getAttribute('content')) {
        seoIssues.push('Missing meta description')
      }

      // Check for missing title
      if (!document.title || document.title.length < 30) {
        seoIssues.push('Title too short or missing')
      }

      // Check for missing H1
      const h1 = document.querySelector('h1')
      if (!h1) {
        seoIssues.push('Missing H1 tag')
      }

      // Check for images without alt text
      const imagesWithoutAlt = document.querySelectorAll('img:not([alt])')
      if (imagesWithoutAlt.length > 0) {
        seoIssues.push(`${imagesWithoutAlt.length} images missing alt text`)
      }

      // Log issues in development
      if (process.env.NODE_ENV === 'development' && seoIssues.length > 0) {
        console.warn('SEO Issues Found:', seoIssues)
      }
    }

    // Initialize optimizations
    const init = () => {
      optimizeSEO()
      optimizePerformance()
      optimizeWebVitals()
      monitorSEO()
      setIsLoaded(true)
    }

    // Run after DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init)
    } else {
      init()
    }

    return () => {
      document.removeEventListener('DOMContentLoaded', init)
    }
  }, [])

  // Add critical CSS for SEO elements
  useEffect(() => {
    if (isLoaded) {
      const style = document.createElement('style')
      style.textContent = `
        /* SEO-friendly styles */
        .seo-hidden {
          position: absolute;
          left: -10000px;
          width: 1px;
          height: 1px;
          overflow: hidden;
        }
        
        /* Skip to content link for accessibility */
        .skip-to-content {
          position: absolute;
          top: -40px;
          left: 6px;
          background: #d4a574;
          color: white;
          padding: 8px;
          text-decoration: none;
          border-radius: 4px;
          z-index: 10000;
        }
        
        .skip-to-content:focus {
          top: 6px;
        }
        
        /* Structured data visibility */
        script[type="application/ld+json"] {
          display: none;
        }
        
        /* Image optimization */
        img {
          max-width: 100%;
          height: auto;
        }
        
        /* Font loading optimization */
        .fonts-loaded {
          font-family: 'Cairo', system-ui, -apple-system, sans-serif;
        }
        
        /* Print styles for SEO */
        @media print {
          .no-print {
            display: none !important;
          }
          
          a[href]:after {
            content: " (" attr(href) ")";
            font-size: 0.8em;
            color: #666;
          }
          
          a[href^="#"]:after,
          a[href^="javascript:"]:after {
            content: "";
          }
        }
      `
      
      document.head.appendChild(style)
      
      return () => {
        document.head.removeChild(style)
      }
    }
  }, [isLoaded])

  return null
}

// Hook for SEO monitoring
export function useSEOMonitoring() {
  const [seoScore, setSeoScore] = useState(0)
  const [issues, setIssues] = useState<string[]>([])

  useEffect(() => {
    const calculateSEOScore = () => {
      let score = 100
      const foundIssues: string[] = []

      // Check title
      if (!document.title || document.title.length < 30 || document.title.length > 60) {
        score -= 10
        foundIssues.push('Title length not optimal (30-60 characters)')
      }

      // Check meta description
      const metaDesc = document.querySelector('meta[name="description"]')
      const descContent = metaDesc?.getAttribute('content')
      if (!descContent || descContent.length < 120 || descContent.length > 160) {
        score -= 10
        foundIssues.push('Meta description length not optimal (120-160 characters)')
      }

      // Check H1
      const h1Tags = document.querySelectorAll('h1')
      if (h1Tags.length === 0) {
        score -= 15
        foundIssues.push('Missing H1 tag')
      } else if (h1Tags.length > 1) {
        score -= 5
        foundIssues.push('Multiple H1 tags found')
      }

      // Check images
      const images = document.querySelectorAll('img')
      const imagesWithoutAlt = document.querySelectorAll('img:not([alt])')
      if (imagesWithoutAlt.length > 0) {
        score -= Math.min(20, imagesWithoutAlt.length * 2)
        foundIssues.push(`${imagesWithoutAlt.length} images missing alt text`)
      }

      // Check internal links
      const internalLinks = document.querySelectorAll('a[href^="/"]')
      if (internalLinks.length < 3) {
        score -= 5
        foundIssues.push('Few internal links found')
      }

      // Check structured data
      const structuredData = document.querySelectorAll('script[type="application/ld+json"]')
      if (structuredData.length === 0) {
        score -= 10
        foundIssues.push('No structured data found')
      }

      setSeoScore(Math.max(0, score))
      setIssues(foundIssues)
    }

    const timer = setTimeout(calculateSEOScore, 2000)
    return () => clearTimeout(timer)
  }, [])

  return { seoScore, issues }
}