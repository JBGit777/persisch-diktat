#!/usr/bin/env python3
"""Prüft die Lesetexte (data/texte.json) gegen den Wortschatz (data/vokabeln.json).

Gibt pro Text aus: wie viele Wörter im Wortschatz sind (werden im Reader verlinkt)
und welche NICHT (Kandidaten zum Ergänzen). Match-Logik konservativ, identisch zu
src/lib/wortlink.ts (exakt + Ezafe-Hamza + Plural ‌ها + Ezafe-ی).

  python3 scripts/check_texte.py
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def norm(s: str) -> str:
    s = s.replace("ي", "ی").replace("ك", "ک").replace("‌", "").replace("ـ", "")
    s = re.sub(r"[ً-ْٰ]", "", s)
    return re.sub(r"\s+", " ", s).strip()


def finde(token: str, vok: set) -> str | None:
    clean = re.sub(r"[،.:؛!؟?().«»\"'…]", "", token).strip()
    if not clean:
        return None
    n = norm(clean)
    oh = n.replace("ٔ", "")
    for k in (n, oh, re.sub(r"(های|ها)$", "", oh), re.sub(r"ی$", "", oh)):
        if k and k in vok:
            return k
    return None


def main():
    vok = {norm(w["persisch"]) for w in json.loads((ROOT / "data/vokabeln.json").read_text("utf-8"))["woerter"]}
    daten = json.loads((ROOT / "data/texte.json").read_text("utf-8"))
    for t in daten["texte"]:
        uniq = {}
        for s in t["saetze"]:
            for tok in s["fa"].split():
                key = re.sub(r"[،.:؛!؟?().«»\"'…]", "", tok)
                if key:
                    uniq.setdefault(key, finde(tok, vok))
        drin = {k: v for k, v in uniq.items() if v}
        fehlt = [k for k, v in uniq.items() if not v]
        print(f"\n=== {t['titel']} ({t.get('titel_de','')}) ===")
        print(f"Wörter gesamt: {len(uniq)} | im Wortschatz (verlinkt): {len(drin)} | fehlen: {len(fehlt)}")
        print("Nicht im Wortschatz:", " ، ".join(fehlt) if fehlt else "keine")


if __name__ == "__main__":
    main()
