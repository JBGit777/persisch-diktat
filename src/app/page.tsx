import Link from "next/link";
import {
  Flame,
  CalendarClock,
  Target,
  ListChecks,
  Headphones,
  Upload,
  TrendingDown,
} from "lucide-react";
import NavBar from "@/components/NavBar";
import Taegeuk from "@/components/Taegeuk";
import SprechButton from "@/components/SprechButton";
import { createClient } from "@/lib/supabase/server";
import { ladeDashboardDaten } from "@/lib/dashboard";
import { ladeSchwaechen } from "@/lib/schwaechen";
import { ladeLektionen } from "@/lib/lessons";

export const dynamic = "force-dynamic";

const AKZENT = {
  rot: "bg-taeguk-red/10 text-taeguk-red",
  blau: "bg-taeguk-blue/10 text-taeguk-blue",
  gruen: "bg-emerald-500/10 text-emerald-600",
  grau: "bg-slate-500/10 text-slate-600 dark:text-slate-300",
} as const;

function Kennzahl({
  label,
  wert,
  hinweis,
  Icon,
  akzent,
}: {
  label: string;
  wert: string;
  hinweis?: string;
  Icon: typeof Flame;
  akzent: keyof typeof AKZENT;
}) {
  return (
    <div className="animate-fade-in-up rounded-2xl bg-white dark:bg-slate-800 p-5 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700">
      <div className={`inline-flex rounded-lg p-2 ${AKZENT[akzent]}`}>
        <Icon size={18} />
      </div>
      <p className="mt-3 text-3xl font-bold tabular-nums">{wert}</p>
      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</p>
      {hinweis && <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{hinweis}</p>}
    </div>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const [daten, lektionen, schwaechen] = await Promise.all([
    ladeDashboardDaten(supabase),
    ladeLektionen(supabase),
    ladeSchwaechen(supabase),
  ]);

  const keineVokabeln = daten.vokabelnGesamt === 0;

  // Problem-Buchstaben aus den häufigsten Verwechslungen (für „Gezielt üben").
  const fokusChars = [
    ...new Set(
      schwaechen.verwechslungen
        .slice(0, 5)
        .flatMap((v) => v.paar.split("↔"))
        .filter((c) => [...c].length === 1)
    ),
  ].join("");

  // Fortschritt pro Teil.
  const teilMap = new Map<number, { gesamt: number; fertig: number }>();
  for (const l of lektionen) {
    const b = l.buch ?? 0;
    const t = teilMap.get(b) ?? { gesamt: 0, fertig: 0 };
    t.gesamt += 1;
    if (l.status === "fertig") t.fertig += 1;
    teilMap.set(b, t);
  }
  const teile = [...teilMap.entries()].sort((a, b) => a[0] - b[0]);

  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-taeguk-blue via-emerald-600 to-emerald-700 p-6 text-white shadow-sm sm:p-8">
          <div className="absolute -right-6 -top-6 opacity-20">
            <Taegeuk size={150} />
          </div>
          <p className="text-sm font-medium text-white/80">
            <span lang="fa">سلام!</span> 👋
          </p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Deine Übersicht</h1>
          <p className="mt-1 max-w-md text-sm text-white/80">
            Hör- und Diktatübungen für Persisch – mit Fokus auf die wichtigsten
            Wörter.
          </p>
          {!keineVokabeln && (
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/diktat"
                className="inline-flex items-center gap-2 rounded-lg bg-white dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-taeguk-blue shadow-sm hover:bg-white/90"
              >
                <Headphones size={16} /> Üben starten
              </Link>
              <Link
                href="/lektionen"
                className="inline-flex items-center gap-2 rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/30 hover:bg-white/25"
              >
                Lektionen
              </Link>
            </div>
          )}
        </div>

        {keineVokabeln ? (
          <div className="mt-6 rounded-2xl bg-white dark:bg-slate-800 p-8 text-center shadow-sm ring-1 ring-slate-200 dark:ring-slate-700">
            <p className="text-lg font-medium">Noch keine Vokabeln vorhanden.</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Importiere zuerst deine Vokabelliste als CSV.
            </p>
            <Link
              href="/import"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-taeguk-blue to-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:brightness-110 active:scale-95"
            >
              <Upload size={16} /> Zum CSV-Import
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Kennzahl
                label="Streak"
                wert={`${daten.streak}`}
                hinweis="Tage in Folge"
                Icon={Flame}
                akzent="rot"
              />
              <Kennzahl
                label="Fällige Karten"
                wert={String(daten.faellig)}
                hinweis={`von ${daten.vokabelnGesamt} Vokabeln`}
                Icon={CalendarClock}
                akzent="blau"
              />
              <Kennzahl
                label="Genauigkeit"
                wert={
                  daten.genauigkeitLetzte === null
                    ? "–"
                    : `${Math.round(daten.genauigkeitLetzte * 100)} %`
                }
                hinweis="letzte 50 Versuche"
                Icon={Target}
                akzent="gruen"
              />
              <Kennzahl
                label="Versuche"
                wert={String(daten.versucheGesamt)}
                hinweis="insgesamt"
                Icon={ListChecks}
                akzent="grau"
              />
            </div>

            {/* Fortschritt pro Teil */}
            {teile.length > 0 && (
              <section className="mt-6 rounded-2xl bg-white dark:bg-slate-800 p-5 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700">
                <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Fortschritt pro Teil</h2>
                <div className="mt-3 space-y-3">
                  {teile.map(([buch, t]) => {
                    const pct = t.gesamt ? Math.round((t.fertig / t.gesamt) * 100) : 0;
                    return (
                      <div key={buch}>
                        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                          <span>{buch > 0 ? `Teil ${buch}` : "Sonstige"}</span>
                          <span className="tabular-nums">
                            {t.fertig}/{t.gesamt} fertig
                          </span>
                        </div>
                        <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-taeguk-blue to-taeguk-red"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Persönliche Fehler-Taxonomie: welche Buchstaben werden vertauscht */}
            {schwaechen.verwechslungen.length > 0 && (
              <section className="mt-6 rounded-2xl bg-white dark:bg-slate-800 p-5 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700">
                <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Häufigste Verwechslungen
                </h2>
                <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                  Aus {schwaechen.versuche} ausgewerteten Versuchen – die Buchstaben, die du am
                  ehesten vertauschst.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {schwaechen.verwechslungen.slice(0, 8).map((v) => (
                    <span
                      key={v.gruppe + v.paar}
                      title={v.gruppe}
                      className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 dark:bg-rose-950/40 px-3 py-1 text-sm text-rose-800 dark:text-rose-200"
                    >
                      <span lang="fa" className="font-semibold">{v.paar}</span>
                      <span className="text-xs text-rose-400 dark:text-rose-500">×{v.anzahl}</span>
                    </span>
                  ))}
                </div>
                {(schwaechen.ausgelassen > 0 || schwaechen.zuviel > 0) && (
                  <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
                    Ausgelassene Zeichen: {schwaechen.ausgelassen} · zu viel getippt:{" "}
                    {schwaechen.zuviel}
                  </p>
                )}
                {fokusChars && (
                  <Link
                    href={`/diktat?fokus=${encodeURIComponent(fokusChars)}`}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-taeguk-blue to-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:brightness-110 active:scale-95"
                  >
                    🎯 Gezielt üben
                  </Link>
                )}
              </section>
            )}

            <section className="mt-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <TrendingDown size={18} className="text-taeguk-red" /> Schwächste Vokabeln
              </h2>
              {daten.schwaechste.length === 0 ? (
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Noch keine Übungsdaten – starte eine Übungssitzung.
                </p>
              ) : (
                <ul className="mt-3 divide-y divide-slate-100 dark:divide-slate-700 rounded-2xl bg-white dark:bg-slate-800 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700">
                  {daten.schwaechste.map((v) => (
                    <li key={v.id} className="flex items-center justify-between px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-lg font-medium">{v.hangul}</span>
                        <SprechButton text={v.hangul} mitLangsam />
                        <span className="ml-1 text-sm text-slate-500 dark:text-slate-400">{v.deutsch}</span>
                      </div>
                      <span className="rounded-full bg-slate-100 dark:bg-slate-700 px-2 py-0.5 text-xs text-slate-500 dark:text-slate-400">
                        Ease {v.ease_factor.toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </main>
    </>
  );
}
