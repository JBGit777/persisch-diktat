import type { ReviewState, VocabItem } from "@/lib/types";
import { auswahlScore } from "@/lib/srs";

/** Diktat-Zieltext: einzelnes Wort oder ganzer Beispielsatz. */
export type Zielmodus = "wort" | "satz";

/** Eine Vokabel inkl. ihres Wiederholungs-Zustands für eine Sitzung. */
export interface SitzungsKarte {
  id: string;
  hangul: string;
  romanisierung: string | null;
  deutsch: string;
  beispielsatz_ko: string | null;
  beispielsatz_de: string | null;
  hinweis: string | null;
  haeufigkeit: number | null;
  review: Pick<
    ReviewState,
    "ease_factor" | "intervall" | "wiederholungen" | "naechste_faelligkeit"
  > | null;
}

/** Hat die Karte einen verwendbaren persischen Beispielsatz? */
export function hatSatz(karte: SitzungsKarte): boolean {
  return !!karte.beispielsatz_ko?.trim();
}

/**
 * Zerlegt das `hinweis`-Feld in den (prominent anzeigbaren) Präsensstamm und
 * den restlichen Hinweistext. Im Seed steht der Stamm – falls vorhanden – am
 * Anfang als „Präsensstamm: <stamm>. <rest>".
 */
export function parseHinweis(hinweis: string | null): {
  stamm: string | null;
  rest: string | null;
} {
  if (!hinweis) return { stamm: null, rest: null };
  const m = hinweis.match(/^Präsensstamm:\s*([^.]+)\.\s*([\s\S]*)$/);
  if (m) return { stamm: m[1].trim(), rest: m[2].trim() || null };
  return { stamm: null, rest: hinweis.trim() || null };
}

/**
 * Der persische Text, der diktiert und verglichen wird.
 * - `wort`: immer das Vokabel.
 * - `satz`: der Beispielsatz, falls vorhanden, sonst Rückfall aufs Wort.
 * Hinweis: Das Supabase-Schema bleibt unverändert (Auftrag) – die Spalten
 * `hangul` und `beispielsatz_ko` halten hier den persischen Wortlaut bzw.
 * Beispielsatz.
 */
export function zielText(karte: SitzungsKarte, modus: Zielmodus = "satz"): string {
  if (modus === "wort") return karte.hangul;
  return karte.beispielsatz_ko?.trim() || karte.hangul;
}

/** Die deutsche Bedeutung/Übersetzung zum aktuellen Zieltext. */
export function bedeutung(karte: SitzungsKarte, modus: Zielmodus = "satz"): string {
  if (modus === "satz" && hatSatz(karte)) {
    return karte.beispielsatz_de ?? karte.deutsch;
  }
  return karte.deutsch;
}

/**
 * Kombinierter Auswahl-Score (kleiner = höhere Priorität):
 * SRS-Dringlichkeit (fällig/schwach) plus Häufigkeits-Gewichtung
 * (häufige Wörter bevorzugt, seltene zurückgestellt).
 */
function kartenScore(karte: SitzungsKarte, jetzt: Date): number {
  const srs = auswahlScore(karte.review, jetzt);
  const h = karte.haeufigkeit ?? 3;
  // Tier 5 -> Bonus (−3), Tier 1 -> Malus (+3). Faktor 1.5 pro Stufe.
  return srs - (h - 3) * 1.5;
}

/**
 * Wählt und sortiert die Karten einer Sitzung: fällige/schwache und häufige zuerst.
 */
export function waehleSitzung(
  vokabeln: VocabItem[],
  reviewMap: Map<string, SitzungsKarte["review"]>,
  anzahl: number,
  jetzt: Date = new Date()
): SitzungsKarte[] {
  const karten: SitzungsKarte[] = vokabeln.map((v) => ({
    id: v.id,
    hangul: v.hangul,
    romanisierung: v.romanisierung,
    deutsch: v.deutsch,
    beispielsatz_ko: v.beispielsatz_ko,
    beispielsatz_de: v.beispielsatz_de,
    hinweis: v.hinweis,
    haeufigkeit: v.haeufigkeit,
    review: reviewMap.get(v.id) ?? null,
  }));

  karten.sort((a, b) => kartenScore(a, jetzt) - kartenScore(b, jetzt));
  return karten.slice(0, Math.max(1, anzahl));
}
