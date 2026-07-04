/**
 * Persische Fehler-Taxonomie für den Diktat-Modus.
 *
 * Ordnet die Abweichungen eines Zeichenvergleichs (DiffSegment[]) systematischen
 * Fehlerklassen zu – vor allem den typischen **homophonen** Buchstabengruppen,
 * die man beim Hördiktat verwechselt (س/ص/ث, ت/ط, ز/ذ/ض/ظ …), sowie visuellen
 * Punkt-Verwechslungen (ب/پ/ت/ث/ن …). Daraus lässt sich über viele Versuche eine
 * persönliche Schwächenkarte aggregieren.
 *
 * Rein & ohne Seiteneffekte – wird sowohl clientseitig (beim Speichern eines
 * Versuchs) als auch serverseitig (Aggregation) verwendet.
 */
import type { DiffSegment } from "@/lib/diff";

export type Fehler =
  | { art: "konfusion"; gruppe: string; paar: string; erwartet: string; eingabe: string }
  | { art: "ausgelassen"; erwartet: string }
  | { art: "zuviel"; eingabe: string };

/** Buchstabengruppen: die erste, die BEIDE Zeichen enthält, gewinnt. */
const GRUPPEN: { name: string; chars: string }[] = [
  { name: "S-Laute (س/ص/ث)", chars: "سصث" },
  { name: "T-Laute (ت/ط)", chars: "تط" },
  { name: "Z-Laute (ز/ذ/ض/ظ)", chars: "زذضظ" },
  { name: "H-Laute (ه/ح)", chars: "هح" },
  { name: "Gh/Q-Laute (ق/غ)", chars: "قغ" },
  { name: "Alef (ا/آ)", chars: "اآ" },
  { name: "Kehllaute (ع/ء/ا)", chars: "عءا" },
  { name: "Punkt-Reihe (ب/پ/ت/ث/ن/ی)", chars: "بپتثنی" },
  { name: "ج/چ/ح/خ", chars: "جچحخ" },
  { name: "د/ذ", chars: "دذ" },
  { name: "ر/ز/ژ", chars: "رزژ" },
  { name: "ک/گ", chars: "کگ" },
  { name: "ف/ق", chars: "فق" },
  { name: "س/ش", chars: "سش" },
  { name: "و-Laute (و: u/o/v)", chars: "و" },
];

function gruppeFuer(a: string, b: string): string | null {
  for (const g of GRUPPEN) {
    if (g.chars.includes(a) && g.chars.includes(b)) return g.name;
  }
  return null;
}

/** Stabiler, richtungsunabhängiger Schlüssel „ص↔س" für die Aggregation. */
export function paarSchluessel(a: string, b: string): string {
  return [a, b].sort().join("↔");
}

/** Klassifiziert die Abweichungen eines Vergleichs zu Fehler-Objekten. */
export function analysiereFehler(segmente: DiffSegment[]): Fehler[] {
  const out: Fehler[] = [];
  for (const s of segmente) {
    if (s.typ === "falsch" && s.erwartet && s.eingabe) {
      // Nur echte Einzelzeichen-Verwechslungen sauber klassifizieren.
      const e = [...s.erwartet];
      const i = [...s.eingabe];
      if (e.length === 1 && i.length === 1) {
        const gruppe = gruppeFuer(e[0], i[0]) ?? "sonstige Verwechslung";
        out.push({
          art: "konfusion",
          gruppe,
          paar: paarSchluessel(e[0], i[0]),
          erwartet: e[0],
          eingabe: i[0],
        });
      } else {
        out.push({ art: "konfusion", gruppe: "sonstige Verwechslung", paar: `${s.erwartet}↔${s.eingabe}`, erwartet: s.erwartet, eingabe: s.eingabe });
      }
    } else if (s.typ === "fehlt" && s.erwartet) {
      out.push({ art: "ausgelassen", erwartet: s.erwartet });
    } else if (s.typ === "zuviel" && s.eingabe) {
      out.push({ art: "zuviel", eingabe: s.eingabe });
    }
  }
  return out;
}

export interface SchwaechenEintrag {
  gruppe: string;
  paar: string; // z. B. „ص↔س"
  anzahl: number;
}

/**
 * Aggregiert viele Fehler zu den häufigsten Verwechslungen (absteigend).
 * Ausgelassene/überzählige Zeichen fließen separat ein.
 */
export function fasseSchwaechen(alle: Fehler[]): {
  verwechslungen: SchwaechenEintrag[];
  ausgelassen: number;
  zuviel: number;
} {
  const map = new Map<string, SchwaechenEintrag>();
  let ausgelassen = 0;
  let zuviel = 0;
  for (const f of alle) {
    if (f.art === "konfusion") {
      const key = `${f.gruppe}|${f.paar}`;
      const cur = map.get(key);
      if (cur) cur.anzahl++;
      else map.set(key, { gruppe: f.gruppe, paar: f.paar, anzahl: 1 });
    } else if (f.art === "ausgelassen") ausgelassen++;
    else zuviel++;
  }
  const verwechslungen = [...map.values()].sort((a, b) => b.anzahl - a.anzahl);
  return { verwechslungen, ausgelassen, zuviel };
}
