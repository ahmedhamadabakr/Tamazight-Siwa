const CACHE_NAME = 'siwa-v2';
const CRITICAL_RESOURCES = [
  '/',
  '/siwa-oasis-sunset-salt-lakes-reflection.jpg',
];

const NO_CACHE_PATHS = [
  /^\/api\//,
  /^\/login$/,
  /^\/register$/,
  /^\/forgot-password/,
  /^\/verify/,
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CRITICAL_RESOURCES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.map((n) => n !== CACHE_NAME && caches.delete(n)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || !request.url.startsWith('http')) return;

  const url = new URL(request.url);
  const isSameOrigin = url.origin === self.location.origin;
  const path = url.pathname;

  if (url.protocol === 'chrome-extension:' || url.protocol === 'blob:') return;
  if (NO_CACHE_PATHS.some((re) => re.test(path))) return;

  // Navigations
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      (async () => {
        try {
          const netRes = await fetch(request);
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, netRes.clone());
          return netRes;
        } catch {
          return (await caches.match(request)) || (await caches.match('/'));
        }
      })()
    );
    return;
  }

  // Static assets (same-origin or fonts.googleapis.com)
  if (!isSameOrigin && url.origin !== 'https://fonts.googleapis.com') return;

  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;

    try {
      const netRes = await fetch(request);
      const cacheable =
        netRes &&
        netRes.status === 200 &&
        !/no-store|private/i.test(netRes.headers.get('Cache-Control') || '') &&
        (isSameOrigin || url.origin === 'https://fonts.googleapis.com');

      if (cacheable) {
        const clone = netRes.clone();
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, clone);
      }

      return netRes;
    } catch {
      return cached || new Response('Offline or CSP blocked this request', {
        status: 504,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
  })());
});
