-- ============================================================================
-- Migration 0003: Häufigkeit/Wichtigkeit pro Vokabel (1 = selten … 5 = Kernwortschatz)
-- Im Supabase SQL Editor ausführen. Danach supabase/seed/haeufigkeit.sql laufen lassen.
-- ============================================================================
alter table public.vocab_items
  add column if not exists haeufigkeit smallint
  check (haeufigkeit between 1 and 5);

create index if not exists vocab_items_haeufigkeit_idx
  on public.vocab_items (user_id, haeufigkeit);
