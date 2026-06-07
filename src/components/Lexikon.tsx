"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import SprechButton from "@/components/SprechButton";
import { normalizeFa } from "@/lib/normalizeFa";
import { parseHinweis } from "@/lib/session";

export type LexEintrag = {
  id: string;
  hangul: string;
  romanisierung: string | null;
  deutsch: string;
  lektion_nummer: number | null;
  beispielsatz_ko: string | null;
  beispielsatz_de: string | null;
  hinweis: string | null;
  haeufigkeit: number | null;
};

type LektionMeta = { lektion_nummer: number; titel: string | null; buch: number | null };

const TEIL_NAME: Record<number, string> = {
  1: "Grammatik-Gerüst",
  2: "Verben",
  3: "Wortschatz",
  4: "Zeit & Zahlen",
};
const TEIL_BADGE: Record<number, string> = {
  1: "bg-taeguk-blue/10 text-taeguk-blue",
  2: "bg-taeguk-red/10 text-taeguk-red",
  3: "bg-amber-500/10 text-amber-600",
  4: "bg-sky-500/10 text-sky-600",
};

type Sortierung = "alpha" | "lektion" | "haeufigkeit";

export default function Lexikon({
  vokabeln,
  lektionen,
}: {
  vokabeln: LexEintrag[];
  lektionen: LektionMeta[];
}) {
  const [q, setQ] = useState("");
  const [teil, setTeil] = useState<number | "alle">("alle");
  const [sort, setSort] = useState<Sortierung>("alpha");

  const titelMap = useMemo(() => {
    const m = new Map<number, { titel: string; buch: number }>();
    for (const l of lektionen)
      m.set(l.lektion_nummer, { titel: l.titel ?? `Lektion ${l.lektion_nummer}`, buch: l.buch ?? 0 });
    return m;
  }, [lektionen]);

  const teile = useMemo(
    () => [...new Set(vokabeln.map((v) => titelMap.get(v.lektion_nummer ?? -1)?.buch ?? 0))].sort(),
    [vokabeln, titelMap]
  );

  const gefiltert = useMemo(() => {
    const nq = normalizeFa(q).toLowerCase();
    const list = vokabeln.filter((v) => {
      const buch = titelMap.get(v.lektion_nummer ?? -1)?.buch ?? 0;
      if (teil !== "alle" && buch !== teil) return false;
      if (!nq) return true;
      const hay = [
        normalizeFa(v.hangul),
        (v.romanisierung ?? "").toLowerCase(),
        v.deutsch.toLowerCase(),
        normalizeFa(v.beispielsatz_ko ?? ""),
        (v.beispielsatz_de ?? "").toLowerCase(),
      ].join(" ");
      return hay.includes(nq);
    });
    list.sort((a, b) => {
      if (sort === "haeufigkeit")
        return (b.haeufigkeit ?? 0) - (a.haeufigkeit ?? 0) ||
          (a.romanisierung ?? "").localeCompare(b.romanisierung ?? "");
      if (sort === "lektion")
        return (a.lektion_nummer ?? 0) - (b.lektion_nummer ?? 0);
      return (a.romanisierung ?? a.deutsch).localeCompare(b.romanisierung ?? b.deutsch);
    });
    return list;
  }, [vokabeln, titelMap, q, teil, sort]);

  return (
    <div>
      {/* Steuerleiste */}
      <div className="sticky top-[49px] z-20 -mx-4 mb-4 border-b border-slate-200 bg-slate-50/90 px-4 py-3 backdrop-blur dark:border-slate-700 dark:bg-slate-950/90">
        <div className="relative">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Suchen: Persisch, Umschrift oder Deutsch …"
            className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-taeguk-blue focus:ring-2 focus:ring-taeguk-blue/30 dark:border-slate-600 dark:bg-slate-800"
          />
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          <select
            value={teil}
            onChange={(e) => setTeil(e.target.value === "alle" ? "alle" : Number(e.target.value))}
            className="rounded-lg border border-slate-300 bg-white px-2 py-1 dark:border-slate-600 dark:bg-slate-800"
          >
            <option value="alle">Alle Teile</option>
            {teile.filter((t) => t > 0).map((t) => (
              <option key={t} value={t}>Teil {t} – {TEIL_NAME[t]}</option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sortierung)}
            className="rounded-lg border border-slate-300 bg-white px-2 py-1 dark:border-slate-600 dark:bg-slate-800"
          >
            <option value="alpha">A–Z (Umschrift)</option>
            <option value="lektion">Nach Lektion</option>
            <option value="haeufigkeit">Nach Häufigkeit</option>
          </select>
          <span className="ml-auto tabular-nums text-slate-400 dark:text-slate-500">
            {gefiltert.length} / {vokabeln.length}
          </span>
        </div>
      </div>

      {/* Liste */}
      {gefiltert.length === 0 ? (
        <p className="py-12 text-center text-sm text-slate-400 dark:text-slate-500">
          Nichts gefunden für „{q}".
        </p>
      ) : (
        <ul className="space-y-2">
          {gefiltert.map((v) => {
            const meta = titelMap.get(v.lektion_nummer ?? -1);
            const h = v.haeufigkeit ?? 0;
            const { stamm, rest } = parseHinweis(v.hinweis);
            return (
              <li
                key={v.id}
                className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span lang="fa" dir="rtl" className="text-2xl font-semibold">
                        {v.hangul}
                      </span>
                      <SprechButton text={v.hangul} mitLangsam />
                    </div>
                    {v.romanisierung && (
                      <p className="mt-0.5 text-sm italic text-slate-500 dark:text-slate-400">
                        {v.romanisierung}
                      </p>
                    )}
                    <p className="mt-0.5 font-medium">{v.deutsch}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    {meta && meta.buch > 0 && (
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${TEIL_BADGE[meta.buch] ?? "bg-slate-100 text-slate-500"}`}>
                        {meta.titel}
                      </span>
                    )}
                    {h > 0 && (
                      <span title={`Häufigkeit ${h}/5`} className="font-mono text-xs tracking-tighter text-emerald-500">
                        {"●".repeat(h)}<span className="text-slate-200 dark:text-slate-600">{"●".repeat(5 - h)}</span>
                      </span>
                    )}
                  </div>
                </div>

                {stamm && (
                  <p className="mt-2 text-xs">
                    <span className="rounded bg-indigo-50 px-1.5 py-0.5 font-medium text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
                      Präsensstamm <span lang="fa">{stamm}</span>
                    </span>
                  </p>
                )}
                {v.beispielsatz_ko && (
                  <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <span lang="fa" dir="rtl" className="font-medium">{v.beispielsatz_ko}</span>
                    <SprechButton text={v.beispielsatz_ko} />
                    {v.beispielsatz_de && <span className="text-slate-400 dark:text-slate-500">– {v.beispielsatz_de}</span>}
                  </p>
                )}
                {rest && (
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{rest}</p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
