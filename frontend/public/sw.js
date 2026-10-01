// Minimal Service Worker to enable PWA installation
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Do nothing, let the browser handle requests normally.
  // This listener is required by Chrome to trigger the "Install App" prompt.
});
