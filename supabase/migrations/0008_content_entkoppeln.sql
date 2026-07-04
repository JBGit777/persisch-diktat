-- ============================================================================
-- Inhalte vom Nutzerkonto entkoppeln (Absicherung).
--
-- Vorher: vocab_items / lessons / lesson_resources hängen per
-- ON DELETE CASCADE am Kurator-Konto — wird das Konto gelöscht, verschwindet
-- der gesamte Lernstoff für ALLE Nutzer. Diese Migration stellt die drei
-- Inhalts-Tabellen auf ON DELETE SET NULL um: beim Löschen des Kontos bleiben
-- die Inhalte erhalten (user_id wird NULL) und sind dank der Shared-Content-
-- Lese-Policies (0005) weiterhin für alle Angemeldeten sichtbar.
--
-- Persönliche Daten bleiben bewusst kaskadierend (Konto löschen = eigene
-- review_state / dictation_attempts / lesson_progress werden entfernt).
--
-- Reparatur nach einem Kontoverlust („Re-Adopt"): verwaiste Inhalte einem
-- neuen Kurator-Konto zuweisen, damit Upsert-Seeds wieder greifen:
--   update public.vocab_items      set user_id = (select id from auth.users where email='NEU@MAIL') where user_id is null;
--   update public.lessons          set user_id = (select id from auth.users where email='NEU@MAIL') where user_id is null;
--   update public.lesson_resources set user_id = (select id from auth.users where email='NEU@MAIL') where user_id is null;
--
-- Im Supabase SQL Editor nach 0007 ausführen.
-- ============================================================================

-- vocab_items
alter table public.vocab_items alter column user_id drop not null;
alter table public.vocab_items drop constraint if exists vocab_items_user_id_fkey;
alter table public.vocab_items
  add constraint vocab_items_user_id_fkey
  foreign key (user_id) references auth.users (id) on delete set null;

-- lessons
alter table public.lessons alter column user_id drop not null;
alter table public.lessons drop constraint if exists lessons_user_id_fkey;
alter table public.lessons
  add constraint lessons_user_id_fkey
  foreign key (user_id) references auth.users (id) on delete set null;

-- lesson_resources (Grammatik-Notizen)
alter table public.lesson_resources alter column user_id drop not null;
alter table public.lesson_resources drop constraint if exists lesson_resources_user_id_fkey;
alter table public.lesson_resources
  add constraint lesson_resources_user_id_fkey
  foreign key (user_id) references auth.users (id) on delete set null;
