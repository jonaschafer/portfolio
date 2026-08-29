// Minimal offline cache for /mma/map — a bedside reference that needs to keep
// working with no signal. Stale-while-revalidate: serve from cache instantly
// when available, and refresh the cache in the background on every request.
const CACHE_NAME = 'mma-recovery-map-v1'

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(event.request)
      const network = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            cache.put(event.request, response.clone())
          }
          return response
        })
        .catch(() => cached)
      return cached || network
    })
  )
})
