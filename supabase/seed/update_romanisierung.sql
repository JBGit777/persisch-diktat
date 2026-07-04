-- Vereinheitlicht die Umschrift: Makron ā -> Zirkumflex â (Konsistenz mit
-- dem übrigen Wortschatz; Suche & A–Z-Sortierung im Lexikon). Idempotent.
update public.vocab_items
set romanisierung = replace(replace(romanisierung, 'ā', 'â'), 'Ā', 'Â')
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com')
  and (romanisierung like '%ā%' or romanisierung like '%Ā%');
