const CACHE_NAME = 'lifeos-v3-stable';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  '[https://cdn.tailwindcss.com](https://cdn.tailwindcss.com)',
  '[https://unpkg.com/react@18.2.0/umd/react.development.js](https://unpkg.com/react@18.2.0/umd/react.development.js)',
  '[https://unpkg.com/react-dom@18.2.0/umd/react-dom.development.js](https://unpkg.com/react-dom@18.2.0/umd/react-dom.development.js)',
  '[https://unpkg.com/@babel/standalone/babel.min.js](https://unpkg.com/@babel/standalone/babel.min.js)',
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

// 请求：网络优先，失败则读缓存（增强稳定性）
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(event.request))
  );
});
