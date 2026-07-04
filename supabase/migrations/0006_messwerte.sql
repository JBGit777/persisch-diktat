-- ============================================================================
-- Messwerte pro Diktat-Versuch: Antwortzeit, Zieltext und klassifizierte
-- Fehlerarten (persische Fehler-Taxonomie). Basis für automatische Bewertung
-- und die persönliche Schwächenkarte. Rein additiv – bestehende Zeilen bleiben
-- gültig. Im Supabase SQL Editor nach 0005 ausführen.
-- ============================================================================

alter table public.dictation_attempts
  add column if not exists antwortzeit_ms integer,      -- Tippdauer der Antwort
  add column if not exists ziel           text,         -- erwarteter Zieltext
  add column if not exists fehler         jsonb;        -- [{art,gruppe,paar,…}]

-- Schnelles Aggregieren der Schwächen pro Nutzer.
create index if not exists dictation_attempts_user_fehler_idx
  on public.dictation_attempts (user_id)
  where fehler is not null;
