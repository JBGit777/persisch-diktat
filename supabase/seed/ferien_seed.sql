-- ============================================================================
-- Ferien-Wortschatz (Teil 5 – Themen, Lektion 502). Quelle: Ferien.docx.
-- Mit Umschrift, Beispielsätzen (fa+de). Idempotent, über E-Mail verankert.
-- >>> App-Login-E-Mail: jreitzenstein@gmail.com
-- Im Supabase SQL Editor ausführen.
-- ============================================================================

insert into public.lessons (user_id, buch, lektion_nummer, titel, beschreibung, reihenfolge)
select (select id from auth.users where email='jreitzenstein@gmail.com'), 5, 502, 'Ferien', 'Teil 5 – Themen', 502
on conflict (user_id, lektion_nummer) do update
  set titel=excluded.titel, buch=excluded.buch, beschreibung=excluded.beschreibung, reihenfolge=excluded.reihenfolge;

delete from public.vocab_items where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and lektion_nummer = 502;

insert into public.vocab_items
  (user_id, hangul, romanisierung, deutsch, lektion_nummer, beispielsatz_ko, beispielsatz_de, hinweis, haeufigkeit)
select (select id from auth.users where email='jreitzenstein@gmail.com'), v.*
from (values
  ('تعطیلات', 'ta''tilât', 'Ferien', 502, 'تعطیلات تابستان را کجا می‌گذرانی؟', 'Wo verbringst du die Sommerferien?', NULL, 3),
  ('دانش‌آموز', 'dânesh-âmuz', 'Schüler / Schülerin', 502, 'این دانش‌آموز خیلی کوشاست.', 'Dieser Schüler ist sehr fleißig.', NULL, 3),
  ('سال تحصیلی', 'sâl-e tahsili', 'Schuljahr', 502, 'سال تحصیلی جدید پاییز شروع می‌شود.', 'Das neue Schuljahr beginnt im Herbst.', NULL, 3),
  ('امتحان', 'emtehân', 'Prüfung', 502, 'فردا امتحان ریاضی دارم.', 'Morgen habe ich eine Matheprüfung.', NULL, 3),
  ('استراحت', 'esterâhat', 'Erholung', 502, 'بعد از کار به استراحت نیاز دارم.', 'Nach der Arbeit brauche ich Erholung.', NULL, 3),
  ('تجربه', 'tajrobe', 'Erfahrung', 502, 'این سفر تجربه‌ی خوبی بود.', 'Diese Reise war eine gute Erfahrung.', NULL, 3),
  ('فرصت', 'forsat', 'Gelegenheit', 502, 'این فرصت خوبی برای یادگیری است.', 'Das ist eine gute Gelegenheit zum Lernen.', NULL, 3),
  ('سفر', 'safar', 'Reise', 502, 'تابستان به یک سفر طولانی می‌رویم.', 'Im Sommer machen wir eine lange Reise.', NULL, 3),
  ('فرهنگ', 'farhang', 'Kultur', 502, 'با فرهنگ کشورهای دیگر آشنا شدم.', 'Ich habe die Kultur anderer Länder kennengelernt.', NULL, 3),
  ('دریا', 'daryâ', 'Meer', 502, 'در تعطیلات کنار دریا رفتیم.', 'In den Ferien fuhren wir ans Meer.', NULL, 3),
  ('شنا', 'shenâ', 'Schwimmen', 502, 'هر روز صبح شنا می‌کنم.', 'Jeden Morgen schwimme ich.', NULL, 3),
  ('طبیعت', 'tabi''at', 'Natur', 502, 'عاشق گردش در طبیعت هستم.', 'Ich liebe Ausflüge in die Natur.', NULL, 3),
  ('کمپینگ', 'kemping', 'Camping', 502, 'آخر هفته به کمپینگ می‌رویم.', 'Am Wochenende gehen wir campen.', NULL, 3),
  ('چادر', 'châdor', 'Zelt', 502, 'چادر را کنار رودخانه برپا کردیم.', 'Wir stellten das Zelt am Fluss auf.', NULL, 3),
  ('مهارت', 'mahârat', 'Fähigkeit', 502, 'او در آشپزی مهارت دارد.', 'Er hat Geschick beim Kochen.', NULL, 3),
  ('زبان خارجی', 'zabân-e khâreji', 'Fremdsprache', 502, 'یادگیری یک زبان خارجی مفید است.', 'Eine Fremdsprache zu lernen ist nützlich.', NULL, 3),
  ('ساز', 'sâz', 'Musikinstrument', 502, 'می‌خواهم یک ساز یاد بگیرم.', 'Ich möchte ein Musikinstrument lernen.', NULL, 3),
  ('ورزش', 'varzesh', 'Sport', 502, 'هر هفته ورزش می‌کنم.', 'Jede Woche treibe ich Sport.', NULL, 3),
  ('کار پاره‌وقت', 'kâr-e pâre-vaght', 'Teilzeitjob', 502, 'تابستان یک کار پاره‌وقت پیدا کردم.', 'Im Sommer habe ich einen Teilzeitjob gefunden.', NULL, 3),
  ('تجربه کاری', 'tajrobe-ye kâri', 'Berufserfahrung', 502, 'این کار به من تجربه‌ی کاری داد.', 'Diese Arbeit gab mir Berufserfahrung.', NULL, 3),
  ('دوچرخه‌سواری', 'docharkhe-savâri', 'Radfahren', 502, 'دوچرخه‌سواری در پارک لذت‌بخش است.', 'Radfahren im Park macht Spaß.', NULL, 3),
  ('جشنواره', 'jashnvâre', 'Festival', 502, 'تابستان به یک جشنواره‌ی موسیقی رفتیم.', 'Im Sommer gingen wir zu einem Musikfestival.', NULL, 3),
  ('رشد شخصی', 'roshd-e shakhsi', 'Persönliche Entwicklung', 502, 'سفر به رشد شخصی کمک می‌کند.', 'Reisen hilft der persönlichen Entwicklung.', NULL, 3),
  ('خاطره', 'khâtere', 'Erinnerung', 502, 'از این تعطیلات خاطره‌ی خوبی دارم.', 'Von diesen Ferien habe ich eine schöne Erinnerung.', NULL, 3),
  ('برنامه‌ریزی', 'barnâme-rizi', 'Planung', 502, 'برنامه‌ریزی برای سفر مهم است.', 'Planung ist wichtig für eine Reise.', NULL, 3)
) as v(hangul, romanisierung, deutsch, lektion_nummer, beispielsatz_ko, beispielsatz_de, hinweis, haeufigkeit);
