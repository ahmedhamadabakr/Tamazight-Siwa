/**
 * Mobile font optimization utilities
 */

// Preload critical fonts for mobile
export function preloadMobileFonts() {
  if (typeof window === 'undefined') return

  const fonts = [
    {
      href: '/fonts/geist-sans-400.woff2',
      weight: '400',
    },
    {
      href: '/fonts/geist-sans-600.woff2', 
      weight: '600',
    }
  ]

  fonts.forEach(font => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'font'
    link.type = 'font/woff2'
    link.crossOrigin = 'anonymous'
    link.href = font.href
    document.head.appendChild(link)
  })
}

// Font display optimization for mobile
export const mobileOptimizedFontCSS = `
  @font-face {
    font-family: 'Geist Sans';
    src: url('/fonts/geist-sans-400.woff2') format('woff2');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }
  
  @font-face {
    font-family: 'Geist Sans';
    src: url('/fonts/geist-sans-600.woff2') format('woff2');
    font-weight: 600;
    font-style: normal;
    font-display: swap;
  }
  
  /* Mobile-first font sizes */
  :root {
    --font-size-xs: 0.75rem;
    --font-size-sm: 0.875rem;
    --font-size-base: 1rem;
    --font-size-lg: 1.125rem;
    --font-size-xl: 1.25rem;
    --font-size-2xl: 1.5rem;
    --font-size-3xl: 1.875rem;
  }
  
  @media (min-width: 768px) {
    :root {
      --font-size-xs: 0.75rem;
      --font-size-sm: 0.875rem;
      --font-size-base: 1rem;
      --font-size-lg: 1.125rem;
      --font-size-xl: 1.25rem;
      --font-size-2xl: 1.5rem;
      --font-size-3xl: 2.25rem;
    }
  }
`

// Critical CSS for mobile
export const mobileCriticalCSS = `
  /* Critical mobile styles */
  * {
    box-sizing: border-box;
  }
  
  html {
    -webkit-text-size-adjust: 100%;
    -webkit-tap-highlight-color: transparent;
  }
  
  body {
    margin: 0;
    font-family: 'Geist Sans', system-ui, -apple-system, sans-serif;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  /* Mobile navigation */
  .mobile-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 50;
    background: white;
    border-top: 1px solid #e5e7eb;
    padding: 0.5rem;
  }
  
  /* Mobile-optimized buttons */
  .mobile-btn {
    min-height: 44px;
    min-width: 44px;
    touch-action: manipulation;
  }
  
  /* Reduce motion for mobile */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`