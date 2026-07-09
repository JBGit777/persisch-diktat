import { normalizeFa } from "@/lib/normalizeFa";

/**
 * Prüft, ob ein Wort-Token aus einem Lesetext im Wortschatz vorkommt, und gibt
 * die passende (normalisierte) Vokabelform zurück – sonst null.
 *
 * Bewusst KONSERVATIV, um Fehlverlinkungen zu vermeiden: exakter Treffer,
 * plus nur sehr sichere Formen (Ezafe-Hamza ٔ entfernen, Plural ‌ها, Ezafe-ی).
 * Keine Verbstamm-/Possessiv-Ableitung (die erzeugt falsche Treffer wie
 * ساختمان→ساخت). Gegeneffekt: manche flektierten Verben bleiben unverlinkt –
 * das ist beabsichtigt (lieber nicht verlinkt als falsch verlinkt).
 */
export function findeVokabel(token: string, set: Set<string>): string | null {
  const clean = token.replace(/[،.:؛!؟?().،«»"'…]/g, "").trim();
  if (!clean) return null;
  const n = normalizeFa(clean);
  const ohneHamza = n.replace(/ٔ/g, "");
  const kandidaten = [n, ohneHamza, ohneHamza.replace(/(های|ها)$/, ""), ohneHamza.replace(/ی$/, "")];
  for (const k of kandidaten) if (k.length >= 1 && set.has(k)) return k;
  return null;
}
