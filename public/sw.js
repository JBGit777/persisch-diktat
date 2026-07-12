/* Persisch-Diktat – Basis-PWA Service Worker.
 * Strategie:
 *  - Statische Assets (Audio /tts, /_next/static, Icons, Fonts): cache-first,
 *    dauerhaft gecacht → Audio & App-Shell laufen offline und laden sofort.
 *  - Seiten-Navigationen: network-first mit Cache-Fallback → schon besuchte
 *    Seiten sind offline verfügbar.
 *  - Supabase-/API-Aufrufe (andere Origin, POST): NICHT gecacht (Daten kommen
 *    beim ersten Laden aus dem Netz).
 *
 * WICHTIG (Audio auf iOS/Safari): <audio> lädt Mediendateien per Range-Request
 * und der Server antwortet mit `206 Partial Content`. Eine solche TEIL-Antwort
 * darf NICHT als Vollkopie gecacht werden – sonst spielt die Datei später
 * abgeschnitten (verschluckter Satzanfang). Darum:
 *   - Es wird immer die VOLLE Datei (Status 200) gecacht.
 *   - Range-Requests werden aus dieser Vollkopie korrekt zugeschnitten (206).
 */
const STATIC = "pd-static-v2";
const PAGES = "pd-pages-v1";

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Alte Caches (inkl. evtl. mit Teil-Antworten verunreinigtem v1) löschen.
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

/** Baut aus einer vollständigen (200) Antwort eine korrekte 206-Teilantwort. */
async function teilAntwort(vollResp, rangeHeader) {
  const buf = await vollResp.clone().arrayBuffer();
  const total = buf.byteLength;
  const m = /bytes=(\d*)-(\d*)/.exec(rangeHeader || "");
  let start = m && m[1] ? parseInt(m[1], 10) : 0;
  let end = m && m[2] ? parseInt(m[2], 10) : total - 1;
  if (isNaN(start)) start = 0;
  if (isNaN(end) || end >= total) end = total - 1;
  if (start > end || start >= total) {
    return new Response(null, {
      status: 416,
      headers: { "Content-Range": `bytes */${total}` },
    });
  }
  const chunk = buf.slice(start, end + 1);
  const headers = new Headers();
  headers.set("Content-Range", `bytes ${start}-${end}/${total}`);
  headers.set("Accept-Ranges", "bytes");
  headers.set("Content-Length", String(chunk.byteLength));
  const ct = vollResp.headers.get("Content-Type");
  if (ct) headers.set("Content-Type", ct);
  return new Response(chunk, { status: 206, statusText: "Partial Content", headers });
}

/** Volle Datei (Status 200) holen und im Cache ablegen. */
async function holeUndCacheVoll(cache, url) {
  const netFull = await fetch(url.href); // frischer Request → ohne Range-Header
  if (netFull && netFull.status === 200) {
    await cache.put(url.pathname, netFull.clone());
  }
  return netFull;
}

async function handleStatisch(req, url) {
  const cache = await caches.open(STATIC);
  const range = req.headers.get("range");

  if (range) {
    // Range: aus der Vollkopie bedienen (nie eine Teil-Antwort cachen).
    let voll = await cache.match(url.pathname);
    if (!voll || voll.status !== 200) {
      try {
        voll = await holeUndCacheVoll(cache, url);
      } catch (e) {
        try {
          return await fetch(req); // letzter Ausweg: Original-Range ans Netz
        } catch {
          return Response.error();
        }
      }
    }
    if (voll && voll.status === 200) return teilAntwort(voll, range);
    return voll || Response.error();
  }

  // Kein Range: cache-first, aber nur VOLLE (200) Antworten ablegen.
  const hit = await cache.match(url.pathname);
  if (hit) return hit;
  try {
    const resp = await fetch(req);
    if (resp && resp.status === 200) cache.put(url.pathname, resp.clone());
    return resp;
  } catch (e) {
    return hit || Response.error();
  }
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Nur same-origin behandeln (Supabase & Co. unangetastet lassen).
  if (url.origin !== self.location.origin) return;

  if (istStatisch(url)) {
    event.respondWith(handleStatisch(req, url));
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
