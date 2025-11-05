/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  
  experimental: {
    optimizePackageImports: [
      'react', 
      'react-dom', 
      'framer-motion', 
      'lucide-react'
    ],
    optimizeCss: true
  },
  
  webpack: (config, { dev, isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': './'
    }
    return config
  }
}

export default nextConfig
