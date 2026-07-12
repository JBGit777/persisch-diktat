#!/usr/bin/env python3
"""Erzeugt vorab persische TTS-Audios (MP3) für alle Wörter + Beispielsätze.

- Engine: edge-tts (Microsoft Edge Neural, gratis, kein API-Key), Stimme fa-IR.
- Dateiname = fnv1a64(normalizeFa(text)).mp3  → identisch zur App-Logik
  (src/lib/normalizeFa.ts + src/lib/audio.ts), damit der Client dieselbe URL bildet.
- Idempotent: bereits vorhandene Dateien werden übersprungen.

Aufruf:  python3 scripts/generate_tts.py [--voice fa-IR-DilaraNeural]
Quelle der Texte: supabase/seed/vokabeln.csv (Spalte hangul) + die Beispielsätze
aus supabase/seed/persisch_seed.sql.
"""
import argparse, asyncio, csv, re, sys, unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "tts"

def normalize_fa(s: str) -> str:
    s = unicodedata.normalize("NFC", s)
    s = s.replace("ي", "ی").replace("ك", "ک")
    s = re.sub(r"[ً-ْٰ]", "", s)
    s = s.replace("ـ", "")
    s = re.sub(r"[۰-۹]", lambda m: chr(ord(m.group(0)) - 0x06F0 + 48), s)
    s = re.sub(r"[٠-٩]", lambda m: chr(ord(m.group(0)) - 0x0660 + 48), s)
    s = s.replace("‌", "")
    return re.sub(r"\s+", " ", s).strip()

def normalize_de(s: str) -> str:
    """Muss identisch zu audioPfadDe() in src/lib/audio.ts sein."""
    s = unicodedata.normalize("NFC", s or "")
    return re.sub(r"\s+", " ", s).strip()

def fnv1a64(s: str) -> str:
    h = 14695981039346656037
    for b in s.encode("utf-8"):
        h ^= b
        h = (h * 1099511628211) & 0xFFFFFFFFFFFFFFFF
    return format(h, "016x")

def collect_texts() -> dict:
    """normhash -> roher Text (erste Fundstelle). Aus der EINEN Quelle
    data/vokabeln.json: jedes Wort + jeder Beispielsatz."""
    import json
    texts = {}
    def add(t):
        t = (t or "").strip()
        if t:
            texts.setdefault(fnv1a64(normalize_fa(t)), t)
    data = json.loads((ROOT / "data" / "vokabeln.json").read_text(encoding="utf-8"))
    for w in data["woerter"]:
        add(w.get("persisch"))
        add(w.get("beispielsatz_ko"))
    # Lesetexte (data/texte.json): jeder Satz bekommt Audio
    tp = ROOT / "data" / "texte.json"
    if tp.exists():
        for t in json.loads(tp.read_text(encoding="utf-8")).get("texte", []):
            for s in t.get("saetze", []):
                add(s.get("fa"))
    return texts

def collect_texts_de() -> dict:
    """normhash -> deutscher Satz. Für den Hörmodus („Deutsch dazwischen"):
    die Übersetzung jedes Lesetext-Satzes bekommt eine echte MP3 (de-DE),
    damit sie – anders als Web-Speech – auch im Hintergrund/Sperrbildschirm läuft."""
    import json
    texts = {}
    def add(t):
        t = (t or "").strip()
        if t:
            texts.setdefault(fnv1a64(normalize_de(t)), t)
    tp = ROOT / "data" / "texte.json"
    if tp.exists():
        for t in json.loads(tp.read_text(encoding="utf-8")).get("texte", []):
            for s in t.get("saetze", []):
                add(s.get("de"))
    return texts

async def synth(voice, items, out_dir=OUT, concurrency=8):
    import edge_tts
    out_dir.mkdir(parents=True, exist_ok=True)
    sem = asyncio.Semaphore(concurrency)
    done = {"n": 0, "err": 0}
    total = len(items)
    async def one(key, text):
        path = out_dir / f"{key}.mp3"
        if path.exists() and path.stat().st_size > 0:
            done["n"] += 1; return
        async with sem:
            for attempt in range(3):
                try:
                    await edge_tts.Communicate(text, voice).save(str(path))
                    break
                except Exception:
                    await asyncio.sleep(1.5 * (attempt + 1))
            else:
                done["err"] += 1
                print("FEHLER:", text, file=sys.stderr); return
        done["n"] += 1
        if done["n"] % 50 == 0:
            print(f"  {done['n']}/{total} …", flush=True)
    await asyncio.gather(*(one(k, t) for k, t in items.items()))
    return done

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--voice", default="fa-IR-DilaraNeural")
    ap.add_argument("--de-voice", default="de-DE-KatjaNeural")
    ap.add_argument("--skip-de", action="store_true", help="deutsche MP3s nicht erzeugen")
    args = ap.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)

    texts = collect_texts()
    print(f"{len(texts)} eindeutige persische Texte (Wörter + Sätze). Stimme: {args.voice}")
    done = asyncio.run(synth(args.voice, texts))
    print(f"Fertig (fa): {done['n']} erzeugt/vorhanden, {done['err']} Fehler.")

    if not args.skip_de:
        de_texts = collect_texts_de()
        print(f"{len(de_texts)} deutsche Übersetzungen (Hörmodus). Stimme: {args.de_voice}")
        done_de = asyncio.run(synth(args.de_voice, de_texts, OUT / "de"))
        print(f"Fertig (de): {done_de['n']} erzeugt/vorhanden, {done_de['err']} Fehler.")

    print(f"Dateien in: {OUT}")

if __name__ == "__main__":
    main()
