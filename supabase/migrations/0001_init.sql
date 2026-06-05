-- ============================================================================
-- Koreanisch-Diktat – Initiale Datenbank-Migration
-- Führe dieses Skript im Supabase SQL Editor aus (siehe README, Schritt 3).
-- Alle Tabellen haben Row Level Security: jede:r Nutzer:in sieht nur die
-- eigenen Daten.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- vocab_items: die Vokabeln. Jede:r Nutzer:in besitzt die eigenen Importe.
-- ----------------------------------------------------------------------------
create table if not exists public.vocab_items (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users (id) on delete cascade default auth.uid(),
  hangul          text not null,
  romanisierung   text,
  deutsch         text not null,
  lektion_nummer  integer,
  beispielsatz_ko text,
  beispielsatz_de text,
  erstellt_am     timestamptz not null default now()
);

create index if not exists vocab_items_user_idx        on public.vocab_items (user_id);
create index if not exists vocab_items_user_lektion_idx on public.vocab_items (user_id, lektion_nummer);

-- ----------------------------------------------------------------------------
-- dictation_attempts: jeder Diktat-Versuch wird protokolliert.
-- ----------------------------------------------------------------------------
create table if not exists public.dictation_attempts (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references auth.users (id) on delete cascade default auth.uid(),
  vocab_item_id      uuid not null references public.vocab_items (id) on delete cascade,
  eingabe            text not null default '',
  korrekt            boolean not null default false,
  zeichen_genauigkeit double precision not null default 0,
  erstellt_am        timestamptz not null default now()
);

create index if not exists dictation_attempts_user_idx      on public.dictation_attempts (user_id);
create index if not exists dictation_attempts_user_zeit_idx on public.dictation_attempts (user_id, erstellt_am desc);

-- ----------------------------------------------------------------------------
-- review_state: SM-2 Spaced-Repetition-Zustand pro (Nutzer:in, Vokabel).
-- ----------------------------------------------------------------------------
create table if not exists public.review_state (
  user_id            uuid not null references auth.users (id) on delete cascade default auth.uid(),
  vocab_item_id      uuid not null references public.vocab_items (id) on delete cascade,
  ease_factor        double precision not null default 2.5,
  intervall          integer not null default 0,        -- in Tagen
  wiederholungen     integer not null default 0,        -- SM-2 "repetitions" (n)
  naechste_faelligkeit timestamptz not null default now(),
  aktualisiert_am    timestamptz not null default now(),
  primary key (user_id, vocab_item_id)
);

create index if not exists review_state_due_idx on public.review_state (user_id, naechste_faelligkeit);

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table public.vocab_items        enable row level security;
alter table public.dictation_attempts enable row level security;
alter table public.review_state        enable row level security;

-- vocab_items
drop policy if exists "vocab_select_own" on public.vocab_items;
create policy "vocab_select_own" on public.vocab_items
  for select using (auth.uid() = user_id);
drop policy if exists "vocab_insert_own" on public.vocab_items;
create policy "vocab_insert_own" on public.vocab_items
  for insert with check (auth.uid() = user_id);
drop policy if exists "vocab_update_own" on public.vocab_items;
create policy "vocab_update_own" on public.vocab_items
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "vocab_delete_own" on public.vocab_items;
create policy "vocab_delete_own" on public.vocab_items
  for delete using (auth.uid() = user_id);

-- dictation_attempts
drop policy if exists "attempts_select_own" on public.dictation_attempts;
create policy "attempts_select_own" on public.dictation_attempts
  for select using (auth.uid() = user_id);
drop policy if exists "attempts_insert_own" on public.dictation_attempts;
create policy "attempts_insert_own" on public.dictation_attempts
  for insert with check (auth.uid() = user_id);

-- review_state
drop policy if exists "review_select_own" on public.review_state;
create policy "review_select_own" on public.review_state
  for select using (auth.uid() = user_id);
drop policy if exists "review_insert_own" on public.review_state;
create policy "review_insert_own" on public.review_state
  for insert with check (auth.uid() = user_id);
drop policy if exists "review_update_own" on public.review_state;
create policy "review_update_own" on public.review_state
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "review_delete_own" on public.review_state;
create policy "review_delete_own" on public.review_state
  for delete using (auth.uid() = user_id);
