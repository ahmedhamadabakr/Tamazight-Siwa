// Content Security Policy
// Keep existing sources and add Google Fonts
import path from 'path'

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' blob: data: https: res.cloudinary.com",
  "font-src 'self' https://fonts.gstatic.com",
  "connect-src 'self' https://vercel.live wss://ws.pusherapp.com https://fonts.googleapis.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join('; ')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  
  // Performance optimizations
  experimental: {
    optimizePackageImports: [
      'react', 
      'react-dom', 
      'framer-motion', 
      'lucide-react',
      '@radix-ui/react-accordion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-navigation-menu',
      'react-select',
      'react-hook-form',
      'zod',
      'clsx',
      'tailwind-merge',
      'react-icons',
      'sonner',
      'class-variance-authority'
    ],
    webVitalsAttribution: ['CLS', 'LCP', 'FCP', 'FID', 'TTFB'],
    serverComponentsExternalPackages: ['mongodb', 'bcryptjs', 'sharp'],
    optimizeCss: true,
    scrollRestoration: true,
    largePageDataBytes: 64 * 1000, // 64KB - reduced for mobile
    optimizeServerReact: true,
    workerThreads: false,
    serverMinification: true,
    swcMinify: true,
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    esmExternals: 'loose',
    serverSourceMaps: false,
    clientRouterFilter: true,
    clientRouterFilterRedirects: true,
    optimisticClientCache: true,
  },
  
  // Production optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },
  
  // Security and performance headers
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'X-DNS-Prefetch-Control', value: 'on' },
        { key: 'Content-Security-Policy', value: csp },
      ],
    },
    // Ensure service worker is always fresh
    {
      source: '/sw.js',
      headers: [
        { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, max-age=0' },
        { key: 'Service-Worker-Allowed', value: '/' },
      ],
    },
    {
      source: '/api/auth/(.*)',
      headers: [
        { key: 'Cache-Control', value: 'no-store' },
      ],
    },
    {
      source: '/login',
      headers: [
        { key: 'Cache-Control', value: 'no-store, max-age=0' },
      ],
    },
    {
      source: '/api/(.*)',
      headers: [
        { key: 'Cache-Control', value: 'public, s-maxage=60, stale-while-revalidate=300' },
      ],
    },
    {
      source: '/_next/static/(.*)',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      ],
    },
    // Long-term caching for image assets served from public root
    {
      source: '/:slug*\\.(png|jpg|jpeg|webp|avif|svg|ico)',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      ],
    },
    // Long-term caching for video assets served from public root
    {
      source: '/:slug*\\.(mp4|webm)',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      ],
    },
    // Long-term caching for web fonts served from public root
    {
      source: '/:slug*\\.(woff2|woff|ttf|otf)',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      ],
    },
    // Long-term caching for captions and media text tracks
    {
      source: '/:slug*\\.(vtt)',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      ],
    },
    // Reasonable caching for public root text/json/xml assets
    // e.g., robots.txt, sitemap.xml, manifest.json
    {
      source: '/:slug*\\.(json|xml|txt)',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=86400' },
      ],
    },
    {
      source: '/images/(.*)',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=86400' },
      ],
    },
  ],
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Enhanced image optimization for mobile + web
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1 year
    deviceSizes: [640, 750, 828, 1080, 1200, 1920], // Optimized for mobile-first
    imageSizes: [16, 32, 48, 64, 96, 128, 256], // Reduced sizes
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dp5bk64xn/**',
      },
    ],
    loader: 'default',
    unoptimized: false,
  },
  
  // Output optimization - removed standalone for development
  // output: 'standalone', // Enable only for production deployment
  
  // Advanced webpack optimizations for mobile + web performance
  webpack: (config, { dev, isServer }) => {
    // Add path alias resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(process.cwd()),
    }
    
    // Production optimizations
    if (!dev && !isServer) {
      // Enhanced chunk splitting for better caching
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 200000, // 200KB max chunks for mobile
        cacheGroups: {
          default: false,
          vendors: false,
          // React framework chunk
          framework: {
            chunks: 'all',
            name: 'framework',
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
            priority: 40,
            enforce: true,
          },
          // UI libraries chunk
          ui: {
            name: 'ui',
            test: /[\\/]node_modules[\\/](@radix-ui|lucide-react|framer-motion)[\\/]/,
            chunks: 'all',
            priority: 30,
            enforce: true,
          },
          // Form libraries chunk
          forms: {
            name: 'forms',
            test: /[\\/]node_modules[\\/](react-hook-form|zod|@hookform)[\\/]/,
            chunks: 'all',
            priority: 25,
            enforce: true,
          },
          // Common utilities
          lib: {
            name: 'lib',
            test: /[\\/]node_modules[\\/](clsx|tailwind-merge|class-variance-authority)[\\/]/,
            chunks: 'all',
            priority: 20,
            enforce: true,
          },
          // Default vendor chunk
          vendor: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
          },
          // Common app code
          commons: {
            name: 'commons',
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      }
      
      // Tree shaking optimization
      config.optimization.usedExports = true
      config.optimization.sideEffects = false
      
      // Module concatenation
      config.optimization.concatenateModules = true
    }
    
    return config
  },
}

export default nextConfig