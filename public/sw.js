/* Persisch-Diktat – Basis-PWA Service Worker.
 * Strategie:
 *  - Statische Assets (Audio /tts, /_next/static, Icons, Fonts): cache-first,
 *    dauerhaft gecacht → Audio & App-Shell laufen offline und laden sofort.
 *  - Seiten-Navigationen: network-first mit Cache-Fallback → schon besuchte
 *    Seiten sind offline verfügbar.
 *  - Supabase-/API-Aufrufe (andere Origin, POST): NICHT gecacht (Daten kommen
 *    beim ersten Laden aus dem Netz).
 */
const STATIC = "pd-static-v1";
const PAGES = "pd-pages-v1";

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => k !== STATIC && k !== PAGES).map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

function istStatisch(url) {
  return (
    url.pathname.startsWith("/tts/") ||
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icon") ||
    url.pathname === "/manifest.webmanifest" ||
    /\.(mp3|woff2?|ttf|png|jpg|jpeg|svg|webp|css|js)$/.test(url.pathname)
  );
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Nur same-origin behandeln (Supabase & Co. unangetastet lassen).
  if (url.origin !== self.location.origin) return;

  if (istStatisch(url)) {
    event.respondWith(
      caches.open(STATIC).then(async (cache) => {
        const hit = await cache.match(req);
        if (hit) return hit;
        try {
          const resp = await fetch(req);
          if (resp && resp.ok) cache.put(req, resp.clone());
          return resp;
        } catch (e) {
          return hit || Response.error();
        }
      })
    );
    return;
  }

  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const resp = await fetch(req);
          const cache = await caches.open(PAGES);
          cache.put(req, resp.clone());
          return resp;
        } catch (e) {
          const cache = await caches.open(PAGES);
          const cached = await cache.match(req);
          return cached || (await cache.match("/")) || Response.error();
        }
      })()
    );
  }
});
