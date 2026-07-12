import { normalizeFa } from "@/lib/normalizeFa";

/**
 * FNV-1a 64-bit (Hex) über die UTF-8-Bytes des Strings.
 * MUSS identisch zu `scripts/generate_tts.py` (fnv1a64) sein, damit Client und
 * Generator denselben Dateinamen für dasselbe Wort bilden.
 */
function fnv1a64(s: string): string {
  let h = 14695981039346656037n;
  const bytes = new TextEncoder().encode(s);
  for (let i = 0; i < bytes.length; i++) {
    h ^= BigInt(bytes[i]);
    h = (h * 1099511628211n) & 0xffffffffffffffffn;
  }
  return h.toString(16).padStart(16, "0");
}

/**
 * Pfad zur vorab erzeugten persischen TTS-Audiodatei für `text`.
 * Inhaltsadressiert über `normalizeFa(text)` → gleiche Aussprache-Variante
 * (mit/ohne ZWNJ, arab./pers. Ye …) teilt sich dieselbe Datei.
 */
export function audioPfad(text: string): string {
  return `/tts/${fnv1a64(normalizeFa(text))}.mp3`;
}

/**
 * Deutsche Normalisierung fürs Hörmodus-Audio (Übersetzung).
 * MUSS identisch zu `normalize_de()` in `scripts/generate_tts.py` sein.
 */
function normalizeDe(s: string): string {
  return s.normalize("NFC").replace(/\s+/g, " ").trim();
}

/**
 * Pfad zur vorab erzeugten **deutschen** TTS-Audiodatei (de-DE) für `text`.
 * Eigener Namensraum `/tts/de/…`, damit im Hörmodus die Übersetzung als echte
 * MP3 läuft – auch im Hintergrund / bei gesperrtem Bildschirm.
 */
export function audioPfadDe(text: string): string {
  return `/tts/de/${fnv1a64(normalizeDe(text))}.mp3`;
}
