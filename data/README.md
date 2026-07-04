# Kanonische Datenquelle

**`vokabeln.json` ist die _einzige_ Quelle der Wahrheit** für den Wortschatz.
Alles andere (SQL-Seed, CSV, Audio) wird daraus **deterministisch erzeugt** –
niemals von Hand editieren.

## Aufbau von `vokabeln.json`

```jsonc
{
  "lektionen": [
    { "lektion_nummer": 501, "buch": 5, "titel": "Fußball", "beschreibung": "Teil 5 – Themen" }
  ],
  "woerter": [
    {
      "persisch": "دروازه‌بان",       // inkl. ZWNJ wo nötig
      "romanisierung": "darvâze-bân", // â (Zirkumflex), nicht ā
      "deutsch": "Torwart",
      "lektion_nummer": 501,
      "beispielsatz_ko": "دروازه‌بان توپ را گرفت.",  // optional
      "beispielsatz_de": "Der Torwart hielt den Ball.", // optional
      "hinweis": null,                // optional (z. B. Präsensstamm)
      "haeufigkeit": 3                // 1–5
    }
  ]
}
```

`buch` = Teil (1–6). `lektion_nummer` = Teil·100 + laufende Nummer.

## Neue Vokabeln / Änderungen einspielen

```bash
# 1. vokabeln.json bearbeiten (Wort/Lektion hinzufügen oder ändern)

# 2. Seed + CSV erzeugen und Daten prüfen
python3 scripts/build.py
#    → supabase/seed/seed.sql, supabase/seed/vokabeln.csv
#    → prüft: Pflichtfelder, Dubletten, Lektions-Metadaten, Schreibkonvention (â),
#             Audio-Abdeckung

# 3. Fehlende Audios erzeugen (nur neue Texte)
python3 scripts/generate_tts.py

# 4. commit + push  (Vercel deployt Audio automatisch)

# 5. supabase/seed/seed.sql im Supabase SQL Editor ausführen
#    → Upsert: aktualisiert bestehende Zeilen IN PLACE (kein Fortschrittsverlust)
```

## Warum Upsert?

`seed.sql` nutzt `on conflict (user_id, hangul, lektion_nummer) do update` –
bestehende Vokabeln werden aktualisiert statt gelöscht+neu eingefügt. Dadurch
bleiben `review_state` (SRS) und `dictation_attempts` (Statistik/Schwächen)
erhalten. Voraussetzung: Migration `0007_vocab_upsert.sql` (Unique-Constraint).

> Grammatik-Notizen liegen separat in `supabase/seed/grammatik_seed.sql`
> (lesson_resources) – nicht Teil dieser Vokabel-Pipeline.
