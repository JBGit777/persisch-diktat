"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { usePersischTTS } from "@/lib/tts";
import { vergleiche, type VergleichsErgebnis } from "@/lib/diff";
import {
  Play,
  RotateCcw,
  Turtle,
  Check,
  X,
  Trophy,
  Headphones,
  PenLine,
} from "lucide-react";
import { berechneNaechstenZustand, startZustand, autoBewertung } from "@/lib/srs";
import { analysiereFehler } from "@/lib/fehleranalyse";
import Confetti from "@/components/Confetti";
import SprechButton from "@/components/SprechButton";
import {
  waehleSitzung,
  zielText,
  bedeutung,
  hatSatz,
  parseHinweis,
  type SitzungsKarte,
  type Zielmodus,
} from "@/lib/session";
import PersischeTastatur from "@/components/PersischeTastatur";
import type { ReviewState, Schwierigkeit, VocabItem } from "@/lib/types";

type ReviewZeile = Pick<
  ReviewState,
  "vocab_item_id" | "ease_factor" | "intervall" | "wiederholungen" | "naechste_faelligkeit"
>;

type LektionLite = {
  id: string;
  lektion_nummer: number;
  titel: string | null;
  buch: number | null;
};

interface Props {
  userId: string;
  vokabeln: VocabItem[];
  reviews: ReviewZeile[];
  lektionen: LektionLite[];
  initialLektion?: number | null;
  /** Fokus-Buchstaben (aus der Schwächenkarte): nur Wörter, die diese enthalten. */
  fokusBuchstaben?: string;
}

type Phase = "setup" | "frage" | "ergebnis" | "fertig";
type Modus = "hoeren" | "uebersetzen";

const SCHWIERIGKEITEN: { key: Schwierigkeit; label: string; klasse: string }[] = [
  { key: "schwer", label: "Schwer", klasse: "bg-red-600 hover:bg-red-500" },
  { key: "mittel", label: "Mittel", klasse: "bg-amber-500 hover:bg-amber-400" },
  { key: "leicht", label: "Leicht", klasse: "bg-emerald-600 hover:bg-emerald-500" },
];

export default function DiktatSession({
  userId,
  vokabeln,
  reviews,
  lektionen,
  initialLektion,
  fokusBuchstaben,
}: Props) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const { unterstuetzt, spricht, sprich } = usePersischTTS();

  const reviewMap = useMemo(() => {
    const m = new Map<string, SitzungsKarte["review"]>();
    for (const r of reviews) m.set(r.vocab_item_id, r);
    return m;
  }, [reviews]);

  // Auswählbare Lektionen: nur die, die tatsächlich Vokabeln haben.
  const auswahlListe = useMemo(() => {
    const titelMap = new Map(lektionen.map((l) => [l.lektion_nummer, l]));
    const nums = [
      ...new Set(
        vokabeln.map((v) => v.lektion_nummer).filter((n): n is number => n != null)
      ),
    ].sort((a, b) => a - b);
    return nums.map((n) => ({
      nummer: n,
      titel: titelMap.get(n)?.titel ?? `Lektion ${n % 100}`,
      buch: titelMap.get(n)?.buch ?? Math.floor(n / 100),
    }));
  }, [vokabeln, lektionen]);

  const alleNummern = useMemo(() => auswahlListe.map((l) => l.nummer), [auswahlListe]);
  const defaultAuswahl = useMemo(
    () => new Set(initialLektion != null ? [initialLektion] : alleNummern),
    [alleNummern, initialLektion]
  );

  const [phase, setPhase] = useState<Phase>("setup");
  const [modus, setModus] = useState<Modus>("hoeren");
  const [zielmodus, setZielmodus] = useState<Zielmodus>("wort");
  const [auswahlState, setAuswahlState] = useState<Set<number> | null>(null);
  const ausgewaehlt = auswahlState ?? defaultAuswahl;
  const [minHaeufigkeit, setMinHaeufigkeit] = useState(1);
  const [nurFaellige, setNurFaellige] = useState(false);
  const [groesse, setGroesse] = useState(20);

  function toggleLektion(n: number) {
    setAuswahlState((prev) => {
      const base = new Set(prev ?? defaultAuswahl);
      if (base.has(n)) base.delete(n);
      else base.add(n);
      return base;
    });
  }
  const [karten, setKarten] = useState<SitzungsKarte[]>([]);
  const [index, setIndex] = useState(0);
  const [eingabe, setEingabe] = useState("");
  const [vergleich, setVergleich] = useState<VergleichsErgebnis | null>(null);
  const [statistik, setStatistik] = useState<{ korrekt: boolean; genauigkeit: number }[]>([]);
  const [speichert, setSpeichert] = useState(false);
  const [antwortzeit, setAntwortzeit] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const frageStartRef = useRef<number>(0);

  const aktuelleKarte = karten[index];
  const aktuellerText = aktuelleKarte ? zielText(aktuelleKarte, zielmodus) : "";

  // Im Hör-Modus: TTS automatisch abspielen, sobald eine neue Frage erscheint.
  useEffect(() => {
    if (phase === "frage") {
      if (modus === "hoeren" && aktuellerText && unterstuetzt) sprich(aktuellerText, 1);
      inputRef.current?.focus();
      frageStartRef.current = Date.now(); // Startzeitpunkt für die Antwortzeit
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, index]);

  // Vokabeln nach Lektionsauswahl, Mindest-Häufigkeit und (optional) Fälligkeit
  // filtern. „Fällig" = noch nie geübt ODER Wiederholung heute/überfällig.
  const fokusSet = useMemo(
    () => new Set(fokusBuchstaben ? [...fokusBuchstaben] : []),
    [fokusBuchstaben]
  );
  const gefilterteVokabeln = useMemo(() => {
    const jetzt = Date.now();
    return vokabeln.filter((v) => {
      if (v.lektion_nummer == null || !ausgewaehlt.has(v.lektion_nummer)) return false;
      if ((v.haeufigkeit ?? 3) < minHaeufigkeit) return false;
      if (nurFaellige) {
        const r = reviewMap.get(v.id);
        if (r && new Date(r.naechste_faelligkeit).getTime() > jetzt) return false;
      }
      if (fokusSet.size > 0) {
        const text = v.hangul + (v.beispielsatz_ko ?? "");
        if (![...text].some((ch) => fokusSet.has(ch))) return false;
      }
      return true;
    });
  }, [vokabeln, ausgewaehlt, minHaeufigkeit, nurFaellige, reviewMap, fokusSet]);

  function sitzungStarten() {
    if (gefilterteVokabeln.length === 0) return;
    const auswahl = waehleSitzung(gefilterteVokabeln, reviewMap, groesse);
    setKarten(auswahl);
    setIndex(0);
    setEingabe("");
    setVergleich(null);
    setStatistik([]);
    setPhase("frage");
  }

  function pruefen(e?: React.FormEvent) {
    e?.preventDefault();
    if (!aktuelleKarte) return;
    const erg = vergleiche(aktuellerText, eingabe);
    setAntwortzeit(frageStartRef.current ? Date.now() - frageStartRef.current : null);
    setVergleich(erg);
    setPhase("ergebnis");
  }

  const bewerten = useCallback(
    async (schwierigkeit: Schwierigkeit) => {
      if (!aktuelleKarte || !vergleich) return;
      setSpeichert(true);

      const vorher = aktuelleKarte.review ?? startZustand();
      const neu = berechneNaechstenZustand(vorher, schwierigkeit);

      // allSettled: schlägt der Attempt-Insert fehl (z. B. Migration 0006 noch
      // nicht eingespielt), bleibt der Ablauf trotzdem flüssig; der SRS-Zustand
      // (review_state) wird unabhängig davon gespeichert.
      await Promise.allSettled([
        supabase.from("dictation_attempts").insert({
          user_id: userId,
          vocab_item_id: aktuelleKarte.id,
          eingabe,
          korrekt: vergleich.korrekt,
          zeichen_genauigkeit: vergleich.genauigkeit,
          antwortzeit_ms: antwortzeit,
          ziel: aktuellerText,
          fehler: analysiereFehler(vergleich.segmente),
        }),
        supabase.from("review_state").upsert(
          {
            user_id: userId,
            vocab_item_id: aktuelleKarte.id,
            ease_factor: neu.ease_factor,
            intervall: neu.intervall,
            wiederholungen: neu.wiederholungen,
            naechste_faelligkeit: neu.naechste_faelligkeit,
            aktualisiert_am: new Date().toISOString(),
          },
          { onConflict: "user_id,vocab_item_id" }
        ),
      ]);

      setStatistik((s) => [
        ...s,
        { korrekt: vergleich.korrekt, genauigkeit: vergleich.genauigkeit },
      ]);
      setSpeichert(false);

      if (index + 1 >= karten.length) {
        setPhase("fertig");
      } else {
        setIndex((i) => i + 1);
        setEingabe("");
        setVergleich(null);
        setPhase("frage");
      }
    },
    [aktuelleKarte, vergleich, eingabe, index, karten.length, supabase, userId, antwortzeit, aktuellerText]
  );

  // Enter im Ergebnis-Screen: mit der automatischen Note zur nächsten Karte.
  useEffect(() => {
    if (phase !== "ergebnis" || !vergleich) return;
    const note = autoBewertung(vergleich.genauigkeit, antwortzeit, [...aktuellerText].length);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        bewerten(note);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, vergleich, antwortzeit, aktuellerText, bewerten]);

  // ---- Render: Einrichtung ----
  if (phase === "setup") {
    const buecher = [...new Set(auswahlListe.map((l) => l.buch))].sort((a, b) => a - b);
    const alleGewaehlt = ausgewaehlt.size === alleNummern.length;
    const auswahlText = alleGewaehlt
      ? `Alle Lektionen (${alleNummern.length})`
      : `${ausgewaehlt.size} von ${alleNummern.length} Lektionen`;

    return (
      <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700">
        <h1 className="text-2xl font-bold">Übungssitzung</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {gefilterteVokabeln.length} Vokabeln in der Auswahl. Fällige und schwache
          Karten werden zuerst geübt.
        </p>
        {fokusSet.size > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 px-3 py-2 text-sm text-rose-800 dark:text-rose-200">
            <span className="font-medium">🎯 Fokus auf deine Schwächen:</span>
            <span lang="fa" className="text-lg font-semibold tracking-wide">
              {[...fokusSet].join(" ")}
            </span>
            <span className="text-xs text-rose-500 dark:text-rose-400">
              nur Wörter mit diesen Buchstaben
            </span>
          </div>
        )}

        {/* Übungsart */}
        <fieldset className="mt-6">
          <legend className="text-sm font-medium text-slate-700 dark:text-slate-200">Übungsart</legend>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <label
              className={`flex cursor-pointer items-start gap-2 rounded-lg border p-3 text-sm ${
                modus === "hoeren" ? "border-taeguk-blue bg-taeguk-blue/5 dark:bg-taeguk-blue/10 ring-1 ring-taeguk-blue/20" : "border-slate-300 dark:border-slate-600"
              }`}
            >
              <input
                type="radio"
                name="modus"
                checked={modus === "hoeren"}
                onChange={() => setModus("hoeren")}
                className="mt-0.5"
              />
              <span>
                <span className="font-medium">🎧 Hördiktat</span>
                <span className="block text-xs text-slate-500 dark:text-slate-400">
                  Persisch hören, auf Persisch tippen
                </span>
              </span>
            </label>
            <label
              className={`flex cursor-pointer items-start gap-2 rounded-lg border p-3 text-sm ${
                modus === "uebersetzen" ? "border-taeguk-blue bg-taeguk-blue/5 dark:bg-taeguk-blue/10 ring-1 ring-taeguk-blue/20" : "border-slate-300 dark:border-slate-600"
              }`}
            >
              <input
                type="radio"
                name="modus"
                checked={modus === "uebersetzen"}
                onChange={() => setModus("uebersetzen")}
                className="mt-0.5"
              />
              <span>
                <span className="font-medium">✍️ Übersetzen</span>
                <span className="block text-xs text-slate-500 dark:text-slate-400">
                  Deutsch lesen, auf Persisch tippen
                </span>
              </span>
            </label>
          </div>
        </fieldset>

        {modus === "hoeren" && !unterstuetzt && (
          <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
            Auf diesem Gerät ist keine persische Sprachausgabe (fa-IR) verfügbar.
            iOS/macOS liefern oft keine Farsi-Stimme mit – nutze für den Hör-Modus
            z. B. Chrome/Edge am Desktop, oder verwende den Übersetzen-Modus.
          </p>
        )}

        {/* Zieltext: einzelnes Wort oder ganzer Beispielsatz */}
        <fieldset className="mt-6">
          <legend className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Zieltext
          </legend>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <label
              className={`flex cursor-pointer items-start gap-2 rounded-lg border p-3 text-sm ${
                zielmodus === "wort"
                  ? "border-taeguk-blue bg-taeguk-blue/5 dark:bg-taeguk-blue/10 ring-1 ring-taeguk-blue/20"
                  : "border-slate-300 dark:border-slate-600"
              }`}
            >
              <input
                type="radio"
                name="zielmodus"
                checked={zielmodus === "wort"}
                onChange={() => setZielmodus("wort")}
                className="mt-0.5"
              />
              <span>
                <span className="font-medium">🔤 Wort</span>
                <span className="block text-xs text-slate-500 dark:text-slate-400">
                  Einzelnes Vokabel; Beispielsatz als Kontext im Ergebnis
                </span>
              </span>
            </label>
            <label
              className={`flex cursor-pointer items-start gap-2 rounded-lg border p-3 text-sm ${
                zielmodus === "satz"
                  ? "border-taeguk-blue bg-taeguk-blue/5 dark:bg-taeguk-blue/10 ring-1 ring-taeguk-blue/20"
                  : "border-slate-300 dark:border-slate-600"
              }`}
            >
              <input
                type="radio"
                name="zielmodus"
                checked={zielmodus === "satz"}
                onChange={() => setZielmodus("satz")}
                className="mt-0.5"
              />
              <span>
                <span className="font-medium">📝 Satz</span>
                <span className="block text-xs text-slate-500 dark:text-slate-400">
                  Ganzer Beispielsatz (wo vorhanden), sonst das Wort
                </span>
              </span>
            </label>
          </div>
        </fieldset>

        {/* Lektionsauswahl */}
        <details className="mt-6 rounded-lg border border-slate-200 dark:border-slate-700">
          <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200">
            Lektionen: <span className="font-normal text-slate-500 dark:text-slate-400">{auswahlText}</span>
          </summary>
          <div className="border-t border-slate-100 dark:border-slate-700 p-4">
            <div className="mb-3 flex gap-2">
              <button
                type="button"
                onClick={() => setAuswahlState(new Set(alleNummern))}
                className="rounded-md px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 ring-1 ring-slate-300 dark:ring-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Alle
              </button>
              <button
                type="button"
                onClick={() => setAuswahlState(new Set())}
                className="rounded-md px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 ring-1 ring-slate-300 dark:ring-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Keine
              </button>
            </div>
            <div className="max-h-64 space-y-4 overflow-y-auto pr-1">
              {buecher.map((buch) => {
                const inBuch = auswahlListe.filter((l) => l.buch === buch);
                return (
                  <div key={buch}>
                    <div className="mb-1 flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500">
                        {buch > 0 ? `Teil ${buch}` : "Sonstige"}
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          setAuswahlState((prev) => {
                            const base = new Set(prev ?? defaultAuswahl);
                            const alleDa = inBuch.every((l) => base.has(l.nummer));
                            inBuch.forEach((l) =>
                              alleDa ? base.delete(l.nummer) : base.add(l.nummer)
                            );
                            return base;
                          })
                        }
                        className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-700"
                      >
                        umschalten
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                      {inBuch.map((l) => (
                        <label
                          key={l.nummer}
                          className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200"
                        >
                          <input
                            type="checkbox"
                            checked={ausgewaehlt.has(l.nummer)}
                            onChange={() => toggleLektion(l.nummer)}
                          />
                          <span className="truncate">{l.titel}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </details>

        {/* Häufigkeits-Filter */}
        <label className="mt-6 block text-sm font-medium text-slate-700 dark:text-slate-200">
          Häufigkeit (Fokus auf wichtige Wörter)
        </label>
        <select
          value={minHaeufigkeit}
          onChange={(e) => setMinHaeufigkeit(Number(e.target.value))}
          className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm outline-none focus:border-slate-900 sm:w-72"
        >
          <option value={1}>Alle Wörter</option>
          <option value={2}>Ab Tier 2 (seltene ausblenden)</option>
          <option value={3}>Ab Tier 3 (mittel und häufig)</option>
          <option value={4}>Nur häufige (Tier 4–5)</option>
          <option value={5}>Nur Kernwortschatz (Tier 5)</option>
        </select>
        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
          Unabhängig davon kommen häufige Wörter in der Auswahl bevorzugt dran.
        </p>

        {/* Fällig-Queue */}
        <label className="mt-6 flex cursor-pointer items-start gap-2 text-sm text-slate-700 dark:text-slate-200">
          <input
            type="checkbox"
            checked={nurFaellige}
            onChange={(e) => setNurFaellige(e.target.checked)}
            className="mt-0.5"
          />
          <span>
            <span className="font-medium">Nur fällige Karten</span>
            <span className="block text-xs text-slate-500 dark:text-slate-400">
              Heutige Wiederholungen + noch nie geübte Wörter ({gefilterteVokabeln.length} in der Auswahl)
            </span>
          </span>
        </label>

        {/* Kartenanzahl */}
        <label className="mt-6 block text-sm font-medium text-slate-700 dark:text-slate-200">
          Anzahl Karten in dieser Sitzung
        </label>
        <input
          type="number"
          min={1}
          max={Math.max(1, gefilterteVokabeln.length)}
          value={groesse}
          onChange={(e) => setGroesse(Math.max(1, Number(e.target.value)))}
          className="mt-1 w-32 rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm outline-none focus:border-slate-900"
        />

        <div className="mt-6">
          <button
            onClick={sitzungStarten}
            disabled={gefilterteVokabeln.length === 0}
            className="rounded-lg bg-gradient-to-br from-taeguk-blue to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 active:scale-95 disabled:opacity-50"
          >
            Sitzung starten
          </button>
          {gefilterteVokabeln.length === 0 && (
            <p className="mt-2 text-sm text-red-600">
              Keine Vokabeln in der Auswahl – bitte Lektionen wählen.
            </p>
          )}
        </div>
      </div>
    );
  }

  // ---- Render: Zusammenfassung ----
  if (phase === "fertig") {
    const richtige = statistik.filter((s) => s.korrekt).length;
    const schnitt =
      statistik.length > 0
        ? statistik.reduce((s, x) => s + x.genauigkeit, 0) / statistik.length
        : 0;
    return (
      <div className="animate-fade-in-up rounded-2xl bg-white dark:bg-slate-800 p-8 text-center shadow-sm ring-1 ring-slate-200 dark:ring-slate-700">
        {richtige > 0 && <Confetti />}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600">
          <Trophy size={28} />
        </div>
        <h1 className="mt-3 text-2xl font-bold">Sitzung abgeschlossen!</h1>
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div>
            <p className="text-3xl font-bold tabular-nums">{statistik.length}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Karten</p>
          </div>
          <div>
            <p className="text-3xl font-bold tabular-nums">{richtige}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">komplett richtig</p>
          </div>
          <div>
            <p className="text-3xl font-bold tabular-nums">
              {Math.round(schnitt * 100)} %
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Genauigkeit</p>
          </div>
        </div>
        <div className="mt-8 flex justify-center gap-3">
          <button
            onClick={() => {
              setPhase("setup");
              router.refresh();
            }}
            className="rounded-lg bg-gradient-to-br from-taeguk-blue to-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:brightness-110 active:scale-95"
          >
            Neue Sitzung
          </button>
          <button
            onClick={() => router.push("/")}
            className="rounded-lg bg-white dark:bg-slate-800 px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 ring-1 ring-slate-300 dark:ring-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            Zur Übersicht
          </button>
        </div>
      </div>
    );
  }

  // ---- Render: Frage / Ergebnis ----
  return (
    <div
      key={index}
      className="animate-fade-in-up rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700"
    >
      {/* Fortschritt */}
      <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
        <div
          className="h-full rounded-full bg-gradient-to-r from-taeguk-blue to-emerald-400 transition-all duration-500 ease-out"
          style={{
            width: `${((index + (phase === "ergebnis" ? 1 : 0)) / Math.max(1, karten.length)) * 100}%`,
          }}
        />
      </div>
      <div className="flex items-center justify-between gap-2 text-sm text-slate-500 dark:text-slate-400">
        <span className="font-medium tabular-nums">
          Karte {index + 1} / {karten.length}
        </span>
        <span className="inline-flex items-center gap-1.5">
          {modus === "hoeren" ? <Headphones size={14} /> : <PenLine size={14} />}
          {modus === "hoeren"
            ? "Hör genau hin und tippe, was du hörst."
            : "Übersetze ins Persische."}
        </span>
      </div>

      {modus === "hoeren" ? (
        /* TTS-Steuerung */
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            onClick={() => sprich(aktuellerText, 1)}
            disabled={!unterstuetzt}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-taeguk-blue to-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:brightness-110 active:scale-95 disabled:opacity-50"
          >
            <Play size={16} /> Abspielen
          </button>
          <button
            onClick={() => sprich(aktuellerText, 1)}
            disabled={!unterstuetzt}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 ring-1 ring-slate-300 dark:ring-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50"
          >
            <RotateCcw size={16} /> Wiederholen
          </button>
          <button
            onClick={() => sprich(aktuellerText, 0.3)}
            disabled={!unterstuetzt}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 ring-1 ring-slate-300 dark:ring-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50"
          >
            <Turtle size={16} /> Langsam
          </button>
          {spricht && <span className="self-center text-xs text-slate-400 dark:text-slate-500">spricht …</span>}
        </div>
      ) : (
        /* Übersetzungs-Aufgabe: deutscher Text */
        <div className="mt-6 rounded-xl bg-slate-50 dark:bg-slate-900 p-5 text-center ring-1 ring-slate-200 dark:ring-slate-700">
          <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
            Übersetze ins Persische
          </p>
          <p className="mt-1 text-2xl font-medium text-slate-900 dark:text-slate-100">
            {aktuelleKarte ? bedeutung(aktuelleKarte, zielmodus) : ""}
          </p>
        </div>
      )}

      {/* Eingabe */}
      <form onSubmit={pruefen} className="mt-6">
        <input
          ref={inputRef}
          type="text"
          lang="fa"
          dir="rtl"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          value={eingabe}
          disabled={phase === "ergebnis"}
          onChange={(e) => setEingabe(e.target.value)}
          placeholder="… اینجا بنویسید"
          className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-3 text-2xl text-right outline-none transition focus:border-taeguk-blue focus:ring-2 focus:ring-taeguk-blue/30 disabled:bg-slate-50"
        />
        {phase === "frage" && (
          <button
            type="submit"
            className="mt-4 rounded-lg bg-gradient-to-br from-taeguk-blue to-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:brightness-110 active:scale-95"
          >
            Prüfen
          </button>
        )}
      </form>

      {/* Tastatur-Referenz für die Desktop-Eingabe (persische Systemtastatur). */}
      {phase === "frage" && <PersischeTastatur />}

      {/* Ergebnis */}
      {phase === "ergebnis" && vergleich && aktuelleKarte && (
        <div className="mt-6 border-t border-slate-100 dark:border-slate-700 pt-6">
          <div
            className={`flex items-center gap-2.5 rounded-xl p-4 text-base font-semibold ring-1 ${
              vergleich.korrekt
                ? "bg-gradient-to-br from-emerald-50 to-emerald-100/60 text-emerald-800 ring-emerald-200 dark:from-emerald-950/40 dark:to-emerald-900/20 dark:text-emerald-200 dark:ring-emerald-900"
                : "bg-gradient-to-br from-red-50 to-red-100/60 text-red-800 ring-red-200 dark:from-red-950/40 dark:to-red-900/20 dark:text-red-200 dark:ring-red-900"
            }`}
          >
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white ${
                vergleich.korrekt ? "bg-emerald-500" : "bg-red-500"
              }`}
            >
              {vergleich.korrekt ? <Check size={16} /> : <X size={16} />}
            </span>
            {vergleich.korrekt
              ? "Richtig!"
              : `Nicht ganz – Genauigkeit ${Math.round(vergleich.genauigkeit * 100)} %`}
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <div>
              <span className="text-slate-400 dark:text-slate-500">Zeichenvergleich: </span>
              <span className="text-2xl tracking-wide">
                {vergleich.segmente.map((seg, i) => {
                  if (seg.typ === "korrekt")
                    return (
                      <span key={i} className="text-emerald-600">
                        {seg.eingabe}
                      </span>
                    );
                  if (seg.typ === "falsch")
                    return (
                      <span key={i} className="rounded bg-red-100 text-red-700" title={`Erwartet: ${seg.erwartet}`}>
                        {seg.eingabe}
                      </span>
                    );
                  if (seg.typ === "fehlt")
                    return (
                      <span key={i} className="rounded bg-red-100 text-red-700 line-through">
                        {seg.erwartet}
                      </span>
                    );
                  // zuviel
                  return (
                    <span key={i} className="rounded bg-amber-100 text-amber-700 line-through">
                      {seg.eingabe}
                    </span>
                  );
                })}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 px-4 py-3 ring-1 ring-slate-200 dark:ring-slate-700">
              <div className="flex items-baseline gap-2">
                <span className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Korrekt
                </span>
                <span lang="fa" dir="rtl" className="text-3xl font-semibold">
                  {aktuellerText}
                </span>
              </div>
              <SprechButton text={aktuellerText} mitLangsam />
            </div>
            {aktuelleKarte.romanisierung && (
              <div>
                <span className="text-slate-400 dark:text-slate-500">Romanisierung: </span>
                <span>{aktuelleKarte.romanisierung}</span>
              </div>
            )}
            <div>
              <span className="text-slate-400 dark:text-slate-500">Bedeutung: </span>
              <span className="font-medium">{bedeutung(aktuelleKarte, zielmodus)}</span>
            </div>
            {/* Im Wort-Modus den Beispielsatz als Kontext zeigen … */}
            {zielmodus === "wort" && hatSatz(aktuelleKarte) && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-slate-400 dark:text-slate-500">Beispiel: </span>
                <span lang="fa" dir="rtl" className="text-lg font-medium">
                  {aktuelleKarte.beispielsatz_ko}
                </span>
                <SprechButton text={aktuelleKarte.beispielsatz_ko!} mitLangsam />
                {aktuelleKarte.beispielsatz_de && (
                  <span className="text-slate-500 dark:text-slate-400">
                    – {aktuelleKarte.beispielsatz_de}
                  </span>
                )}
              </div>
            )}
            {/* … und im Satz-Modus umgekehrt das Einzelwort. */}
            {zielmodus === "satz" && hatSatz(aktuelleKarte) && (
              <div className="flex items-center gap-2">
                <span className="text-slate-400 dark:text-slate-500">Wort: </span>
                <span lang="fa" dir="rtl" className="font-medium">
                  {aktuelleKarte.hangul}
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                  ({aktuelleKarte.deutsch})
                </span>
              </div>
            )}
            {(() => {
              const { stamm, rest } = parseHinweis(aktuelleKarte.hinweis);
              return (
                <>
                  {stamm && (
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 px-3 py-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
                        Präsensstamm
                      </span>
                      <span
                        lang="fa"
                        dir="rtl"
                        className="text-2xl font-bold leading-none text-indigo-900 dark:text-indigo-100"
                      >
                        {stamm}
                      </span>
                      <span lang="fa" className="text-xs text-indigo-500 dark:text-indigo-400">
                        بن مضارع
                      </span>
                    </div>
                  )}
                  {rest && (
                    <div className="rounded-lg bg-amber-50 dark:bg-amber-950/40 px-3 py-2 text-amber-900 dark:text-amber-200">
                      <span className="font-medium">Hinweis: </span>
                      {rest}
                    </div>
                  )}
                </>
              );
            })()}
          </div>

          {(() => {
            const zeichen = [...aktuellerText].length;
            const autoNote = autoBewertung(vergleich.genauigkeit, antwortzeit, zeichen);
            const konf = analysiereFehler(vergleich.segmente).filter(
              (f) => f.art === "konfusion"
            );
            const autoLabel =
              SCHWIERIGKEITEN.find((s) => s.key === autoNote)?.label ?? autoNote;
            return (
              <>
                {konf.length > 0 && (
                  <div className="mt-4 rounded-lg bg-rose-50 dark:bg-rose-950/40 px-3 py-2 text-sm text-rose-800 dark:text-rose-200">
                    <span className="font-medium">Verwechselt: </span>
                    {konf.map((f, i) => (
                      <span key={i} className="mr-3 inline-block whitespace-nowrap">
                        <b lang="fa">{"eingabe" in f ? f.eingabe : ""}</b> statt{" "}
                        <b lang="fa">{"erwartet" in f ? f.erwartet : ""}</b>
                        {f.art === "konfusion" && (
                          <span className="text-rose-400 dark:text-rose-500"> ({f.gruppe})</span>
                        )}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => bewerten(autoNote)}
                    disabled={speichert}
                    className="rounded-lg bg-gradient-to-br from-taeguk-blue to-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 active:scale-95 disabled:opacity-50"
                  >
                    Weiter →
                  </button>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    automatisch bewertet:{" "}
                    <span className="font-medium text-slate-600 dark:text-slate-300">
                      {autoLabel}
                    </span>
                    {antwortzeit != null && <> · {(antwortzeit / 1000).toFixed(1)} s</>}
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                  <span>anders bewerten:</span>
                  {SCHWIERIGKEITEN.map((s) => (
                    <button
                      key={s.key}
                      onClick={() => bewerten(s.key)}
                      disabled={speichert}
                      className="rounded px-2 py-1 ring-1 ring-slate-300 dark:ring-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
