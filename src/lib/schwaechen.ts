import type { createClient } from "@/lib/supabase/server";
import { fasseSchwaechen, type Fehler, type SchwaechenEintrag } from "@/lib/fehleranalyse";
import { alleZeilen } from "@/lib/paginate";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

export interface SchwaechenReport {
  verwechslungen: SchwaechenEintrag[];
  ausgelassen: number;
  zuviel: number;
  /** Anzahl ausgewerteter Versuche (mit Fehlerdaten). */
  versuche: number;
}

/**
 * Aggregiert die persönliche Schwächenkarte aus den gespeicherten
 * Fehlerklassen aller Diktat-Versuche (nur eigene Zeilen dank RLS).
 */
export async function ladeSchwaechen(supabase: SupabaseClient): Promise<SchwaechenReport> {
  const zeilen = await alleZeilen<{ fehler: Fehler[] | null }>((von, bis) =>
    supabase
      .from("dictation_attempts")
      .select("fehler")
      .not("fehler", "is", null)
      .range(von, bis)
  );
  const alle: Fehler[] = [];
  for (const z of zeilen) if (Array.isArray(z.fehler)) alle.push(...z.fehler);
  const { verwechslungen, ausgelassen, zuviel } = fasseSchwaechen(alle);
  return { verwechslungen, ausgelassen, zuviel, versuche: zeilen.length };
}
