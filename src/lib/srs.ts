import type { ReviewState, Schwierigkeit } from "@/lib/types";

/**
 * SM-2 Spaced-Repetition-Algorithmus (SuperMemo 2).
 *
 * Dieses Modul ist bewusst rein (keine Seiteneffekte, kein Supabase-Bezug),
 * damit es später für ein eigenständiges Vokabel-SRS wiederverwendet und
 * isoliert getestet werden kann.
 */

/** Mapping der UI-Buttons auf SM-2-Qualitätsnoten (0–5). */
const QUALITAET: Record<Schwierigkeit, number> = {
  schwer: 2, // nicht bestanden -> bald erneut zeigen
  mittel: 4, // korrekt mit etwas Mühe
  leicht: 5, // mühelos korrekt
};

const MIN_EASE = 1.3;
const START_EASE = 2.5;

export interface SrsEingang {
  ease_factor: number;
  intervall: number; // in Tagen
  wiederholungen: number;
}

export interface SrsErgebnis {
  ease_factor: number;
  intervall: number;
  wiederholungen: number;
  /** ISO-String der nächsten Fälligkeit. */
  naechste_faelligkeit: string;
}

/**
 * Berechnet den neuen Wiederholungs-Zustand aus dem alten Zustand und der
 * Bewertung. `jetzt` ist injizierbar, um die Funktion testbar zu halten.
 */
export function berechneNaechstenZustand(
  vorher: SrsEingang,
  schwierigkeit: Schwierigkeit,
  jetzt: Date = new Date()
): SrsErgebnis {
  const q = QUALITAET[schwierigkeit];

  let { ease_factor, intervall, wiederholungen } = vorher;
  if (!ease_factor || ease_factor < MIN_EASE) ease_factor = START_EASE;

  if (q < 3) {
    // Nicht bestanden: zurücksetzen, in dieser/der nächsten Sitzung erneut.
    wiederholungen = 0;
    intervall = 0;
  } else {
    if (wiederholungen === 0) intervall = 1;
    else if (wiederholungen === 1) intervall = 6;
    else intervall = Math.round(intervall * ease_factor);
    wiederholungen += 1;
  }

  // Ease-Factor anpassen (SM-2-Formel) und nach unten begrenzen.
  ease_factor = ease_factor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (ease_factor < MIN_EASE) ease_factor = MIN_EASE;

  const faellig = new Date(jetzt.getTime());
  faellig.setDate(faellig.getDate() + intervall);

  return {
    ease_factor: Number(ease_factor.toFixed(4)),
    intervall,
    wiederholungen,
    naechste_faelligkeit: faellig.toISOString(),
  };
}

/** Frischer Startzustand für eine noch nie geübte Vokabel. */
export function startZustand(): SrsEingang {
  return { ease_factor: START_EASE, intervall: 0, wiederholungen: 0 };
}

/**
 * Sortier-Score für die Kartenauswahl: kleinere Werte = höhere Priorität.
 * Fällige Karten zuerst (je überfälliger, desto wichtiger), danach schwache
 * Karten (niedriger Ease-Factor).
 */
export function auswahlScore(
  state: Pick<ReviewState, "naechste_faelligkeit" | "ease_factor"> | null,
  jetzt: Date = new Date()
): number {
  if (!state) return -1_000_000; // nie geübt -> höchste Priorität
  const ueberfaelligMs = jetzt.getTime() - new Date(state.naechste_faelligkeit).getTime();
  // Überfälligkeit (positiv = fällig) dominiert; Ease als Feinabstimmung.
  return -ueberfaelligMs / 86_400_000 + state.ease_factor;
}
