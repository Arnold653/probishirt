// Service worker Probishirt — mise en cache pour un accès rapide et hors-ligne
const CACHE_NAME = "probishirt-v12";
const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./collection.html",
  "./produit.html",
  "./apropos.html",
  "./contact.html",
  "./panier.html",
  "./404.html",
  "./css/style.css",
  "./js/products.js",
  "./js/products-loader.js",
  "./js/cart.js",
  "./js/app.js",
  "./js/product-page.js",
  "./js/cart-page.js",
  "./manifest.json",
  "./assets/brand/logo.png",
  "./assets/brand/icons/icon-192.png",
  "./assets/brand/icons/icon-512.png",
  "./assets/products/sagesse-divine-black.jpg",
  "./assets/products/kd-kingdom-blue.jpg",
  "./assets/products/kd-kingdom-white.jpg",
  "./assets/products/guard-heart-black.jpg",
  "./assets/products/guard-heart-blue.jpg",
  "./assets/products/esprit-songes-white.jpg",
  "./assets/products/esprit-songes-yellow.jpg",
  "./assets/products/intelligence-siecles-white.jpg",
  "./assets/products/sagesse-haut-black.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  const isStaticAsset = url.pathname.startsWith("/assets/");

  if (isStaticAsset) {
    // Images : cache d'abord (elles changent rarement), réseau en secours.
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // Pages, CSS, JS : toujours le réseau en priorité pour ne jamais
  // servir une version périmée du site. Le cache ne sert que hors-ligne.
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
