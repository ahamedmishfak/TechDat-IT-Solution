/* TechDat IT Solutions — service worker
   Cache-first for assets, network-first for pages, offline fallback. */
const VERSION = 'techdat-v2';
const CORE = [
  'index.html', 'shop.html', 'phones.html', 'laptops.html', 'computers.html',
  'accessories.html', 'services.html', 'projects.html', 'about.html',
  'contact.html', 'faqs.html', 'offline.html', '404.html',
  'assets/css/app.css', 'assets/js/app.js',
  'assets/icons/icon-192.png', 'assets/icons/logo.svg', 'manifest.webmanifest'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(VERSION)
      .then((c) => c.addAll(CORE))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // let CDN fonts go straight through

  // Pages: network first so content stays fresh, cache as backup.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((hit) => hit || caches.match('offline.html')))
    );
    return;
  }

  // Assets: cache first.
  e.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(VERSION).then((c) => c.put(req, copy));
      return res;
    }))
  );
});
