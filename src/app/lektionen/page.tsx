import Link from "next/link";
import { BookOpen, Upload } from "lucide-react";
import NavBar from "@/components/NavBar";
import { createClient } from "@/lib/supabase/server";
import { ladeLektionen, type LektionUebersicht } from "@/lib/lessons";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<LektionUebersicht["status"], string> = {
  offen: "Offen",
  in_arbeit: "In Arbeit",
  fertig: "Fertig",
};
const STATUS_KLASSE: Record<LektionUebersicht["status"], string> = {
  offen: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300",
  in_arbeit: "bg-amber-100 text-amber-800",
  fertig: "bg-emerald-100 text-emerald-800",
};

// Dezentes Farbschema pro Teil: Kartenrand, leichter Tint, Akzent-Text.
const TEIL_STYLE: Record<number, { rand: string; tint: string; akzent: string }> = {
  1: { rand: "border-t-taeguk-blue", tint: "bg-taeguk-blue/[0.03] dark:bg-taeguk-blue/10", akzent: "text-taeguk-blue" },
  2: { rand: "border-t-taeguk-red", tint: "bg-taeguk-red/[0.03] dark:bg-taeguk-red/10", akzent: "text-taeguk-red" },
  3: { rand: "border-t-amber-500", tint: "bg-amber-500/[0.04] dark:bg-amber-500/10", akzent: "text-amber-600" },
  4: { rand: "border-t-sky-500", tint: "bg-sky-500/[0.04] dark:bg-sky-500/10", akzent: "text-sky-600" },
  5: { rand: "border-t-violet-500", tint: "bg-violet-500/[0.04] dark:bg-violet-500/10", akzent: "text-violet-600" },
};
const TEIL_FALLBACK = { rand: "border-t-slate-300", tint: "bg-white dark:bg-slate-800", akzent: "text-slate-600 dark:text-slate-300" };

function LektionKarte({ l }: { l: LektionUebersicht }) {
  const s = TEIL_STYLE[l.buch ?? 0] ?? TEIL_FALLBACK;
  return (
    <Link
      href={`/lektionen/${l.id}`}
      className={`block rounded-xl border-t-4 ${s.tint} p-4 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 transition hover:-translate-y-0.5 hover:shadow-md ${s.rand}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold">{l.titel ?? `Lektion ${l.lektion_nummer}`}</p>
          <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{l.vokabelAnzahl} Vokabeln</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_KLASSE[l.status]}`}
        >
          {STATUS_LABEL[l.status]}
        </span>
      </div>
      {l.hatGrammatik && (
        <div className={`mt-3 flex items-center gap-1.5 text-xs font-medium ${s.akzent}`}>
          <BookOpen size={14} /> Grammatik
        </div>
      )}
    </Link>
  );
}

export default async function LektionenPage() {
  const supabase = await createClient();
  const lektionen = await ladeLektionen(supabase);

  const gruppen = new Map<number, LektionUebersicht[]>();
  for (const l of lektionen) {
    const buch = l.buch ?? 0;
    if (!gruppen.has(buch)) gruppen.set(buch, []);
    gruppen.get(buch)!.push(l);
  }
  const buecher = [...gruppen.keys()].sort((a, b) => a - b);

  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-bold">Lektionen</h1>

        {lektionen.length === 0 ? (
          <div className="mt-6 rounded-2xl bg-white dark:bg-slate-800 p-8 text-center shadow-sm ring-1 ring-slate-200 dark:ring-slate-700">
            <p className="text-lg font-medium">Noch keine Lektionen.</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Lektionen entstehen automatisch aus deinen importierten Vokabeln.
            </p>
            <Link
              href="/import"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
            >
              <Upload size={16} /> Zum Import
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-8">
            {buecher.map((buch) => {
              const akzent = (TEIL_STYLE[buch] ?? TEIL_FALLBACK).akzent;
              return (
                <section key={buch}>
                  <h2 className={`text-lg font-semibold ${akzent}`}>
                    {buch > 0 ? `Teil ${buch}` : "Sonstige"}
                  </h2>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {gruppen.get(buch)!.map((l) => (
                      <LektionKarte key={l.id} l={l} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
