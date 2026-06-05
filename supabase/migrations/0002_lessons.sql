-- ============================================================================
-- Koreanisch-Diktat – Migration 0002: Lektions-Modul
-- Lektionen als zentrale Einheit: Grammatik, Video (YouTube), Audio (privat),
-- Fortschritt. Plus privater Storage-Bucket für eigene Audiodateien.
-- Im Supabase SQL Editor ausführen (nach 0001).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- lessons: eine Lektion (gehört zur Buchserie, gruppiert Vokabeln + Medien).
-- lektion_nummer entspricht vocab_items.lektion_nummer (= Buch*100 + Lektion).
-- ----------------------------------------------------------------------------
create table if not exists public.lessons (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users (id) on delete cascade default auth.uid(),
  buch           integer,
  lektion_nummer integer not null,
  titel          text,
  beschreibung   text,
  reihenfolge    integer,
  erstellt_am    timestamptz not null default now(),
  unique (user_id, lektion_nummer)
);

create index if not exists lessons_user_idx on public.lessons (user_id, reihenfolge);

-- ----------------------------------------------------------------------------
-- lesson_resources: Inhalte einer Lektion (Grammatik / Video / Audio).
-- ----------------------------------------------------------------------------
create table if not exists public.lesson_resources (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users (id) on delete cascade default auth.uid(),
  lesson_id       uuid not null references public.lessons (id) on delete cascade,
  typ             text not null check (typ in ('grammatik', 'video', 'audio')),
  titel           text,
  inhalt          text,   -- Markdown (Grammatik)
  url             text,   -- YouTube-URL (Video)
  storage_pfad    text,   -- Pfad im privaten Bucket (Audio)
  reihenfolge     integer not null default 0,
  aktualisiert_am timestamptz not null default now()
);

create index if not exists lesson_resources_lesson_idx on public.lesson_resources (lesson_id, reihenfolge);

-- ----------------------------------------------------------------------------
-- lesson_progress: Lernfortschritt pro (Nutzer:in, Lektion).
-- ----------------------------------------------------------------------------
create table if not exists public.lesson_progress (
  user_id         uuid not null references auth.users (id) on delete cascade default auth.uid(),
  lesson_id       uuid not null references public.lessons (id) on delete cascade,
  status          text not null default 'offen' check (status in ('offen', 'in_arbeit', 'fertig')),
  aktualisiert_am timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table public.lessons          enable row level security;
alter table public.lesson_resources enable row level security;
alter table public.lesson_progress  enable row level security;

-- lessons
drop policy if exists "lessons_all_own" on public.lessons;
create policy "lessons_all_own" on public.lessons
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- lesson_resources
drop policy if exists "resources_all_own" on public.lesson_resources;
create policy "resources_all_own" on public.lesson_resources
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- lesson_progress
drop policy if exists "progress_all_own" on public.lesson_progress;
create policy "progress_all_own" on public.lesson_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================================
-- Backfill: Lektionen aus den vorhandenen Vokabeln erzeugen.
-- (läuft als Tabelleneigentümer im SQL Editor, daher user_id aus vocab_items)
-- ============================================================================
insert into public.lessons (user_id, buch, lektion_nummer, titel, reihenfolge)
select distinct
  user_id,
  (lektion_nummer / 100)               as buch,
  lektion_nummer,
  'Lektion ' || (lektion_nummer % 100) as titel,
  lektion_nummer                       as reihenfolge
from public.vocab_items
where lektion_nummer is not null
on conflict (user_id, lektion_nummer) do nothing;

-- ============================================================================
-- Privater Storage-Bucket für eigene Audiodateien (nur Eigentümer:in).
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('lektion-audio', 'lektion-audio', false)
on conflict (id) do nothing;

-- Pfad-basiert: Dateien liegen unter "<user_id>/<lesson_id>/<datei>".
-- Der erste Ordner muss die eigene User-ID sein.
drop policy if exists "audio_select_own" on storage.objects;
create policy "audio_select_own" on storage.objects
  for select using (
    bucket_id = 'lektion-audio'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
drop policy if exists "audio_insert_own" on storage.objects;
create policy "audio_insert_own" on storage.objects
  for insert with check (
    bucket_id = 'lektion-audio'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
drop policy if exists "audio_update_own" on storage.objects;
create policy "audio_update_own" on storage.objects
  for update using (
    bucket_id = 'lektion-audio'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
drop policy if exists "audio_delete_own" on storage.objects;
create policy "audio_delete_own" on storage.objects
  for delete using (
    bucket_id = 'lektion-audio'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
