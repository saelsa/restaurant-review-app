//Service Worker
//https://developers.google.com/web/fundamentals/primers/service-workers/

var CACHE_NAME = 'restaurant-review-cache-v1';
var urlsToCache = [
  '/',
  '/index.html',
  '/restaurant.html',
  '/css/styles.css',
  '/data/restaurants.json',
  '/js/main.js',
  '/js/dbhelper.js',
  '/js/restaurant_info.js'


];

self.addEventListener('install', function (event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(function (cache) {
      console.log('[ServiceWorker] Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', function(event) {
  //Activate service Worker and removing old cache
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});



self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        //  Clone the request
        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. 
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});
