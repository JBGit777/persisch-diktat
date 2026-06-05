-- ============================================================================
-- Persisch-Variante: Lernhinweis pro Vokabel.
-- Fügt vocab_items.hinweis hinzu (kurzer Gebrauchs-/Lernhinweis auf Deutsch,
-- z. B. Präsensstamm, Register, typische Verwendung). Wird im Diktat-Ergebnis
-- angezeigt. RLS gilt unverändert über die bestehenden Policies.
-- Im Supabase SQL Editor nach 0003 ausführen.
-- ============================================================================

alter table public.vocab_items
  add column if not exists hinweis text;
