-- ============================================================================
-- Gemeinsamer Lernstoff: Vokabeln, Lektionen und Grammatik sind für ALLE
-- angemeldeten Nutzer:innen LESBAR. So muss nur einmal geseedet werden
-- (Eigentümer-Konto), und jeder neue Nutzer sieht denselben Wortschatz.
--
-- Unverändert privat bleiben: das SCHREIBEN von Inhalten (nur Eigentümer)
-- sowie der gesamte FORTSCHRITT pro Nutzer
-- (review_state, dictation_attempts, lesson_progress) – jede:r übt mit eigenem
-- SRS-Stand und eigenen Statistiken.
--
-- Technik: zusätzliche „permissive" SELECT-Policies (Policies werden ODER-
-- verknüpft). Die bestehenden Eigentümer-Policies regeln weiterhin INSERT/
-- UPDATE/DELETE. Im Supabase SQL Editor nach 0004 ausführen.
--
-- Hinweis: Der Lernstoff „gehört" dem Konto, das ihn geseedet hat
-- (jreitzenstein@gmail.com). Dieses Konto bitte NICHT löschen – sonst werden
-- die Inhalte (per ON DELETE CASCADE) für alle entfernt.
-- ============================================================================

-- Vokabeln: für alle Angemeldeten lesbar
drop policy if exists "vocab_select_all_auth" on public.vocab_items;
create policy "vocab_select_all_auth" on public.vocab_items
  for select to authenticated using (true);

-- Lektionen: für alle Angemeldeten lesbar
drop policy if exists "lessons_select_all_auth" on public.lessons;
create policy "lessons_select_all_auth" on public.lessons
  for select to authenticated using (true);

-- Lektions-Inhalte (Grammatik): für alle Angemeldeten lesbar
drop policy if exists "resources_select_all_auth" on public.lesson_resources;
create policy "resources_select_all_auth" on public.lesson_resources
  for select to authenticated using (true);
