// service-worker.js
const CACHE_NAME = 'space-farm-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.js',
  '/src/scenes/MenuScene.js',
  '/src/scenes/GameScene.js',
  '/src/scenes/CreditsScene.js',
  '/src/classes/Player.js',
  '/src/classes/SaveState.js',
  // Add other game assets here
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});