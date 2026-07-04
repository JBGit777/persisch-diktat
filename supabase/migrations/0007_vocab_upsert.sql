-- ============================================================================
-- Unique-Constraint für den kanonischen Seed (scripts/build.py).
-- Ermöglicht ein progress-schonendes UPSERT: bestehende Vokabeln werden an
-- Ort und Stelle aktualisiert (id bleibt → review_state/dictation_attempts
-- bleiben erhalten), statt gelöscht und neu eingefügt.
--
-- Sicherheits-Dedup vorab: falls es (durch manuelle Importe) versehentlich
-- exakte Dubletten gibt, wird die Zeile OHNE Übungsfortschritt entfernt.
-- Im Supabase SQL Editor nach 0006 ausführen.
-- ============================================================================

delete from public.vocab_items a
using public.vocab_items b
where a.user_id = b.user_id
  and a.hangul = b.hangul
  and a.lektion_nummer = b.lektion_nummer
  and a.ctid < b.ctid
  and not exists (
    select 1 from public.review_state r where r.vocab_item_id = a.id
  );

alter table public.vocab_items
  drop constraint if exists vocab_items_user_hangul_lektion_key;
alter table public.vocab_items
  add constraint vocab_items_user_hangul_lektion_key
  unique (user_id, hangul, lektion_nummer);
