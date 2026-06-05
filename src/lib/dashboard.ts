import type { createClient } from "@/lib/supabase/server";
import { alleZeilen } from "@/lib/paginate";

/** Exakter Typ des (server-seitigen) Supabase-Clients. */
type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

export interface SchwacheVokabel {
  id: string;
  hangul: string;
  deutsch: string;
  ease_factor: number;
}

export interface DashboardDaten {
  vokabelnGesamt: number;
  faellig: number;
  streak: number;
  genauigkeitLetzte: number | null; // 0–1, null wenn keine Versuche
  versucheGesamt: number;
  schwaechste: SchwacheVokabel[];
}

/** Berechnet die Tages-Streak aus aufsteigend/absteigend sortierten ISO-Daten. */
export function berechneStreak(zeitstempel: string[], jetzt: Date = new Date()): number {
  if (zeitstempel.length === 0) return 0;
  const tage = new Set(
    zeitstempel.map((t) => new Date(t).toISOString().slice(0, 10))
  );
  let streak = 0;
  const cursor = new Date(jetzt);
  // Streak zählt ab heute (oder gestern, falls heute noch nicht geübt).
  const heute = jetzt.toISOString().slice(0, 10);
  if (!tage.has(heute)) cursor.setDate(cursor.getDate() - 1);

  while (tage.has(cursor.toISOString().slice(0, 10))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

/**
 * Lädt alle Kennzahlen fürs Dashboard. Erwartet einen authentifizierten
 * Supabase-Client (RLS sorgt dafür, dass nur eigene Daten geladen werden).
 */
export async function ladeDashboardDaten(
  supabase: SupabaseClient,
  jetzt: Date = new Date()
): Promise<DashboardDaten> {
  const jetztIso = jetzt.toISOString();

  const [vokabelCount, nichtFaellig, attempts, recent, schwach] = await Promise.all([
    supabase.from("vocab_items").select("id", { count: "exact", head: true }),
    supabase
      .from("review_state")
      .select("vocab_item_id", { count: "exact", head: true })
      .gt("naechste_faelligkeit", jetztIso),
    alleZeilen<{ erstellt_am: string }>((von, bis) =>
      supabase
        .from("dictation_attempts")
        .select("erstellt_am")
        .order("id", { ascending: true })
        .range(von, bis)
    ),
    supabase
      .from("dictation_attempts")
      .select("zeichen_genauigkeit")
      .order("erstellt_am", { ascending: false })
      .limit(50),
    supabase
      .from("review_state")
      .select("ease_factor, vocab_item_id")
      .order("ease_factor", { ascending: true })
      .limit(5),
  ]);

  const vokabelnGesamt = vokabelCount.count ?? 0;
  const faellig = Math.max(0, vokabelnGesamt - (nichtFaellig.count ?? 0));

  const versuche = attempts;
  const streak = berechneStreak(versuche.map((a) => a.erstellt_am), jetzt);

  const letzte = recent.data ?? [];
  const genauigkeitLetzte =
    letzte.length > 0
      ? letzte.reduce((s, r) => s + (r.zeichen_genauigkeit ?? 0), 0) / letzte.length
      : null;

  // Schwächste Vokabeln: Namen separat laden (robuster als PostgREST-Embed).
  const schwachRows = schwach.data ?? [];
  const ids = schwachRows.map((r) => r.vocab_item_id);
  const namen = new Map<string, { hangul: string; deutsch: string }>();
  if (ids.length > 0) {
    const { data: vocabRows } = await supabase
      .from("vocab_items")
      .select("id, hangul, deutsch")
      .in("id", ids);
    for (const v of vocabRows ?? []) namen.set(v.id, { hangul: v.hangul, deutsch: v.deutsch });
  }
  const schwaechste: SchwacheVokabel[] = schwachRows
    .map((r) => {
      const v = namen.get(r.vocab_item_id);
      return {
        id: r.vocab_item_id,
        hangul: v?.hangul ?? "?",
        deutsch: v?.deutsch ?? "",
        ease_factor: r.ease_factor,
      };
    })
    .filter((v) => v.hangul !== "?");

  return {
    vokabelnGesamt,
    faellig,
    streak,
    genauigkeitLetzte,
    versucheGesamt: versuche.length,
    schwaechste,
  };
}
