---
layout: null
---

var urlsToCache = [
   '/',
  '/css/main.css',
  '/js/index.js'


];

// Cache posts
// Limits the number of posts that gets cached to 3
// Reads a piece of front-matter in each post that directs the second loop to the folder where the assets are held
{% for post in site.posts limit: 3 %}
    urlsToCache.push("{{ post.url }}");
    {% for file in site.static_files %}
        {% if file.path contains post.assets %}
            urlsToCache.push("{{ file.path }}");
        {% endif %}
    {% endfor %}
{% endfor %}

var CACHE_NAME = 'gdr-verderena-{{ site.time }}';

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                 console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.match(event.request).then(function (response) {
                return response || fetch(event.request).then(function (response) {
                    cache.put(event.request, response.clone());
                    return response;
                });
            });
        })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.open(CACHE_NAME).then(function (cache) {
            return fetch(event.request).then(function (response) {
                cache.put(event.request, response.clone());
                return response;
            });
        })
    );
});
