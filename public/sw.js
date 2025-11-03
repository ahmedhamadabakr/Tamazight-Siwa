// This file is intentionally left blank to disable the service worker for debugging.
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  self.clients.claim();
  caches.keys().then(keys => {
    keys.forEach(key => caches.delete(key));
  });
});

self.addEventListener('fetch', () => {
  // Do nothing, just fetch from network
  return;
});