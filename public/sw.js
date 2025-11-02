// Service Worker with safe caching strategy
const CACHE_NAME = 'siwa-v2';
const CRITICAL_RESOURCES = [
  '/',
  '/siwa-oasis-sunset-salt-lakes-reflection.jpg',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap'
];

// Paths that should never be cached (auth and sensitive pages)
const NO_CACHE_PATHS = [
  /^\/api\//,
  /^\/login$/,
  /^\/register$/,
  /^\/forgot-password/,
  /^\/verify/,
];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(CRITICAL_RESOURCES);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event - smart strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== 'GET') return;
  // Skip non-HTTP
  if (!request.url.startsWith('http')) return;

  const url = new URL(request.url);
  const isSameOrigin = url.origin === self.location.origin;
  const path = url.pathname;

  // Do not cache auth-related and API requests
  if (NO_CACHE_PATHS.some((re) => re.test(path))) {
    event.respondWith(fetch(request, { cache: 'no-store' }));
    return;
  }

  // Navigations (HTML documents): network-first, don't cache navigations
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request, { cache: 'no-store' })
        .then((response) => response)
        .catch(() => caches.match('/'))
    );
    return;
  }

  // For other assets: cache-first, but avoid caching non-cacheable responses
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((networkResp) => {
        try {
          const shouldCache =
            networkResp &&
            networkResp.status === 200 &&
            !/no-store|private/i.test(networkResp.headers.get('Cache-Control') || '') &&
            (isSameOrigin || url.origin === 'https://fonts.googleapis.com');

          if (shouldCache) {
            const clone = networkResp.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, clone);
            });
          }
        } catch (_) {}
        return networkResp;
      });
    })
  );
});