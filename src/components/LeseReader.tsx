"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Square, Volume2, Turtle, PenLine } from "lucide-react";
import { audioPfad } from "@/lib/audio";
import { normalizeFa } from "@/lib/normalizeFa";
import { findeVokabel } from "@/lib/wortlink";

interface Satz {
  fa: string;
  de: string;
}
export interface Frage {
  frage: string;
  frage_de?: string;
  optionen: string[];
  richtig: number;
}
export interface LeseText {
  id: string;
  titel: string;
  titel_de: string;
  niveau?: string;
  bild?: string;
  quelle?: string;
  saetze: Satz[];
  fragen?: Frage[];
}

/**
 * Lese-Reader: persischer Text satzweise (RTL). Tippen auf einen Satz blendet
 * die deutsche Übersetzung darunter ein/aus; pro Satz ein 🔊. Oben ein
 * „ganzen Text vorlesen" (normal/langsam) mit Satz-Hervorhebung. Audio kommt
 * aus den vorab erzeugten MP3s (edge-tts, hash-adressiert wie beim Wortschatz).
 */
export default function LeseReader({
  text,
  vokabeln = [],
}: {
  text: LeseText;
  /** Normalisierte Wortschatz-Formen (für die Wort-Verlinkung ins Lexikon). */
  vokabeln?: string[];
}) {
  const vokSet = useMemo(() => new Set(vokabeln), [vokabeln]);

  // Abdeckung: wie viele eindeutige Wörter des Textes sind im Wortschatz.
  const abdeckung = useMemo(() => {
    const alle = new Set<string>();
    const drin = new Set<string>();
    for (const s of text.saetze)
      for (const tok of s.fa.split(/\s+/)) {
        const clean = tok.replace(/[،.:؛!؟?().،«»"'…]/g, "").trim();
        if (!clean) continue;
        const nn = normalizeFa(clean);
        alle.add(nn);
        if (findeVokabel(tok, vokSet)) drin.add(nn);
      }
    return { drin: drin.size, alle: alle.size };
  }, [text, vokSet]);

  const [offen, setOffen] = useState<Set<number>>(new Set());
  const [aktiv, setAktiv] = useState<number | null>(null);
  const [spielt, setSpielt] = useState(false);
  const [langsam, setLangsam] = useState(false);
  const [nastaliq, setNastaliq] = useState(false);
  const [antworten, setAntworten] = useState<Record<number, number>>({});

  // Schrift-Klassen für den persischen Text (Standard vs. Kalligrafie/Nastaliq).
  const faSatz = nastaliq ? "font-nastaliq text-[1.6rem] leading-[2.6]" : "text-2xl leading-loose";
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const seqRef = useRef(false); // läuft eine Gesamt-Wiedergabe?

  // Aufräumen beim Verlassen.
  useEffect(() => stopp, []);

  // EIN wiederverwendetes Audio-Element (iOS/Safari verschluckt sonst beim
  // „Aufwärmen" eines frisch erzeugten Elements die ersten Wörter ab Satz 2).
  function getMedia(): HTMLAudioElement {
    if (!audioRef.current) {
      const el = new Audio();
      el.preload = "auto";
      audioRef.current = el;
    }
    return audioRef.current;
  }

  function stopp() {
    seqRef.current = false;
    if (audioRef.current) {
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.pause();
    }
    setAktiv(null);
    setSpielt(false);
  }

  function spieleSatz(i: number): Promise<void> {
    return new Promise((resolve) => {
      const el = getMedia();
      setAktiv(i);
      el.onended = () => resolve();
      el.onerror = () => resolve(); // MP3 fehlt → still weiter
      el.playbackRate = langsam ? 0.65 : 1;
      el.src = audioPfad(text.saetze[i].fa);
      el.load(); // erzwingt Start bei 0 (kein verschluckter Satzanfang)
      el.play().catch(() => resolve());
    });
  }

  async function einzeln(i: number) {
    if (seqRef.current) return; // während Gesamt-Wiedergabe kein Einzel-Antippen
    stopp();
    await spieleSatz(i);
    setAktiv(null);
  }

  async function gesamt() {
    if (spielt) {
      stopp();
      return;
    }
    stopp();
    seqRef.current = true;
    setSpielt(true);
    for (let i = 0; i < text.saetze.length; i++) {
      if (!seqRef.current) break;
      await spieleSatz(i);
    }
    stopp();
  }

  function toggleUebersetzung(i: number) {
    setOffen((s) => {
      const n = new Set(s);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });
  }

  const alleOffen = offen.size === text.saetze.length;

  return (
    <div>
      {/* Kopf: Bild + Titel */}
      {text.bild && (
        <div className="overflow-hidden rounded-2xl ring-1 ring-slate-200 dark:ring-slate-700">
          <Image
            src={text.bild}
            alt={text.titel_de}
            width={898}
            height={413}
            className="h-auto w-full"
            priority
          />
        </div>
      )}
      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2">
        <h1 lang="fa" dir="rtl" className={`font-bold ${nastaliq ? "font-nastaliq text-2xl leading-[2]" : "text-3xl"}`}>
          {text.titel}
        </h1>
        <span className="text-sm text-slate-500 dark:text-slate-400">{text.titel_de}</span>
      </div>

      {/* Steuerleiste */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          onClick={gesamt}
          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-taeguk-blue to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 active:scale-95"
        >
          {spielt ? <Square size={15} /> : <Play size={15} />}
          {spielt ? "Stopp" : "Ganzen Text vorlesen"}
        </button>
        <button
          onClick={() => setLangsam((v) => !v)}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium ring-1 transition ${
            langsam
              ? "bg-amber-100 text-amber-800 ring-amber-300 dark:bg-amber-950/40 dark:text-amber-200 dark:ring-amber-900"
              : "text-slate-600 ring-slate-300 hover:bg-slate-100 dark:text-slate-300 dark:ring-slate-600 dark:hover:bg-slate-700"
          }`}
          title="Langsam vorlesen"
        >
          <Turtle size={15} /> Langsam
        </button>
        <button
          onClick={() => setNastaliq((v) => !v)}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium ring-1 transition ${
            nastaliq
              ? "bg-emerald-100 text-emerald-800 ring-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-200 dark:ring-emerald-900"
              : "text-slate-600 ring-slate-300 hover:bg-slate-100 dark:text-slate-300 dark:ring-slate-600 dark:hover:bg-slate-700"
          }`}
          title="Kalligrafische Nastaliq-Schrift"
        >
          <PenLine size={15} /> Nastaliq
        </button>
        <button
          onClick={() => setOffen(alleOffen ? new Set() : new Set(text.saetze.map((_, i) => i)))}
          className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 ring-1 ring-slate-300 transition hover:bg-slate-100 dark:text-slate-300 dark:ring-slate-600 dark:hover:bg-slate-700"
        >
          {alleOffen ? "Übersetzung aus" : "Übersetzung an"}
        </button>
      </div>
      <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
        <span className="underline decoration-taeguk-blue/50 decoration-dotted underline-offset-2">
          Unterstrichene Wörter
        </span>{" "}
        stehen im Wortschatz – tippen öffnet den Lexikon-Eintrag. „DE" zeigt die Satz-Übersetzung,
        🔊 liest den Satz vor. ({abdeckung.drin} von {abdeckung.alle} Wörtern im Wortschatz)
      </p>

      {/* Sätze */}
      <div className="mt-5 space-y-2">
        {text.saetze.map((s, i) => (
          <div
            key={i}
            className={`rounded-xl px-4 py-3 ring-1 transition ${
              aktiv === i
                ? "bg-taeguk-blue/5 ring-taeguk-blue/40 dark:bg-taeguk-blue/10"
                : "bg-white ring-slate-200 dark:bg-slate-800 dark:ring-slate-700"
            }`}
          >
            <div className="flex items-start gap-2">
              <div className="mt-1 flex shrink-0 items-center gap-0.5">
                <button
                  onClick={() => einzeln(i)}
                  className="rounded-md p-1.5 text-taeguk-blue transition hover:bg-taeguk-blue/10"
                  title="Diesen Satz vorlesen"
                  aria-label="Vorlesen"
                >
                  <Volume2 size={18} />
                </button>
                <button
                  onClick={() => toggleUebersetzung(i)}
                  className={`rounded-md px-1.5 py-1 text-xs font-semibold transition ${
                    offen.has(i)
                      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"
                      : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                  title="Übersetzung anzeigen"
                >
                  DE
                </button>
              </div>
              <p lang="fa" dir="rtl" className={`flex-1 text-right ${faSatz}`}>
                {s.fa.split(/\s+/).map((tok, j) => {
                  const treffer = findeVokabel(tok, vokSet);
                  return (
                    <Fragment key={j}>
                      {treffer ? (
                        <Link
                          href={`/lexikon?q=${encodeURIComponent(treffer)}`}
                          className="rounded underline decoration-taeguk-blue/40 decoration-dotted underline-offset-4 transition hover:bg-taeguk-blue/10 hover:decoration-taeguk-blue"
                        >
                          {tok}
                        </Link>
                      ) : (
                        <span>{tok}</span>
                      )}{" "}
                    </Fragment>
                  );
                })}
              </p>
            </div>
            {offen.has(i) && (
              <p className="mt-2 border-t border-slate-100 pt-2 text-sm text-indigo-700 dark:border-slate-700 dark:text-indigo-300">
                {s.de}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Verständnisfragen */}
      {text.fragen && text.fragen.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold">Verständnisfragen</h2>
          <div className="mt-3 space-y-4">
            {text.fragen.map((f, qi) => {
              const gewaehlt = antworten[qi];
              const beantwortet = gewaehlt !== undefined;
              return (
                <div
                  key={qi}
                  className="rounded-xl bg-white p-4 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700"
                >
                  <p lang="fa" dir="rtl" className={`text-right ${nastaliq ? "font-nastaliq text-lg leading-loose" : "text-lg"}`}>
                    {f.frage}
                  </p>
                  {f.frage_de && (
                    <p className="mt-0.5 text-right text-xs text-slate-400 dark:text-slate-500">{f.frage_de}</p>
                  )}
                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {f.optionen.map((o, oi) => {
                      const istRichtig = oi === f.richtig;
                      let cls =
                        "rounded-lg border px-3 py-2 text-right transition border-slate-300 dark:border-slate-600";
                      if (!beantwortet) cls += " cursor-pointer hover:border-taeguk-blue hover:bg-taeguk-blue/5";
                      else if (istRichtig) cls += " border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40";
                      else if (oi === gewaehlt) cls += " border-red-400 bg-red-50 dark:bg-red-950/40";
                      else cls += " opacity-50";
                      return (
                        <button
                          key={oi}
                          lang="fa"
                          dir="rtl"
                          disabled={beantwortet}
                          onClick={() => setAntworten((a) => ({ ...a, [qi]: oi }))}
                          className={`${cls} ${nastaliq ? "font-nastaliq" : ""}`}
                        >
                          {o}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {text.quelle && (
        <p className="mt-6 text-xs text-slate-400 dark:text-slate-500">Quelle: {text.quelle}</p>
      )}
    </div>
  );
}
