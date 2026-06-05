"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { audioPfad } from "@/lib/audio";

/**
 * Persische Sprachausgabe.
 *
 * Strategie (in dieser Reihenfolge):
 *   1. **Vorab erzeugte MP3** unter /tts/<hash>.mp3 (siehe scripts/generate_tts.py,
 *      Stimme fa-IR Neural). Zuverlässig auf iPhone/iPad/Mac, offline-fähig.
 *   2. **Web Speech API** (fa-IR) als Fallback – nur falls eine Datei fehlt
 *      (z. B. selbst hinzugefügte Wörter) UND das Gerät eine fa-Stimme hat.
 *   3. Sonst lautlos (selten, nur bei Eigen-Importen ohne fa-Systemstimme).
 *
 * Da der feste Wortschatz vollständig vertont ist, funktioniert der Hör-Modus
 * jetzt überall – unabhängig von der (auf iOS/macOS meist fehlenden) fa-Stimme.
 */

const FA_LANG = "fa-IR";
let aktuellesAudio: HTMLAudioElement | null = null;

function stopAlles() {
  if (aktuellesAudio) {
    aktuellesAudio.pause();
    aktuellesAudio = null;
  }
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

function faStimme(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const fa = window.speechSynthesis
    .getVoices()
    .filter((s) => s.lang?.toLowerCase().startsWith("fa"));
  if (fa.length === 0) return null;
  return (
    fa.find((s) => /premium|enhanced|neural|natural|siri/i.test(s.name)) ??
    fa.find((s) => s.localService) ??
    fa.find((s) => s.lang === FA_LANG) ??
    fa[0]
  );
}

/** Web-Speech-Fallback (nur wenn keine MP3 vorhanden ist). */
function sprichWebSpeech(text: string, rate: number, onEnde?: () => void) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    onEnde?.();
    return;
  }
  window.speechSynthesis.cancel();
  const a = new SpeechSynthesisUtterance(text);
  a.lang = FA_LANG;
  a.rate = rate;
  const v = faStimme();
  if (v) a.voice = v;
  a.onend = () => onEnde?.();
  a.onerror = () => onEnde?.();
  window.speechSynthesis.speak(a);
}

/**
 * Spricht `text` – MP3 zuerst, sonst Web-Speech. `rate < 1` = langsam.
 * `onStart`/`onEnde` melden den Sprechzustand (für UI-Anzeigen).
 */
function sprichIntern(
  text: string,
  rate: number,
  onStart?: () => void,
  onEnde?: () => void
) {
  if (typeof window === "undefined") return;
  stopAlles();
  const audio = new Audio(audioPfad(text));
  audio.playbackRate = rate < 1 ? 0.65 : 1; // MP3 hat feste Sprechgeschwindigkeit
  aktuellesAudio = audio;
  let lief = false;
  audio.onplaying = () => {
    lief = true;
    onStart?.();
  };
  audio.onended = () => {
    if (aktuellesAudio === audio) aktuellesAudio = null;
    onEnde?.();
  };
  const fallback = () => {
    if (lief) return; // MP3 lief bereits – kein Fallback
    if (aktuellesAudio === audio) aktuellesAudio = null;
    sprichWebSpeech(text, rate, onEnde);
  };
  audio.onerror = fallback; // z. B. 404 (keine vorab erzeugte Datei)
  audio.play().catch(fallback); // z. B. Autoplay-Blockade
}

/** Spricht persischen Text direkt aus – leichtgewichtig, ohne Hook. */
export function sprichPersisch(text: string, rate = 1) {
  sprichIntern(text, rate);
}

/** Sprachausgabe grundsätzlich möglich? (Audio-Element + Browser) */
export function ttsVerfuegbar(): boolean {
  return typeof window !== "undefined" && typeof Audio !== "undefined";
}

/**
 * Hook für persische Sprachausgabe. `unterstuetzt` ist `true`, sobald der
 * Browser Audio abspielen kann – der vertonte Wortschatz funktioniert dann
 * unabhängig von einer fa-Systemstimme.
 */
export function usePersischTTS() {
  const [unterstuetzt, setUnterstuetzt] = useState(false);
  const [spricht, setSpricht] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    setUnterstuetzt(ttsVerfuegbar());
    return () => {
      mounted.current = false;
    };
  }, []);

  const sprich = useCallback((text: string, rate = 1) => {
    sprichIntern(
      text,
      rate,
      () => mounted.current && setSpricht(true),
      () => mounted.current && setSpricht(false)
    );
  }, []);

  const stop = useCallback(() => {
    stopAlles();
    setSpricht(false);
  }, []);

  return { unterstuetzt, spricht, sprich, stop };
}
