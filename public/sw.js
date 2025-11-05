// Service Worker for mobile performance optimization
const CACHE_NAME = 'siwa-v1'
const STATIC_CACHE = 'siwa-static-v1'
const DYNAMIC_CACHE = 'siwa-dynamic-v1'

// Critical resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/tours',
  '/gallery',
  '/contact',
  '/manifest.json',
  '/offline.html'
]

// Install event - cache critical resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => self.skipWaiting())
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE)
            .map(cacheName => caches.delete(cacheName))
        )
      })
      .then(() => self.clients.claim())
  )
})

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') return

  // Skip external requests
  if (url.origin !== location.origin) return

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cache successful API responses for 5 minutes
          if (response.ok) {
            const responseClone = response.clone()
            caches.open(DYNAMIC_CACHE)
              .then(cache => {
                cache.put(request, responseClone)
                // Auto-delete after 5 minutes
                setTimeout(() => {
                  cache.delete(request)
                }, 5 * 60 * 1000)
              })
          }
          return response
        })
        .catch(() => {
          // Return cached version if available
          return caches.match(request)
        })
    )
    return
  }

  // Handle static assets and pages
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // Return cached version immediately
          return cachedResponse
        }

        // Fetch from network
        return fetch(request)
          .then(response => {
            // Don't cache error responses
            if (!response.ok) {
              return response
            }

            const responseClone = response.clone()
            
            // Cache images and fonts for longer
            if (request.destination === 'image' || request.destination === 'font') {
              caches.open(STATIC_CACHE)
                .then(cache => cache.put(request, responseClone))
            } else {
              // Cache other resources in dynamic cache
              caches.open(DYNAMIC_CACHE)
                .then(cache => cache.put(request, responseClone))
            }

            return response
          })
          .catch(() => {
            // Return offline page for navigation requests
            if (request.mode === 'navigate') {
              return caches.match('/offline.html')
            }
            return new Response('Offline', { status: 503 })
          })
      })
  )
})

// Background sync for form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'contact-form') {
    event.waitUntil(syncContactForm())
  }
})

async function syncContactForm() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE)
    const requests = await cache.keys()
    
    for (const request of requests) {
      if (request.url.includes('/api/contact') && request.method === 'POST') {
        try {
          await fetch(request)
          await cache.delete(request)
        } catch (error) {
          console.log('Failed to sync contact form:', error)
        }
      }
    }
  } catch (error) {
    console.log('Background sync failed:', error)
  }
}

// Push notifications (future feature)
self.addEventListener('push', event => {
  if (!event.data) return

  const data = event.data.json()
  const options = {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: data.primaryKey
    },
    actions: [
      {
        action: 'explore',
        title: 'View Tours',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/xmark.png'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close()

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/tours')
    )
  }
})