"use client"
import { useEffect, useState } from 'react'

interface NetworkInfo {
  effectiveType: string
  downlink: number
  rtt: number
  saveData: boolean
}

// Network-aware optimizations
export function NetworkOptimizer() {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null)
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    if (typeof navigator === 'undefined') return;
    
    // Network information detection
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
    
    if (connection) {
      const updateNetworkInfo = () => {
        setNetworkInfo({
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData
        })
      }

      updateNetworkInfo()
      connection.addEventListener('change', updateNetworkInfo)

      return () => connection.removeEventListener('change', updateNetworkInfo)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Online/offline detection
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    if (!networkInfo || typeof document === 'undefined') return

    // Apply network-based optimizations
    const applyOptimizations = () => {
      const isSlowConnection = ['slow-2g', '2g', '3g'].includes(networkInfo.effectiveType)
      const isDataSaver = networkInfo.saveData
      const isLowBandwidth = networkInfo.downlink < 1.5

      if (isSlowConnection || isDataSaver || isLowBandwidth) {
        // Reduce image quality
        document.documentElement.style.setProperty('--image-quality', '50')
        
        // Disable non-essential animations
        document.documentElement.classList.add('reduce-animations')
        
        // Lazy load more aggressively
        document.documentElement.style.setProperty('--lazy-threshold', '200px')
        
        // Reduce video quality
        const videos = document.querySelectorAll('video')
        videos.forEach(video => {
          video.preload = 'none'
        })

        // Disable autoplay
        const autoplayElements = document.querySelectorAll('[autoplay]')
        autoplayElements.forEach(element => {
          element.removeAttribute('autoplay')
        })
      } else {
        // High-speed connection optimizations
        document.documentElement.style.setProperty('--image-quality', '85')
        document.documentElement.classList.remove('reduce-animations')
        document.documentElement.style.setProperty('--lazy-threshold', '50px')
      }
    }

    applyOptimizations()
  }, [networkInfo])

  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    if (!isOnline) {
      // Offline optimizations
      document.documentElement.classList.add('offline-mode')
      
      // Show offline indicator
      const offlineIndicator = document.createElement('div')
      offlineIndicator.id = 'offline-indicator'
      offlineIndicator.innerHTML = `
        <div style="
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: #f59e0b;
          color: white;
          text-align: center;
          padding: 8px;
          font-size: 14px;
          z-index: 9999;
        ">
          You're offline. Some features may not be available.
        </div>
      `
      document.body.appendChild(offlineIndicator)
    } else {
      // Online - remove offline indicator
      document.documentElement.classList.remove('offline-mode')
      const offlineIndicator = document.getElementById('offline-indicator')
      if (offlineIndicator) {
        offlineIndicator.remove()
      }
    }
  }, [isOnline])

  return null
}

// Hook for network-aware loading
export function useNetworkAwareLoading() {
  const [shouldLoad, setShouldLoad] = useState(true)

  useEffect(() => {
    if (typeof navigator === 'undefined') return;
    
    const connection = (navigator as any).connection
    if (connection) {
      const isSlowConnection = ['slow-2g', '2g'].includes(connection.effectiveType)
      const isDataSaver = connection.saveData
      
      setShouldLoad(!isSlowConnection && !isDataSaver)
    }
  }, [])

  return shouldLoad
}

// Component for adaptive loading based on network
export function AdaptiveLoader({ 
  children, 
  fallback, 
  threshold = 'slow-2g' 
}: { 
  children: React.ReactNode
  fallback: React.ReactNode
  threshold?: string 
}) {
  const [shouldRender, setShouldRender] = useState(true)

  useEffect(() => {
    if (typeof navigator === 'undefined') return;
    
    const connection = (navigator as any).connection
    if (connection) {
      const networkSpeed = connection.effectiveType
      const slowNetworks = ['slow-2g', '2g']
      
      if (threshold === '3g') {
        slowNetworks.push('3g')
      }
      
      setShouldRender(!slowNetworks.includes(networkSpeed))
    }
  }, [threshold])

  return shouldRender ? <>{children}</> : <>{fallback}</>
}