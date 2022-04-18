const APP_PREFIX = 'FoodFest-';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;


// define which files we'd like to cache
const FILES_TO_CACHE = [
    "./index.html",
    "./events.html",
    "./tickets.html",
    "./schedule.html",
    "./assets/css/style.css",
    "./assets/css/bootstrap.css",
    "./assets/css/tickets.css",
    "./dist/app.bundle.js",
    "./dist/events.bundle.js",
    "./dist/tickets.bundle.js",
    "./dist/schedule.bundle.js"
];

self.addEventListener('fetch', function (e) {

    console.log('fetch request : ' + e.request.url)

    // 'respondWith' to intercept the fetch request
    e.respondWith(
        caches.match(e.request).then(function (request) {
            if (request) { // if cache is available, respond with cache
                console.log('responding with cache : ' + e.request.url)
                return request
            }
            else { // if there are no cache, try fetching request
                console.log('file is not cached, fetching : ' + e.request.url)
                return fetch(e.request)
            }
        })

    )
});

// service workers run before the window object has even been created
//  - so instead we use the 'self' keyword to instantiate listeners on the service worker
//      - the context of 'self' here refers to the service worker object
self.addEventListener('install', function (e) {
    // we use the 'e.waitUntil' to tell the browser to wait until the work is complete before terminating the service worker
    //  - ensures that the service worker doesn't move on from the 'installing' phase until it's finished executing all of its code
    e.waitUntil(
        // we use 'caches.open' to find the specific cache by name
        //  - .then({}) add every file in the 'FILES_TO_CACHE' array to the cache
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('installing cache : ' + CACHE_NAME)
            return cache.addAll(FILES_TO_CACHE)
        })
    )
});

self.addEventListener('activate', function (e) {
    e.waitUntil(
        // 'keys()' returns an array of all cache names, which we're calling 'keyList'
        //  - keyList; is a parameter that contains all cache names under 'perfect-perfect.github.io'
        caches.keys().then(function (keyList) {
            // because we may host many sites from the same URL, we should filter out caches that have the app prefix
            let cacheKeeplist = keyList.filter(function (key) {
                return key.indexOf(APP_PREFIX);
            });
            // add the current cache to the keeplist
            // remember that we set up CACHE_NAME as a global constant to help keep track of which cache to use.
            cacheKeeplist.push(CACHE_NAME);

            return Promise.all(
                keyList.map(function(key, i) {
                    if (cacheKeeplist.indexOf(key) === -1) {
                        console.log('deleting cache : ' + keyList[i]);
                        return caches.delete(keyList[i]);

                    }
                })
            )

        })
    )
})

