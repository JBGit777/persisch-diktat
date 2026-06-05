import Link from "next/link";
import NavBar from "@/components/NavBar";
import DiktatSession from "@/components/DiktatSession";
import { createClient } from "@/lib/supabase/server";
import { alleZeilen } from "@/lib/paginate";
import type { VocabItem, ReviewState } from "@/lib/types";

type ReviewZeile = Pick<
  ReviewState,
  "vocab_item_id" | "ease_factor" | "intervall" | "wiederholungen" | "naechste_faelligkeit"
>;

export const dynamic = "force-dynamic";

export default async function DiktatPage({
  searchParams,
}: {
  searchParams: Promise<{ lektion?: string }>;
}) {
  const { lektion } = await searchParams;
  const parsed = lektion ? parseInt(lektion, 10) : NaN;
  const initialLektion = Number.isNaN(parsed) ? null : parsed;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [vokabeln, reviews, { data: lektionen }] = await Promise.all([
    // Paginiert: alle Vokabeln laden (> 1000 möglich).
    alleZeilen<VocabItem>((von, bis) =>
      supabase
        .from("vocab_items")
        .select(
          "id, user_id, hangul, romanisierung, deutsch, lektion_nummer, beispielsatz_ko, beispielsatz_de, hinweis, haeufigkeit, erstellt_am"
        )
        .order("id", { ascending: true })
        .range(von, bis)
    ),
    alleZeilen<ReviewZeile>((von, bis) =>
      supabase
        .from("review_state")
        .select("vocab_item_id, ease_factor, intervall, wiederholungen, naechste_faelligkeit")
        .order("vocab_item_id", { ascending: true })
        .range(von, bis)
    ),
    supabase
      .from("lessons")
      .select("id, lektion_nummer, titel, buch")
      .order("reihenfolge", { ascending: true }),
  ]);

  if (!vokabeln || vokabeln.length === 0) {
    return (
      <>
        <NavBar />
        <main className="mx-auto max-w-3xl px-4 py-8">
          <div className="rounded-2xl bg-white dark:bg-slate-800 p-8 text-center shadow-sm ring-1 ring-slate-200 dark:ring-slate-700">
            <p className="text-lg font-medium">Keine Vokabeln zum Üben.</p>
            <Link
              href="/import"
              className="mt-4 inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
            >
              Vokabeln importieren
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <DiktatSession
          userId={user!.id}
          vokabeln={vokabeln as VocabItem[]}
          reviews={reviews ?? []}
          lektionen={lektionen ?? []}
          initialLektion={initialLektion}
        />
      </main>
    </>
  );
}
