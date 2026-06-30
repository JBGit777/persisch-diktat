"use client";

import { useEffect } from "react";

/**
 * Registriert den Basis-PWA Service Worker (public/sw.js) für Offline-Audio
 * und schnelles Laden. Auf localhost bewusst deaktiviert, damit die lokale
 * Entwicklung (HMR) nicht durch Caching gestört wird.
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (
      typeof navigator !== "undefined" &&
      "serviceWorker" in navigator &&
      location.hostname !== "localhost" &&
      location.hostname !== "127.0.0.1"
    ) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);
  return null;
}
