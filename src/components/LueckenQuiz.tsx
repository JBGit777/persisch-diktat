"use client";

import { useState } from "react";
import { Sparkles, Check, X, RotateCcw } from "lucide-react";
import SprechButton from "@/components/SprechButton";
import { normalizeFa } from "@/lib/normalizeFa";

interface Aufgabe {
  satz: string;
  loesung: string;
  optionen: string[];
  uebersetzung: string;
}

type Phase = "start" | "laedt" | "quiz" | "fertig";

/**
 * Multiple-Choice-Lückentexte, von Claude aus dem eigenen Wortschatz generiert
 * (Zielwörter = persönliche Schwächen). Bewertung rein clientseitig – das
 * Quiz beeinflusst den SRS-Fortschritt bewusst nicht.
 */
export default function LueckenQuiz() {
  const [phase, setPhase] = useState<Phase>("start");
  const [fehlerText, setFehlerText] = useState<string | null>(null);
  const [aufgaben, setAufgaben] = useState<Aufgabe[]>([]);
  const [index, setIndex] = useState(0);
  const [gewaehlt, setGewaehlt] = useState<string | null>(null);
  const [richtig, setRichtig] = useState(0);

  async function starten() {
    setPhase("laedt");
    setFehlerText(null);
    try {
      const res = await fetch("/api/luecken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ anzahl: 8 }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Generierung fehlgeschlagen.");
      setAufgaben(json.aufgaben);
      setIndex(0);
      setGewaehlt(null);
      setRichtig(0);
      setPhase("quiz");
    } catch (e) {
      setFehlerText(e instanceof Error ? e.message : "Unbekannter Fehler.");
      setPhase("start");
    }
  }

  function waehlen(option: string) {
    if (gewaehlt) return;
    setGewaehlt(option);
    if (normalizeFa(option) === normalizeFa(aufgaben[index].loesung)) {
      setRichtig((r) => r + 1);
    }
  }

  function weiter() {
    if (index + 1 >= aufgaben.length) setPhase("fertig");
    else {
      setIndex((i) => i + 1);
      setGewaehlt(null);
    }
  }

  if (phase === "start" || phase === "laedt") {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
          <Sparkles size={28} />
        </div>
        <h2 className="mt-3 text-xl font-bold">Lücken-Quiz</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
          Claude erstellt frische Lückensätze aus deinem Wortschatz – die
          Zielwörter sind bevorzugt deine persönlich schwächsten. Wähle jeweils
          das passende Wort.
        </p>
        {fehlerText && <p className="mt-3 text-sm text-red-600">{fehlerText}</p>}
        <button
          onClick={starten}
          disabled={phase === "laedt"}
          className="mt-6 rounded-lg bg-gradient-to-br from-taeguk-blue to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 active:scale-95 disabled:opacity-60"
        >
          {phase === "laedt" ? "Aufgaben werden erstellt … (bis zu 1 Min.)" : "8 Aufgaben erzeugen"}
        </button>
      </div>
    );
  }

  if (phase === "fertig") {
    const quote = aufgaben.length ? Math.round((richtig / aufgaben.length) * 100) : 0;
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
        <h2 className="text-2xl font-bold">Fertig!</h2>
        <p className="mt-3 text-4xl font-bold tabular-nums">
          {richtig} / {aufgaben.length}
        </p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{quote} % richtig</p>
        <button
          onClick={starten}
          className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-taeguk-blue to-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:brightness-110 active:scale-95"
        >
          <RotateCcw size={15} /> Neue Runde
        </button>
      </div>
    );
  }

  const a = aufgaben[index];
  const geloest = gewaehlt !== null;
  const warRichtig = geloest && normalizeFa(gewaehlt) === normalizeFa(a.loesung);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
      <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
        <span className="font-medium tabular-nums">
          Aufgabe {index + 1} / {aufgaben.length}
        </span>
        <span className="tabular-nums">{richtig} richtig</span>
      </div>

      {/* Satz mit Lücke */}
      <p
        lang="fa"
        dir="rtl"
        className="mt-6 rounded-xl bg-slate-50 px-5 py-6 text-center text-2xl font-medium leading-loose ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700"
      >
        {geloest ? a.satz.replace("___", a.loesung) : a.satz}
      </p>

      {/* Optionen */}
      <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {a.optionen.map((o) => {
          const istLoesung = normalizeFa(o) === normalizeFa(a.loesung);
          const istGewaehlt = gewaehlt === o;
          let klasse =
            "rounded-lg border border-slate-300 px-4 py-3 text-lg transition dark:border-slate-600";
          if (!geloest) klasse += " hover:border-taeguk-blue hover:bg-taeguk-blue/5 cursor-pointer";
          else if (istLoesung) klasse += " border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40";
          else if (istGewaehlt) klasse += " border-red-400 bg-red-50 dark:bg-red-950/40";
          else klasse += " opacity-50";
          return (
            <button key={o} lang="fa" dir="rtl" onClick={() => waehlen(o)} disabled={geloest} className={klasse}>
              {o}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {geloest && (
        <div className="mt-5 space-y-3">
          <div
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
              warRichtig
                ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
                : "bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-200"
            }`}
          >
            {warRichtig ? <Check size={16} /> : <X size={16} />}
            {warRichtig ? "Richtig!" : (
              <span>
                Richtig wäre: <b lang="fa">{a.loesung}</b>
              </span>
            )}
            <SprechButton text={a.loesung} />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            <span className="font-medium text-slate-700 dark:text-slate-200">Übersetzung: </span>
            {a.uebersetzung}
          </p>
          <button
            onClick={weiter}
            className="rounded-lg bg-gradient-to-br from-taeguk-blue to-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 active:scale-95"
          >
            {index + 1 >= aufgaben.length ? "Ergebnis anzeigen" : "Weiter →"}
          </button>
        </div>
      )}
    </div>
  );
}
