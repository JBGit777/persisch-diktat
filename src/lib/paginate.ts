/**
 * Lädt ALLE Zeilen einer Supabase-Abfrage, auch über die PostgREST-Standard-
 * grenze von 1000 Zeilen hinaus, indem seitenweise per .range() nachgeladen wird.
 */
type RangeFn<T> = (
  von: number,
  bis: number
) => PromiseLike<{ data: T[] | null; error: unknown }>;

export async function alleZeilen<T>(fn: RangeFn<T>, seite = 1000): Promise<T[]> {
  let von = 0;
  const out: T[] = [];
  for (;;) {
    const { data } = await fn(von, von + seite - 1);
    const batch = data ?? [];
    out.push(...batch);
    if (batch.length < seite) break;
    von += seite;
  }
  return out;
}
