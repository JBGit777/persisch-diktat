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

def fnv1a64(s: str) -> str:
    h = 14695981039346656037
    for b in s.encode("utf-8"):
        h ^= b
        h = (h * 1099511628211) & 0xFFFFFFFFFFFFFFFF
    return format(h, "016x")

def collect_texts() -> dict:
    """normhash -> roher Text (erste Fundstelle). Wörter + Beispielsätze."""
    texts = {}
    def add(t):
        t = (t or "").strip()
        if not t:
            return
        key = fnv1a64(normalize_fa(t))
        texts.setdefault(key, t)
    # Wörter aus der CSV
    with open(ROOT / "supabase/seed/vokabeln.csv", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            add(row["hangul"])
    # Wörter + Beispielsätze aus den SQL-Seeds (hangul = 1. Feld, beispielsatz_ko = 5. Feld)
    sql = "\n".join(
        (ROOT / "supabase/seed" / name).read_text(encoding="utf-8")
        for name in ("persisch_seed.sql", "fussball_seed.sql", "seed_persische_phrasen.sql")
        if (ROOT / "supabase/seed" / name).exists()
    )
    for m in re.finditer(r"^\s{2}\((.*)\),?\s*$", sql, re.M):
        fields, cur, q, i = [], "", False, 0
        line = m.group(1)
        while i < len(line):
            ch = line[i]
            if ch == "'":
                if q and i + 1 < len(line) and line[i + 1] == "'":
                    cur += "'"; i += 2; continue
                q = not q
            elif ch == "," and not q:
                fields.append(cur); cur = ""; i += 1; continue
            else:
                cur += ch
            i += 1
        fields.append(cur)
        if len(fields) == 8:  # Vokabel-Tupel (Quotes sind oben bereits entfernt)
            w = fields[0].strip()  # hangul (persisches Wort)
            if w and w != "NULL":
                add(w)
            ex = fields[4].strip()  # beispielsatz_ko
            if ex and ex != "NULL":
                add(ex)
    return texts

async def synth(voice, items, concurrency=8):
    import edge_tts
    sem = asyncio.Semaphore(concurrency)
    done = {"n": 0, "err": 0}
    total = len(items)
    async def one(key, text):
        path = OUT / f"{key}.mp3"
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
    args = ap.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)
    texts = collect_texts()
    print(f"{len(texts)} eindeutige Texte (Wörter + Sätze). Stimme: {args.voice}")
    done = asyncio.run(synth(args.voice, texts))
    print(f"Fertig: {done['n']} erzeugt/vorhanden, {done['err']} Fehler.")
    print(f"Dateien in: {OUT}")

if __name__ == "__main__":
    main()
