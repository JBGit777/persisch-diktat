#!/usr/bin/env python3
"""Build-Skript für die kanonische Datenquelle.

EINE Quelle:  data/vokabeln.json  ->  erzeugt deterministisch:
  - supabase/seed/seed.sql   (Upsert-Seed, progress-schonend, E-Mail-verankert)
  - supabase/seed/vokabeln.csv
und PRÜFT die Daten (Pflichtfelder, Dubletten, Lektions-Metadaten,
Schreibkonvention â statt ā) sowie die Audio-Abdeckung (public/tts).

Workflow für neue/aktualisierte Vokabeln:
  1. data/vokabeln.json bearbeiten (Wort/Lektion hinzufügen oder ändern)
  2. python3 scripts/build.py            # erzeugt Seed + CSV, prüft alles
  3. python3 scripts/generate_tts.py     # erzeugt fehlende Audios
  4. supabase/seed/seed.sql im SQL Editor ausführen (aktualisiert in place)

Kein SQL-Editor-Gefummel mehr, keine verstreuten Teil-Seeds.
"""
import csv
import json
import re
import sys
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data" / "vokabeln.json"
SEED = ROOT / "supabase" / "seed" / "seed.sql"
CSV = ROOT / "supabase" / "seed" / "vokabeln.csv"
TTS = ROOT / "public" / "tts"
EMAIL = "jreitzenstein@gmail.com"


# ---- Hash/Normalisierung (identisch zu src/lib/audio.ts) für Audio-Check ----
def normalize_fa(s: str) -> str:
    s = unicodedata.normalize("NFC", s)
    s = s.replace("ي", "ی").replace("ك", "ک")
    s = re.sub(r"[ً-ْٰ]", "", s).replace("ـ", "")
    s = re.sub(r"[۰-۹]", lambda m: chr(ord(m.group(0)) - 0x06F0 + 48), s)
    s = re.sub(r"[٠-٩]", lambda m: chr(ord(m.group(0)) - 0x0660 + 48), s)
    return re.sub(r"\s+", " ", s.replace("‌", "")).strip()


def fnv1a64(s: str) -> str:
    h = 14695981039346656037
    for b in s.encode("utf-8"):
        h = ((h ^ b) * 1099511628211) & 0xFFFFFFFFFFFFFFFF
    return format(h, "016x")


def q(v):
    if v is None or v == "":
        return "NULL"
    if isinstance(v, (int, float)):
        return str(int(v))
    return "'" + str(v).replace("'", "''") + "'"


def pruefe(data) -> list:
    """Harte Prüfungen – gibt Liste von Fehlern zurück (leer = alles gut)."""
    fehler = []
    lekset = {l["lektion_nummer"] for l in data["lektionen"]}
    seen = set()
    for i, w in enumerate(data["woerter"]):
        wo = f"Wort #{i} ({w.get('persisch','?')})"
        if not w.get("persisch") or not w.get("deutsch"):
            fehler.append(f"{wo}: persisch/deutsch fehlt")
        if w.get("lektion_nummer") not in lekset:
            fehler.append(f"{wo}: Lektion {w.get('lektion_nummer')} ohne Metadaten")
        key = (w.get("persisch"), w.get("lektion_nummer"))
        if key in seen:
            fehler.append(f"{wo}: Dublette in Lektion {w.get('lektion_nummer')}")
        seen.add(key)
        if "ā" in (w.get("romanisierung") or ""):
            fehler.append(f"{wo}: Romanisierung nutzt ā statt â")
    for l in data["lektionen"]:
        if not l.get("titel"):
            fehler.append(f"Lektion {l['lektion_nummer']}: kein Titel")
    return fehler


def erzeuge_seed(data) -> str:
    sub = f"(select id from auth.users where email='{EMAIL}')"
    o = [
        "-- ============================================================================",
        "-- KANONISCHER SEED – automatisch erzeugt aus data/vokabeln.json (scripts/build.py).",
        "-- NICHT von Hand editieren – Änderungen in data/vokabeln.json vornehmen.",
        "-- Upsert-basiert: aktualisiert bestehende Zeilen in place → Übungsfortschritt",
        "-- (review_state / dictation_attempts) bleibt erhalten.",
        "-- Voraussetzung: Migrationen 0001–0007. Im Supabase SQL Editor ausführen.",
        f"-- App-Login-E-Mail: {EMAIL}",
        "-- ============================================================================",
        "",
        "-- 1) Lektionen (Upsert)",
        "insert into public.lessons (user_id, buch, lektion_nummer, titel, beschreibung, reihenfolge)",
        f"select {sub}, v.buch, v.lektion_nummer, v.titel, v.beschreibung, v.lektion_nummer",
        "from (values",
    ]
    lek = sorted(data["lektionen"], key=lambda l: l["lektion_nummer"])
    o.append(",\n".join(
        f"  ({q(l['buch'])}, {q(l['lektion_nummer'])}, {q(l['titel'])}, {q(l.get('beschreibung'))})"
        for l in lek
    ))
    o += [
        ") as v(buch, lektion_nummer, titel, beschreibung)",
        "on conflict (user_id, lektion_nummer) do update set",
        "  buch=excluded.buch, titel=excluded.titel, beschreibung=excluded.beschreibung,",
        "  reihenfolge=excluded.reihenfolge;",
        "",
        "-- 2) Vokabeln (Upsert über (user_id, hangul, lektion_nummer))",
        "insert into public.vocab_items",
        "  (user_id, hangul, romanisierung, deutsch, lektion_nummer, beispielsatz_ko, beispielsatz_de, hinweis, haeufigkeit)",
        f"select {sub}, v.*",
        "from (values",
    ]
    woerter = sorted(data["woerter"], key=lambda w: (w["lektion_nummer"], w["persisch"]))
    rows, cur = [], None
    for w in woerter:
        if w["lektion_nummer"] != cur:
            cur = w["lektion_nummer"]
            rows.append(f"  -- L{cur}")
        rows.append("  (" + ", ".join([
            q(w["persisch"]), q(w.get("romanisierung")), q(w["deutsch"]),
            q(w["lektion_nummer"]), q(w.get("beispielsatz_ko")),
            q(w.get("beispielsatz_de")), q(w.get("hinweis")), q(w.get("haeufigkeit") or 3),
        ]) + ")")
    # Kommas nur an Datenzeilen, letzte ohne
    daten_idx = [i for i, r in enumerate(rows) if not r.strip().startswith("--")]
    body = []
    for i, r in enumerate(rows):
        if r.strip().startswith("--"):
            body.append(r)
        else:
            body.append(r + ("," if i != daten_idx[-1] else ""))
    o.append("\n".join(body))
    o += [
        ") as v(hangul, romanisierung, deutsch, lektion_nummer, beispielsatz_ko, beispielsatz_de, hinweis, haeufigkeit)",
        "on conflict (user_id, hangul, lektion_nummer) do update set",
        "  romanisierung=excluded.romanisierung, deutsch=excluded.deutsch,",
        "  beispielsatz_ko=excluded.beispielsatz_ko, beispielsatz_de=excluded.beispielsatz_de,",
        "  hinweis=excluded.hinweis, haeufigkeit=excluded.haeufigkeit;",
        "",
    ]
    return "\n".join(o)


def audio_luecken(data) -> list:
    fehlt = []
    for w in data["woerter"]:
        for t in (w["persisch"], w.get("beispielsatz_ko")):
            if t and not (TTS / f"{fnv1a64(normalize_fa(t))}.mp3").exists():
                fehlt.append(t)
    return sorted(set(fehlt))


def main():
    data = json.loads(DATA.read_text(encoding="utf-8"))
    fehler = pruefe(data)
    if fehler:
        print("✗ PRÜFUNG FEHLGESCHLAGEN:")
        for f in fehler[:40]:
            print("   -", f)
        sys.exit(1)
    print(f"✓ Prüfung ok: {len(data['woerter'])} Wörter, {len(data['lektionen'])} Lektionen")

    SEED.write_text(erzeuge_seed(data), encoding="utf-8")
    print(f"✓ {SEED.relative_to(ROOT)} erzeugt")

    with open(CSV, "w", encoding="utf-8", newline="") as f:
        wr = csv.writer(f)
        wr.writerow(["hangul", "romanisierung", "deutsch", "lektion"])
        for w in sorted(data["woerter"], key=lambda x: (x["lektion_nummer"], x["persisch"])):
            wr.writerow([w["persisch"], w.get("romanisierung") or "", w["deutsch"], w["lektion_nummer"]])
    print(f"✓ {CSV.relative_to(ROOT)} erzeugt")

    luecken = audio_luecken(data)
    if luecken:
        print(f"⚠ {len(luecken)} Texte ohne Audio – führe aus: python3 scripts/generate_tts.py")
    else:
        print("✓ Audio vollständig (alle Wörter + Beispielsätze vertont)")


if __name__ == "__main__":
    main()
