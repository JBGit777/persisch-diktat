import Link from "next/link";
import { notFound } from "next/navigation";
import NavBar from "@/components/NavBar";
import LektionInhalte from "@/components/LektionInhalte";
import SprechButton from "@/components/SprechButton";
import { createClient } from "@/lib/supabase/server";
import { ladeLektion } from "@/lib/lessons";

export const dynamic = "force-dynamic";

export default async function LektionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const detail = await ladeLektion(supabase, id);
  if (!detail) notFound();

  const { lesson, status, grammatik, vokabeln } = detail;
  const titel = lesson.titel ?? `Lektion ${lesson.lektion_nummer}`;

  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <Link href="/lektionen" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
          ← Alle Lektionen
        </Link>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{titel}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {lesson.buch ? `Teil ${lesson.buch} · ` : ""}
              {vokabeln.length} Vokabeln
            </p>
          </div>
          {vokabeln.length > 0 && (
            <Link
              href={`/diktat?lektion=${lesson.lektion_nummer}`}
              className="rounded-lg bg-gradient-to-br from-taeguk-blue to-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:brightness-110 active:scale-95"
            >
              🎧 Diktat zu dieser Lektion
            </Link>
          )}
        </div>

        <div className="mt-8">
          <LektionInhalte
            userId={user!.id}
            lessonId={lesson.id}
            initialStatus={status}
            initialGrammatik={grammatik}
          />
        </div>

        {/* Vokabeln der Lektion */}
        <section className="mt-10">
          <h2 className="text-lg font-semibold">Vokabeln</h2>
          {vokabeln.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Keine Vokabeln in dieser Lektion.</p>
          ) : (
            <ul className="mt-3 divide-y divide-slate-100 dark:divide-slate-700 rounded-2xl bg-white dark:bg-slate-800 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700">
              {vokabeln.map((v) => {
                const h = v.haeufigkeit ?? 3;
                const farbe =
                  h >= 5
                    ? "text-emerald-500"
                    : h === 4
                      ? "text-lime-500"
                      : h === 3
                        ? "text-amber-500"
                        : h === 2
                          ? "text-orange-500"
                          : "text-slate-400 dark:text-slate-500";
                return (
                  <li key={v.id} className="px-5 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/lexikon?q=${encodeURIComponent(v.hangul)}`}
                            className="text-lg font-medium hover:text-taeguk-blue hover:underline"
                            title="Im Lexikon ansehen"
                          >
                            {v.hangul}
                          </Link>
                          <SprechButton text={v.hangul} mitLangsam />
                        </div>
                        {v.romanisierung && (
                          <p className="text-xs italic text-slate-400 dark:text-slate-500">{v.romanisierung}</p>
                        )}
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <span className="text-sm text-slate-500 dark:text-slate-400">{v.deutsch}</span>
                        <span
                          title={`Häufigkeit ${h}/5`}
                          className={`shrink-0 font-mono text-xs tracking-tighter ${farbe}`}
                        >
                          {"●".repeat(h)}
                          <span className="text-slate-200 dark:text-slate-600">{"●".repeat(5 - h)}</span>
                        </span>
                      </div>
                    </div>
                    {v.beispielsatz_ko && (
                      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm">
                        <span lang="fa" dir="rtl" className="font-medium text-slate-700 dark:text-slate-200">
                          {v.beispielsatz_ko}
                        </span>
                        <SprechButton text={v.beispielsatz_ko} />
                        {v.beispielsatz_de && (
                          <span className="text-slate-400 dark:text-slate-500">– {v.beispielsatz_de}</span>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </>
  );
}
