"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Square,
  Turtle,
  Repeat,
  Languages,
  Timer,
  Headphones,
} from "lucide-react";
import { audioPfad, audioPfadDe } from "@/lib/audio";

interface Satz {
  fa: string;
  de: string;
}
export interface HoerText {
  id: string;
  titel: string;
  titel_de: string;
  saetze: Satz[];
}
interface QItem {
  textId: string;
  titel: string;
  titelDe: string;
  idxImText: number;
  anzahl: number;
  fa: string;
  de: string;
}

/**
 * Hörmodus: spielt ausgewählte Lesetexte am Stück ab – Satz für Satz, ein Text
 * nahtlos nach dem anderen. Gedacht fürs Unterwegs-/Handy-Hören (auch bei
 * gesperrtem Bildschirm dank Media Session API, mit Sperrbildschirm-Steuerung).
 *
 * Optionen: langsam, deutsche Übersetzung zwischen den Sätzen (Web-Speech de-DE,
 * als Erinnerungshilfe), Wiederhol-Pause (Stille zum lauten Nachsprechen) und
 * Schleife über die ganze Wiedergabeliste. Audio kommt aus denselben vorab
 * erzeugten MP3s wie im Reader (hash-adressiert).
 */
export default function HoerModus({ texte }: { texte: HoerText[] }) {
  const [auswahl, setAuswahl] = useState<Set<string>>(
    () => new Set(texte.map((t) => t.id))
  );
  const [langsam, setLangsam] = useState(false);
  const [mitDeutsch, setMitDeutsch] = useState(false);
  const [wiederholPause, setWiederholPause] = useState(false);
  const [schleife, setSchleife] = useState(false);

  const [pos, setPos] = useState(0);
  const [laeuft, setLaeuft] = useState(false);
  const [pausiert, setPausiert] = useState(false);

  // Wiedergabeliste aus der Auswahl (in Textreihenfolge, satzweise).
  const queue = useMemo<QItem[]>(() => {
    const q: QItem[] = [];
    for (const t of texte) {
      if (!auswahl.has(t.id)) continue;
      t.saetze.forEach((s, i) =>
        q.push({
          textId: t.id,
          titel: t.titel,
          titelDe: t.titel_de,
          idxImText: i,
          anzahl: t.saetze.length,
          fa: s.fa,
          de: s.de,
        })
      );
    }
    return q;
  }, [texte, auswahl]);

  // Refs für die imperative Wiedergabe-Engine (kein Stale-Closure-Problem).
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const laeuftRef = useRef(false);
  const posRef = useRef(0);
  const queueRef = useRef(queue);
  const optRef = useRef({ langsam, mitDeutsch, wiederholPause, schleife });
  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);
  useEffect(() => {
    optRef.current = { langsam, mitDeutsch, wiederholPause, schleife };
  }, [langsam, mitDeutsch, wiederholPause, schleife]);

  function clearTimer() {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }
  function stopAudio() {
    if (audioRef.current) {
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window)
      window.speechSynthesis.cancel();
    clearTimer();
  }

  function setMediaState(state: MediaSessionPlaybackState) {
    if (typeof navigator !== "undefined" && "mediaSession" in navigator)
      navigator.mediaSession.playbackState = state;
  }

  function updateMediaSession(item: QItem) {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: item.fa,
        artist: `${item.titel} · ${item.titelDe}`,
        album: "Persisch-Diktat – Hörmodus",
      });
      navigator.mediaSession.playbackState = "playing";
    } catch {
      /* MediaMetadata evtl. nicht verfügbar */
    }
  }

  // Web-Speech-Fallback (nur falls die deutsche MP3 fehlt – z. B. neu ergänzter
  // Text ohne generiertes Audio). Läuft nicht im Hintergrund, daher zweite Wahl.
  function sprichDeutschWebSpeech(text: string, done: () => void) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      done();
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "de-DE";
    u.rate = 0.98;
    const v = window.speechSynthesis
      .getVoices()
      .find((s) => s.lang?.toLowerCase().startsWith("de"));
    if (v) u.voice = v;
    u.onend = done;
    u.onerror = () => done();
    window.speechSynthesis.speak(u);
  }

  // Deutsche Übersetzung als echte MP3 (hintergrundfähig), Web-Speech nur Notfall.
  function sprichDeutsch(text: string, done: () => void) {
    const a = new Audio(audioPfadDe(text));
    a.playbackRate = optRef.current.langsam ? 0.85 : 1;
    audioRef.current = a;
    let lief = false;
    a.onplaying = () => {
      lief = true;
    };
    a.onended = () => {
      if (laeuftRef.current) done();
    };
    a.onerror = () => {
      if (!lief) sprichDeutschWebSpeech(text, done); // MP3 fehlt → Fallback
    };
    a.play().catch(() => {
      if (!lief) sprichDeutschWebSpeech(text, done);
    });
  }

  function advance() {
    if (!laeuftRef.current) return;
    let next = posRef.current + 1;
    if (next >= queueRef.current.length) {
      if (optRef.current.schleife) next = 0;
      else {
        stopAll();
        return;
      }
    }
    posRef.current = next;
    setPos(next);
    playCurrent();
  }

  function playCurrent() {
    if (!laeuftRef.current) return;
    const item = queueRef.current[posRef.current];
    if (!item) {
      stopAll();
      return;
    }
    stopAudio();
    updateMediaSession(item);
    const a = new Audio(audioPfad(item.fa));
    a.playbackRate = optRef.current.langsam ? 0.7 : 1;
    audioRef.current = a;

    const proceed = () => {
      if (!laeuftRef.current) return;
      if (optRef.current.wiederholPause) {
        const dur =
          isFinite(a.duration) && a.duration > 0 ? a.duration * 1000 : 2500;
        clearTimer();
        timerRef.current = window.setTimeout(advance, Math.min(dur, 6000));
      } else advance();
    };
    const afterFarsi = () => {
      if (!laeuftRef.current) return;
      if (optRef.current.mitDeutsch) sprichDeutsch(item.de, proceed);
      else proceed();
    };
    a.onended = afterFarsi;
    a.onerror = () => {
      if (laeuftRef.current) advance();
    }; // fehlende MP3 → still überspringen
    a.play().catch(() => {
      if (laeuftRef.current) advance();
    });
  }

  function startAb(index: number) {
    if (queueRef.current.length === 0) return;
    posRef.current = Math.max(0, Math.min(index, queueRef.current.length - 1));
    setPos(posRef.current);
    laeuftRef.current = true;
    setLaeuft(true);
    setPausiert(false);
    playCurrent();
  }
  function pause() {
    laeuftRef.current = false; // laufende Callbacks abbrechen
    stopAudio();
    setPausiert(true);
    setMediaState("paused");
  }
  function resume() {
    if (queueRef.current.length === 0) return;
    laeuftRef.current = true;
    setPausiert(false);
    setLaeuft(true);
    playCurrent(); // aktuellen Satz erneut abspielen
  }
  function stopAll() {
    laeuftRef.current = false;
    stopAudio();
    setLaeuft(false);
    setPausiert(false);
    setMediaState("none");
  }
  function next() {
    if (queueRef.current.length === 0) return;
    startAb(posRef.current + 1 >= queueRef.current.length ? 0 : posRef.current + 1);
  }
  function prev() {
    if (queueRef.current.length === 0) return;
    startAb(posRef.current <= 0 ? 0 : posRef.current - 1);
  }
  function playPause() {
    if (laeuft && !pausiert) pause();
    else if (pausiert) resume();
    else startAb(pos);
  }

  // Media-Session-Handler (Sperrbildschirm / Kopfhörer) – stabil via Ref.
  const ctrlRef = useRef({ playPause, pause, resume, next, prev, stopAll, startAb, pos, laeuft, pausiert });
  ctrlRef.current = { playPause, pause, resume, next, prev, stopAll, startAb, pos, laeuft, pausiert };
  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
    const ms = navigator.mediaSession;
    const set = (a: MediaSessionAction, h: (() => void) | null) => {
      try {
        ms.setActionHandler(a, h);
      } catch {
        /* Aktion nicht unterstützt */
      }
    };
    set("play", () => {
      const c = ctrlRef.current;
      if (c.pausiert) c.resume();
      else if (!c.laeuft) c.startAb(c.pos);
    });
    set("pause", () => ctrlRef.current.pause());
    set("previoustrack", () => ctrlRef.current.prev());
    set("nexttrack", () => ctrlRef.current.next());
    set("stop", () => ctrlRef.current.stopAll());
    return () => {
      (["play", "pause", "previoustrack", "nexttrack", "stop"] as MediaSessionAction[]).forEach(
        (a) => set(a, null)
      );
    };
  }, []);

  // Aufräumen beim Verlassen.
  const stopRef = useRef(stopAll);
  stopRef.current = stopAll;
  useEffect(() => () => stopRef.current(), []);

  function toggleAuswahl(id: string) {
    setAuswahl((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  const aktuell = laeuft || pausiert ? queue[pos] : undefined;
  const gesamt = queue.length;
  const gesamtMin = Math.round((queue.length * 4.5) / 60); // grobe Schätzung ~4,5 s/Satz

  return (
    <div>
      <h1 className="flex items-center gap-2 text-2xl font-bold">
        <Headphones size={22} className="text-taeguk-blue" /> Hörmodus
      </h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Texte am Stück anhören – ein Text folgt nahtlos auf den nächsten. Ideal fürs
        Unterwegs-Hören: läuft mit gesperrtem Bildschirm weiter und lässt sich über die
        Sperrbildschirm-Tasten steuern.
      </p>

      {/* Player */}
      <div className="mt-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white shadow-lg ring-1 ring-slate-700">
        {aktuell ? (
          <>
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span lang="fa" dir="rtl" className="font-medium">
                {aktuell.titel}
              </span>
              <span>
                Satz {aktuell.idxImText + 1}/{aktuell.anzahl} · {pos + 1} von {gesamt}
              </span>
            </div>
            <p
              lang="fa"
              dir="rtl"
              className="mt-3 min-h-[3.5rem] text-right text-2xl leading-loose"
            >
              {aktuell.fa}
            </p>
            <p className="mt-1 text-right text-sm text-slate-300">{aktuell.de}</p>
          </>
        ) : (
          <p className="py-4 text-center text-sm text-slate-300">
            {gesamt > 0 ? (
              <>
                {gesamt} Sätze in der Wiedergabeliste (≈ {gesamtMin} Min). Auf ▶ tippen zum
                Starten.
              </>
            ) : (
              <>Keine Texte ausgewählt – unten mindestens einen Text anhaken.</>
            )}
          </p>
        )}

        {/* Fortschrittsbalken */}
        <div className="mt-4 h-1 overflow-hidden rounded-full bg-slate-700">
          <div
            className="h-full bg-taeguk-blue transition-all"
            style={{ width: gesamt ? `${((pos + 1) / gesamt) * 100}%` : "0%" }}
          />
        </div>

        {/* Transport */}
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            onClick={prev}
            disabled={gesamt === 0}
            className="rounded-full p-2 text-slate-200 transition hover:bg-white/10 disabled:opacity-40"
            aria-label="Vorheriger Satz"
          >
            <SkipBack size={22} />
          </button>
          <button
            onClick={playPause}
            disabled={gesamt === 0}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-taeguk-blue text-white shadow-md transition hover:brightness-110 active:scale-95 disabled:opacity-40"
            aria-label={laeuft && !pausiert ? "Pause" : "Abspielen"}
          >
            {laeuft && !pausiert ? <Pause size={26} /> : <Play size={26} className="ml-0.5" />}
          </button>
          <button
            onClick={next}
            disabled={gesamt === 0}
            className="rounded-full p-2 text-slate-200 transition hover:bg-white/10 disabled:opacity-40"
            aria-label="Nächster Satz"
          >
            <SkipForward size={22} />
          </button>
          {(laeuft || pausiert) && (
            <button
              onClick={stopAll}
              className="ml-2 rounded-full p-2 text-slate-300 transition hover:bg-white/10"
              aria-label="Stopp"
            >
              <Square size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Optionen */}
      <div className="mt-4 flex flex-wrap gap-2">
        <OptChip aktiv={langsam} onClick={() => setLangsam((v) => !v)} icon={<Turtle size={15} />}>
          Langsam
        </OptChip>
        <OptChip
          aktiv={mitDeutsch}
          onClick={() => setMitDeutsch((v) => !v)}
          icon={<Languages size={15} />}
          titel="Nach jedem Satz die deutsche Übersetzung vorlesen"
        >
          Deutsch dazwischen
        </OptChip>
        <OptChip
          aktiv={wiederholPause}
          onClick={() => setWiederholPause((v) => !v)}
          icon={<Timer size={15} />}
          titel="Nach jedem Satz eine Pause zum lauten Nachsprechen"
        >
          Wiederhol-Pause
        </OptChip>
        <OptChip aktiv={schleife} onClick={() => setSchleife((v) => !v)} icon={<Repeat size={15} />}>
          Schleife
        </OptChip>
      </div>

      {/* Wiedergabeliste */}
      <h2 className="mt-6 text-sm font-semibold text-slate-500 dark:text-slate-400">
        Wiedergabeliste {laeuft || pausiert ? "(Auswahl während der Wiedergabe gesperrt)" : ""}
      </h2>
      <div className="mt-2 space-y-2">
        {texte.map((t) => {
          const anStelle = queue.findIndex((q) => q.textId === t.id);
          const aktiverText = aktuell?.textId === t.id;
          const gewaehlt = auswahl.has(t.id);
          return (
            <div
              key={t.id}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ring-1 transition ${
                aktiverText
                  ? "bg-taeguk-blue/10 ring-taeguk-blue/40"
                  : "bg-white ring-slate-200 dark:bg-slate-800 dark:ring-slate-700"
              }`}
            >
              <input
                type="checkbox"
                checked={gewaehlt}
                disabled={laeuft || pausiert}
                onChange={() => toggleAuswahl(t.id)}
                className="h-4 w-4 shrink-0 accent-taeguk-blue disabled:opacity-40"
                aria-label={`${t.titel_de} in die Liste aufnehmen`}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span lang="fa" dir="rtl" className="truncate font-semibold">
                    {t.titel}
                  </span>
                  <span className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {t.titel_de}
                  </span>
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {t.saetze.length} Sätze
                </span>
              </div>
              <button
                onClick={() => anStelle >= 0 && startAb(anStelle)}
                disabled={!gewaehlt || anStelle < 0}
                className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold text-taeguk-blue ring-1 ring-taeguk-blue/40 transition hover:bg-taeguk-blue/10 disabled:opacity-40"
              >
                Ab hier
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OptChip({
  aktiv,
  onClick,
  icon,
  titel,
  children,
}: {
  aktiv: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  titel?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={titel}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium ring-1 transition ${
        aktiv
          ? "bg-taeguk-blue/10 text-taeguk-blue ring-taeguk-blue/40"
          : "text-slate-600 ring-slate-300 hover:bg-slate-100 dark:text-slate-300 dark:ring-slate-600 dark:hover:bg-slate-700"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}
