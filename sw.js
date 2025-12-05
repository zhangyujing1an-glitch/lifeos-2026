const CACHE_NAME = 'lifeos-v9-absolute-clean';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  '[https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.js](https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.js)',
  '[https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js](https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js)',
  '[https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js](https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js)',
  '[https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.5/babel.min.js](https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.5/babel.min.js)',
  '[https://unpkg.com/lucide-react@0.263.1/dist/umd/lucide-react.min.js](https://unpkg.com/lucide-react@0.263.1/dist/umd/lucide-react.min.js)'
];

// 安装：立即接管
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching core assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 激活：清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Cleaning old cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 请求：网络优先，失败则读缓存
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(event.request))
  );
});
