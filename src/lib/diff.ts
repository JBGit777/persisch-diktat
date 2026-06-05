/**
 * Zeichengenauer Vergleich zweier persischer Texte für den Diktat-Modus.
 * Liefert eine ausrichtbare Segmentliste für die farbliche Markierung sowie
 * eine Genauigkeit (0–1) auf Basis der Levenshtein-Distanz.
 *
 * Reines Modul ohne UI-Bezug, damit es wiederverwendbar und testbar bleibt.
 *
 * WICHTIG: Beide Seiten werden vor dem Vergleich durch `normalizeFa()`
 * geschickt (arab./pers. Ye+Kaf, Harakat, Tatweel, Ziffern, ZWNJ …), damit
 * orthografisch gleichwertige Eingaben nicht als Fehler gewertet werden.
 */

import { normalizeFa } from "@/lib/normalizeFa";

export type SegmentTyp = "korrekt" | "falsch" | "fehlt" | "zuviel";

export interface DiffSegment {
  typ: SegmentTyp;
  /** Erwartetes Zeichen (bei "korrekt", "falsch", "fehlt"). */
  erwartet?: string;
  /** Eingegebenes Zeichen (bei "korrekt", "falsch", "zuviel"). */
  eingabe?: string;
}

export interface VergleichsErgebnis {
  korrekt: boolean;
  /** Anteil korrekter Zeichen, 0–1. */
  genauigkeit: number;
  segmente: DiffSegment[];
}

/**
 * Normalisiert für den Vergleich. Zentrale Persisch-Normalisierung
 * (`normalizeFa`) plus NFC/Trim – wird auf BEIDE Vergleichsseiten angewandt.
 */
function normalisiere(s: string): string {
  return normalizeFa(s);
}

/** Zerlegt in Grapheme (persische Buchstaben sind je ein Code Point). */
function zeichen(s: string): string[] {
  return Array.from(s);
}

function levenshtein(a: string[], b: string[]): number {
  const m = a.length;
  const n = b.length;
  const d = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const kosten = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + kosten);
    }
  }
  return d[m][n];
}

/**
 * Längste gemeinsame Teilfolge -> Edit-Skript, das erwartet/eingabe ausrichtet.
 */
function richteAus(a: string[], b: string[]): DiffSegment[] {
  const m = a.length;
  const n = b.length;
  // LCS-Längentabelle
  const lcs = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      lcs[i][j] = a[i] === b[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }

  const segmente: DiffSegment[] = [];
  let i = 0;
  let j = 0;
  while (i < m && j < n) {
    if (a[i] === b[j]) {
      segmente.push({ typ: "korrekt", erwartet: a[i], eingabe: b[j] });
      i++;
      j++;
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
      // Erwartetes Zeichen fehlt in der Eingabe -> später als "falsch"/"fehlt"
      // Wenn direkt ein eingegebenes Zeichen folgt, behandeln wir es als Ersetzung.
      segmente.push({ typ: "fehlt", erwartet: a[i] });
      i++;
    } else {
      segmente.push({ typ: "zuviel", eingabe: b[j] });
      j++;
    }
  }
  while (i < m) segmente.push({ typ: "fehlt", erwartet: a[i++] });
  while (j < n) segmente.push({ typ: "zuviel", eingabe: b[j++] });

  // "fehlt" direkt gefolgt von "zuviel" zu einer "falsch"-Ersetzung verschmelzen.
  const verschmolzen: DiffSegment[] = [];
  for (let k = 0; k < segmente.length; k++) {
    const cur = segmente[k];
    const next = segmente[k + 1];
    if (cur.typ === "fehlt" && next && next.typ === "zuviel") {
      verschmolzen.push({ typ: "falsch", erwartet: cur.erwartet, eingabe: next.eingabe });
      k++;
    } else {
      verschmolzen.push(cur);
    }
  }
  return verschmolzen;
}

export function vergleiche(erwartetRoh: string, eingabeRoh: string): VergleichsErgebnis {
  const erwartet = normalisiere(erwartetRoh);
  const eingabe = normalisiere(eingabeRoh);
  const a = zeichen(erwartet);
  const b = zeichen(eingabe);

  const segmente = richteAus(a, b);
  const distanz = levenshtein(a, b);
  const maxLen = Math.max(a.length, b.length) || 1;
  const genauigkeit = Math.max(0, 1 - distanz / maxLen);

  return {
    korrekt: erwartet === eingabe,
    genauigkeit,
    segmente,
  };
}
