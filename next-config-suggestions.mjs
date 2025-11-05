
// Performance Optimization Suggestions for next.config.mjs:

const nextConfig = {
  // Enable advanced optimizations
  experimental: {
    optimizePackageImports: [
      'react', 'react-dom', 'framer-motion', 'lucide-react',
      '@radix-ui/react-accordion', '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu', '@radix-ui/react-navigation-menu',
      'react-select', 'react-hook-form', 'zod', 'clsx', 'tailwind-merge'
    ],
    optimizeCss: true,
    optimizeServerReact: true,
    serverMinification: true,
    workerThreads: false,
    swcMinify: true,
  },

  // Enhanced webpack optimization
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          framework: {
            chunks: 'all',
            name: 'framework',
            test: /[\/]node_modules[\/](react|react-dom|scheduler)[\/]/,
            priority: 40,
            enforce: true,
          },
          lib: {
            test(module) {
              return module.size() > 160000 && /node_modules[/\\]/.test(module.identifier())
            },
            name(module) {
              const identifier = module.identifier()
              const match = identifier.match(/node_modules[\\/]([^\\]+)/)
              return match && match[1] ? match[1] : 'lib'
            },
            priority: 30,
            minChunks: 1,
            reuseExistingChunk: true,
          },
          commons: {
            name: 'commons',
            minChunks: 2,
            priority: 20,
            reuseExistingChunk: true,
          },
        },
      }
    }
    return config
  },

  // Production optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },

  // Compression
  compress: true,
  poweredByHeader: false,
  
  // Output optimization for production
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
}

export default nextConfig
