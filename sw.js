self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('route-optimizer-v1').then(cache => {
            return cache.addAll([
                '/',
                '/index.html',
                '/style.css',
                '/app.js',
                'https://unpkg.com/leaflet/dist/leaflet.js'
            ]);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
