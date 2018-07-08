//Service Worker
//https://developers.google.com/web/fundamentals/primers/service-workers/

var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
  '/',
    'restaurant.html',
  'css/styles.css',
  'data/restaurants.json',
    'js/main.js',
    'js/dbhelper.js',
    'js/restaurant_info.js'


];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});


