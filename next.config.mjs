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
  }
}

export default nextConfig
