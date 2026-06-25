-- ============================================================================
-- Fußball-Wortschatz (Teil 5 – Themen, Lektion 501). Im Supabase SQL Editor
-- nach den übrigen Seeds ausführen. Idempotent. Über E-Mail verankert.
-- >>> App-Login-E-Mail: jreitzenstein@gmail.com
-- ============================================================================

-- 1) Lektion „Fußball"
insert into public.lessons (user_id, buch, lektion_nummer, titel, beschreibung, reihenfolge)
select (select id from auth.users where email='jreitzenstein@gmail.com'), 5, 501, 'Fußball', 'Teil 5 – Themen', 501
on conflict (user_id, lektion_nummer) do update
  set titel=excluded.titel, buch=excluded.buch, beschreibung=excluded.beschreibung, reihenfolge=excluded.reihenfolge;

-- 2) Vorherige Fußball-Vokabeln entfernen (idempotent)
delete from public.vocab_items where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and lektion_nummer = 501;

-- 3) 30 Fußball-Vokabeln
insert into public.vocab_items
  (user_id, hangul, romanisierung, deutsch, lektion_nummer, beispielsatz_ko, beispielsatz_de, hinweis, haeufigkeit)
select (select id from auth.users where email='jreitzenstein@gmail.com'), v.*
from (values
  ('فوتبال', 'futbâl', 'Fußball', 501, NULL, NULL, NULL, 3),
  ('تیم', 'tim', 'Mannschaft / Team', 501, NULL, NULL, NULL, 3),
  ('بازیکن', 'bâzikon', 'Spieler', 501, NULL, NULL, NULL, 3),
  ('مربی', 'morabbi', 'Trainer', 501, NULL, NULL, NULL, 3),
  ('دروازه‌بان', 'darvâze-bân', 'Torwart', 501, NULL, NULL, NULL, 3),
  ('مدافع', 'modâfe''', 'Verteidiger', 501, NULL, NULL, NULL, 3),
  ('هافبک', 'hâfbak', 'Mittelfeldspieler', 501, NULL, NULL, NULL, 3),
  ('مهاجم', 'mohâjem', 'Stürmer', 501, NULL, NULL, NULL, 3),
  ('گل', 'gol', 'Tor', 501, NULL, NULL, NULL, 3),
  ('مسابقه', 'mosâbeghe', 'Spiel / Match', 501, NULL, NULL, NULL, 3),
  ('ورزشگاه', 'varzeshgâh', 'Stadion', 501, NULL, NULL, NULL, 3),
  ('هوادار', 'havâdâr', 'Fan', 501, NULL, NULL, NULL, 3),
  ('داور', 'dâvar', 'Schiedsrichter', 501, NULL, NULL, NULL, 3),
  ('کاپیتان', 'kâpitân', 'Kapitän', 501, NULL, NULL, NULL, 3),
  ('پاس', 'pâs', 'Pass', 501, NULL, NULL, NULL, 3),
  ('شوت', 'shut', 'Schuss', 501, NULL, NULL, NULL, 3),
  ('کرنر', 'korner', 'Eckball', 501, NULL, NULL, NULL, 3),
  ('ضربه آزاد', 'zarbe-ye âzâd', 'Freistoß', 501, NULL, NULL, NULL, 3),
  ('پنالتی', 'penâlti', 'Elfmeter', 501, NULL, NULL, NULL, 3),
  ('کارت زرد', 'kârt-e zard', 'Gelbe Karte', 501, NULL, NULL, NULL, 3),
  ('کارت قرمز', 'kârt-e ghermez', 'Rote Karte', 501, NULL, NULL, NULL, 3),
  ('نیمه اول', 'nime-ye avval', 'Erste Halbzeit', 501, NULL, NULL, NULL, 3),
  ('نیمه دوم', 'nime-ye dovvom', 'Zweite Halbzeit', 501, NULL, NULL, NULL, 3),
  ('وقت اضافه', 'vaght-e ezâfe', 'Verlängerung', 501, NULL, NULL, NULL, 3),
  ('پیروزی', 'piruzi', 'Sieg', 501, NULL, NULL, NULL, 3),
  ('شکست', 'shekast', 'Niederlage', 501, NULL, NULL, NULL, 3),
  ('مساوی', 'mosâvi', 'Unentschieden', 501, NULL, NULL, NULL, 3),
  ('قهرمان', 'ghahremân', 'Meister', 501, NULL, NULL, NULL, 3),
  ('جام', 'jâm', 'Pokal', 501, NULL, NULL, NULL, 3),
  ('گروه', 'goruh', 'Gruppe', 501, NULL, NULL, NULL, 3)
) as v(hangul, romanisierung, deutsch, lektion_nummer, beispielsatz_ko, beispielsatz_de, hinweis, haeufigkeit);
