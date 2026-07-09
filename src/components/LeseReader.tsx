"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Square, Volume2, Turtle } from "lucide-react";
import { audioPfad } from "@/lib/audio";
import { normalizeFa } from "@/lib/normalizeFa";
import { findeVokabel } from "@/lib/wortlink";

interface Satz {
  fa: string;
  de: string;
}
export interface LeseText {
  id: string;
  titel: string;
  titel_de: string;
  niveau?: string;
  bild?: string;
  quelle?: string;
  saetze: Satz[];
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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const seqRef = useRef(false); // läuft eine Gesamt-Wiedergabe?

  // Aufräumen beim Verlassen.
  useEffect(() => stopp, []);

  function stopp() {
    seqRef.current = false;
    if (audioRef.current) {
      audioRef.current.onended = null;
      audioRef.current.pause();
      audioRef.current = null;
    }
    setAktiv(null);
    setSpielt(false);
  }

  function spieleSatz(i: number): Promise<void> {
    return new Promise((resolve) => {
      const a = new Audio(audioPfad(text.saetze[i].fa));
      a.playbackRate = langsam ? 0.65 : 1;
      audioRef.current = a;
      setAktiv(i);
      a.onended = () => resolve();
      a.onerror = () => resolve(); // MP3 fehlt → still weiter
      a.play().catch(() => resolve());
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
        <h1 lang="fa" dir="rtl" className="text-3xl font-bold">
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
              <p lang="fa" dir="rtl" className="flex-1 text-right text-2xl leading-loose">
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

      {text.quelle && (
        <p className="mt-6 text-xs text-slate-400 dark:text-slate-500">Quelle: {text.quelle}</p>
      )}
    </div>
  );
}
