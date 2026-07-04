import Link from "next/link";
import NavBar from "@/components/NavBar";
import Lexikon, { type LexEintrag } from "@/components/Lexikon";
import { createClient } from "@/lib/supabase/server";
import { alleZeilen } from "@/lib/paginate";

export const dynamic = "force-dynamic";

export default async function LexikonPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const supabase = await createClient();

  const [vokabeln, { data: lektionen }] = await Promise.all([
    alleZeilen<LexEintrag>((von, bis) =>
      supabase
        .from("vocab_items")
        .select(
          "id, hangul, romanisierung, deutsch, lektion_nummer, beispielsatz_ko, beispielsatz_de, hinweis, haeufigkeit"
        )
        .order("romanisierung", { ascending: true })
        .range(von, bis)
    ),
    supabase
      .from("lessons")
      .select("lektion_nummer, titel, buch")
      .order("reihenfolge", { ascending: true }),
  ]);

  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <h1 className="text-2xl font-bold">Lexikon</h1>
          <span className="text-sm text-slate-400 dark:text-slate-500">
            {vokabeln?.length ?? 0} Vokabeln
          </span>
        </div>
        <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
          Gesamtübersicht aller Wörter – suchen, filtern, anhören.
        </p>

        {!vokabeln || vokabeln.length === 0 ? (
          <div className="rounded-2xl bg-white dark:bg-slate-800 p-8 text-center shadow-sm ring-1 ring-slate-200 dark:ring-slate-700">
            <p className="text-lg font-medium">Noch keine Vokabeln.</p>
            <Link
              href="/import"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-taeguk-blue to-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:brightness-110"
            >
              Zum Import
            </Link>
          </div>
        ) : (
          {/* key erzwingt Remount bei neuem ?q= – sonst bliebe der alte
              useState-Suchbegriff stehen (Client-Komponente wird bei reiner
              searchParams-Änderung nicht neu gemountet). */}
          <Lexikon key={q ?? ""} vokabeln={vokabeln} lektionen={lektionen ?? []} initialQuery={q ?? ""} />
        )}
      </main>
    </>
  );
}
