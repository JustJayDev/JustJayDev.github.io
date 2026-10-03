/*
 * Service worker for justjaydev-v1.
 *
 * Strategy, chosen so a redeploy is never hidden by a stale cache:
 *
 *   HTML pages  -> NETWORK FIRST. Always try the network, fall back to cache
 *                  only when offline. A new deploy shows up immediately.
 *   Hashed assets -> CACHE FIRST. Their filename changes when content changes,
 *                  so a cached copy can never be wrong.
 *   sw.js itself -> NEVER cached, so a new worker takes over immediately.
 *
 * The version string below is bumped on every release to drop old caches.
 */
const VERSION = 'v1.2.0'
const SHELL = 'jj-shell-' + VERSION
const ASSETS = 'jj-assets-' + VERSION

/* pre-cached on install: the things needed to open the app offline */
const PRECACHE = [
  '/',
  '/projects/',
  '/games/',
  '/devlog/',
  '/lab/',
  '/about/',
  '/links/',
  '/manifest.webmanifest',
  '/icon-192.png',
  '/jj-mark.svg',
  '/offline.html',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL)
      /* addAll fails the whole install if any single file 404s, so each is
         added independently and a miss is tolerated */
      .then((cache) =>
        Promise.all(
          PRECACHE.map((url) =>
            cache.add(new Request(url, { cache: 'reload' })).catch(() => {}),
          ),
        ),
      )
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== SHELL && k !== ASSETS)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

function isAsset(url) {
  return (
    url.pathname.includes('/assets/') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.ico') ||
    url.pathname.endsWith('.webmanifest') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.woff2')
  )
}

self.addEventListener('fetch', (event) => {
  const req = event.request

  /* only GET, and never touch the assistant Worker - it must stay live */
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return

  /* the worker script itself must always come from the network */
  if (url.pathname.endsWith('/sw.js')) return

  if (isAsset(url)) {
    event.respondWith(
      caches.open(ASSETS).then(async (cache) => {
        const hit = await cache.match(req)
        if (hit) return hit
        try {
          const res = await fetch(req)
          if (res && res.status === 200) cache.put(req, res.clone())
          return res
        } catch {
          return hit || Response.error()
        }
      }),
    )
    return
  }

  /* HTML: network first so a fresh deploy always wins */
  if (req.mode === 'navigate' || req.destination === 'document') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone()
            caches.open(SHELL).then((c) => c.put(req, copy))
          }
          return res
        })
        .catch(async () => {
          const hit = await caches.match(req)
          if (hit) return hit
          const offline = await caches.match('/offline.html')
          if (offline) return offline
          return new Response('Offline', {
            status: 503,
            headers: { 'Content-Type': 'text/plain' },
          })
        }),
    )
  }
})