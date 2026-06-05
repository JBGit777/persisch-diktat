-- ============================================================================
-- Ergänzt fehlende Präsensstämme bei Verben – ADDITIV (kein Daten-/Fortschrittsverlust).
-- Setzt den Stamm nur, wenn der Hinweis noch keinen enthält (idempotent).
-- Im Supabase SQL Editor ausführen.
-- >>> App-Login-E-Mail: jreitzenstein@gmail.com
-- ============================================================================

update public.vocab_items
set hinweis = 'Präsensstamm: دان. ' || coalesce(nullif(hinweis, ''), '')
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'دانستن'
  and (hinweis is null or hinweis not like 'Präsensstamm:%');

update public.vocab_items
set hinweis = 'Präsensstamm: آی. ' || coalesce(nullif(hinweis, ''), '')
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'آمدن'
  and (hinweis is null or hinweis not like 'Präsensstamm:%');

update public.vocab_items
set hinweis = 'Präsensstamm: یاب. ' || coalesce(nullif(hinweis, ''), '')
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'یافتن'
  and (hinweis is null or hinweis not like 'Präsensstamm:%');

update public.vocab_items
set hinweis = 'Präsensstamm: آور. ' || coalesce(nullif(hinweis, ''), '')
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'آوردن'
  and (hinweis is null or hinweis not like 'Präsensstamm:%');

update public.vocab_items
set hinweis = 'Präsensstamm: ده. ' || coalesce(nullif(hinweis, ''), '')
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'نشان دادن'
  and (hinweis is null or hinweis not like 'Präsensstamm:%');

update public.vocab_items
set hinweis = 'Präsensstamm: شای. ' || coalesce(nullif(hinweis, ''), '')
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'شایستن'
  and (hinweis is null or hinweis not like 'Präsensstamm:%');
