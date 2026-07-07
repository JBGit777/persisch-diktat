-- ============================================================================
-- Teil 3 thematisch neu ordnen – IN PLACE (progress-schonend).
-- Verschiebt nur die Frequenz-Teil-3-Zeilen (lektion 301–311); Themen-Kapitel
-- (501–503) bleiben unberührt. review_state/Statistik bleiben erhalten.
-- App-Login-E-Mail: jreitzenstein@gmail.com. Im SQL Editor ausführen (danach ist Teil 3 neu geordnet).
-- ============================================================================

-- 1) Lektions-Titel aktualisieren
insert into public.lessons (user_id, buch, lektion_nummer, titel, beschreibung, reihenfolge)
select (select id from auth.users where email='jreitzenstein@gmail.com'), v.buch, v.lektion_nummer, v.titel, v.beschreibung, v.lektion_nummer
from (values
  (3, 301, 'Politik & Staat', 'Teil 3 – Themen'),
  (3, 302, 'Gesellschaft & Menschen', 'Teil 3 – Themen'),
  (3, 303, 'Arbeit, Wirtschaft & Geld', 'Teil 3 – Themen'),
  (3, 304, 'Bildung & Wissenschaft', 'Teil 3 – Themen'),
  (3, 305, 'Medien, Sprache & Kommunikation', 'Teil 3 – Themen'),
  (3, 306, 'Orte, Länder & Wege', 'Teil 3 – Themen'),
  (3, 307, 'Konflikt, Recht & Sicherheit', 'Teil 3 – Themen'),
  (3, 308, 'Ursache & Zusammenhang', 'Teil 3 – Themen'),
  (3, 309, 'Art, Form, Maß & Menge', 'Teil 3 – Themen'),
  (3, 310, 'Handlung, Vorgang & Veränderung', 'Teil 3 – Themen'),
  (3, 311, 'Alltag, Körper & Natur', 'Teil 3 – Themen')
) as v(buch, lektion_nummer, titel, beschreibung)
on conflict (user_id, lektion_nummer) do update set titel=excluded.titel, beschreibung=excluded.beschreibung;

-- 2) Wörter thematisch verschieben (nur alte Teil-3-Zeilen 301–311)
update public.vocab_items set lektion_nummer=301
  where user_id=(select id from auth.users where email='jreitzenstein@gmail.com') and lektion_nummer between 301 and 311 and hangul in ('دولت', 'مجلس', 'رئیس', 'وزیر', 'وزارت', 'سیاست', 'سیاسی', 'جمهوری', 'انقلاب', 'حزب', 'نماینده', 'حاکم', 'امام', 'شورا', 'مقام', 'انتخابات', 'رأی', 'قانون', 'حقوق', 'حق', 'آزادی', 'ملت', 'دستور', 'اختیار', 'قدرت', 'هیئت', 'نظام');
update public.vocab_items set lektion_nummer=302
  where user_id=(select id from auth.users where email='jreitzenstein@gmail.com') and lektion_nummer between 301 and 311 and hangul in ('مردم', 'جامعه', 'انسان', 'فرد', 'نفر', 'کس', 'عضو', 'زن', 'مرد', 'کودک', 'خانواده', 'دوست', 'جمعیت', 'دین', 'اسلام', 'اسلامی', 'فرهنگ', 'شهید', 'شاهد', 'استاد', 'دکتر', 'آقا', 'محمد', 'علی', 'حسن', 'صاحب', 'زندگی', 'گروه', 'تیم');
update public.vocab_items set lektion_nummer=303
  where user_id=(select id from auth.users where email='jreitzenstein@gmail.com') and lektion_nummer between 301 and 311 and hangul in ('کار', 'شرکت', 'سازمان', 'اداره', 'بانک', 'صنعت', 'تولید', 'پول', 'دلار', 'هزینه', 'پرداخت', 'نفت', 'بازار', 'خدمت', 'فعالیت', 'همکاری', 'تأمین', 'دستگاه', 'سیستم', 'کنترل');
update public.vocab_items set lektion_nummer=304
  where user_id=(select id from auth.users where email='jreitzenstein@gmail.com') and lektion_nummer between 301 and 311 and hangul in ('آموزش', 'دانشگاه', 'مدرسه', 'علم', 'تحقیق', 'کتاب', 'رشته', 'اندیشه', 'فکر', 'حوزه');
update public.vocab_items set lektion_nummer=305
  where user_id=(select id from auth.users where email='jreitzenstein@gmail.com') and lektion_nummer between 301 and 311 and hangul in ('روزنامه', 'خبر', 'گزارش', 'اعلام', 'گفته', 'مقاله', 'فیلم', 'چاپ', 'زبان', 'انگلیسی', 'سخن', 'بیان', 'گفت‌وگو', 'سؤال', 'پاسخ', 'نامه', 'معنا', 'منظور', 'نقل', 'شبکه', 'تصویر', 'نشان', 'خط', 'ارتباط', 'اطلاع', 'منبع', 'موضوع', 'عنوان', 'نظر', 'بحث', 'اشاره', 'دیدار', 'جلسه', 'نام', 'جمله');
update public.vocab_items set lektion_nummer=306
  where user_id=(select id from auth.users where email='jreitzenstein@gmail.com') and lektion_nummer between 301 and 311 and hangul in ('شهر', 'کشور', 'منطقه', 'استان', 'محل', 'مرکز', 'جا', 'میدان', 'خانه', 'راه', 'مسیر', 'سو', 'طرف', 'سمت', 'بالا', 'خارج', 'زمین', 'فضا', 'جهان', 'دنیا', 'ایران', 'تهران', 'آمریکا', 'اروپا', 'چین', 'فرانسه', 'افغانستان', 'دنبال', 'عرصه', 'دفتر', 'نزدیک', 'سفر');
update public.vocab_items set lektion_nummer=307
  where user_id=(select id from auth.users where email='jreitzenstein@gmail.com') and lektion_nummer between 301 and 311 and hangul in ('جنگ', 'دفاع', 'خطر', 'حادثه', 'فشار', 'مانع', 'امنیت', 'حمایت', 'مرگ', 'حفظ', 'نیرو');
update public.vocab_items set lektion_nummer=308
  where user_id=(select id from auth.users where email='jreitzenstein@gmail.com') and lektion_nummer between 301 and 311 and hangul in ('دلیل', 'علت', 'نتیجه', 'اثر', 'تأثیر', 'عامل', 'باعث', 'موجب', 'رابطه', 'نسبت', 'شرط', 'اساس', 'زمینه', 'نقش', 'هدف', 'امکان', 'فرصت', 'پی', 'توجه', 'نیاز', 'خاطر');
update public.vocab_items set lektion_nummer=309
  where user_id=(select id from auth.users where email='jreitzenstein@gmail.com') and lektion_nummer between 301 and 311 and hangul in ('صورت', 'طور', 'نوع', 'گونه', 'شکل', 'حد', 'حدود', 'میزان', 'سطح', 'درصد', 'تعداد', 'ارزش', 'اهمیت', 'اصل', 'حقیقت', 'واقعیت', 'امر', 'مورد', 'چیز', 'کل', 'جمع', 'واحد', 'بزرگی', 'شدت', 'وجود', 'طول', 'ماده', 'قرار', 'بخش', 'وضعیت', 'وضع');
update public.vocab_items set lektion_nummer=310
  where user_id=(select id from auth.users where email='jreitzenstein@gmail.com') and lektion_nummer between 301 and 311 and hangul in ('عمل', 'اجرا', 'انجام', 'اقدام', 'حرکت', 'تغییر', 'توسعه', 'رشد', 'افزایش', 'کاهش', 'روند', 'جریان', 'ادامه', 'تلاش', 'سعی', 'اصلاح', 'ایجاد', 'تشکیل', 'ساخت', 'استفاده', 'انتخاب', 'بررسی', 'ارائه', 'برنامه', 'طرح', 'پیشنهاد', 'تأکید', 'ترتیب', 'انتقال', 'حضور', 'خواست', 'انتظار', 'امید', 'روش', 'طریق', 'کمک', 'مسئله', 'مشکل', 'بازی', 'مسابقه', 'فوتبال', 'گل', 'غیر', 'نقطه');
update public.vocab_items set lektion_nummer=311
  where user_id=(select id from auth.users where email='jreitzenstein@gmail.com') and lektion_nummer between 301 and 311 and hangul in ('دست', 'سر', 'تن', 'دیده', 'آب', 'هوا');

-- 3) Neues Kapitel Krieg und Frieden (Teil 5, Lektion 503) -- additiv
insert into public.lessons (user_id, buch, lektion_nummer, titel, beschreibung, reihenfolge)
select (select id from auth.users where email='jreitzenstein@gmail.com'), 5, 503, 'Krieg & Frieden', 'Teil 5 – Themen', 503
on conflict (user_id, lektion_nummer) do update set titel=excluded.titel, beschreibung=excluded.beschreibung;

insert into public.vocab_items
  (user_id, hangul, romanisierung, deutsch, lektion_nummer, beispielsatz_ko, beispielsatz_de, hinweis, haeufigkeit)
select (select id from auth.users where email='jreitzenstein@gmail.com'), v.*
from (values
  ('جنگ', 'jang', 'Krieg', 503, 'جنگ سال‌ها طول کشید.', 'Der Krieg dauerte Jahre.', NULL, 3),
  ('سرباز', 'sarbâz', 'Soldat', 503, 'سرباز از شهر دفاع کرد.', 'Der Soldat verteidigte die Stadt.', NULL, 3),
  ('تانک', 'tânk', 'Panzer', 503, 'تانک در خیابان ایستاد.', 'Der Panzer stand auf der Straße.', NULL, 3),
  ('هواپیما', 'havâpeymâ', 'Flugzeug', 503, 'هواپیما بر فراز شهر پرواز کرد.', 'Das Flugzeug flog über die Stadt.', NULL, 3),
  ('انفجار', 'enfejâr', 'Explosion', 503, 'صدای انفجار همه را ترساند.', 'Der Knall der Explosion erschreckte alle.', NULL, 3),
  ('آتش', 'âtash', 'Feuer', 503, 'آتش خانه را سوزاند.', 'Das Feuer verbrannte das Haus.', NULL, 3),
  ('دود', 'dud', 'Rauch', 503, 'دود سیاه از خانه بلند شد.', 'Schwarzer Rauch stieg aus dem Haus.', NULL, 3),
  ('شهر', 'shahr', 'Stadt', 503, 'شهر پس از جنگ ویران بود.', 'Die Stadt war nach dem Krieg zerstört.', NULL, 3),
  ('خانه', 'khâne', 'Haus', 503, 'خانه‌ی ما در جنگ ویران شد.', 'Unser Haus wurde im Krieg zerstört.', NULL, 3),
  ('ویران', 'virân', 'zerstört', 503, 'این ساختمان کاملاً ویران شده است.', 'Dieses Gebäude ist völlig zerstört.', NULL, 3),
  ('مردم', 'mardom', 'Menschen / Volk', 503, 'مردم از شهر فرار کردند.', 'Die Menschen flohen aus der Stadt.', NULL, 3),
  ('پناهنده', 'panâhande', 'Flüchtling', 503, 'پناهنده‌ها به کشور دیگری رفتند.', 'Die Flüchtlinge gingen in ein anderes Land.', NULL, 3),
  ('صلح', 'solh', 'Frieden', 503, 'همه مردم صلح می‌خواهند.', 'Alle Menschen wollen Frieden.', NULL, 3)
) as v(hangul, romanisierung, deutsch, lektion_nummer, beispielsatz_ko, beispielsatz_de, hinweis, haeufigkeit)
on conflict (user_id, hangul, lektion_nummer) do update set
  romanisierung=excluded.romanisierung, deutsch=excluded.deutsch,
  beispielsatz_ko=excluded.beispielsatz_ko, beispielsatz_de=excluded.beispielsatz_de, haeufigkeit=excluded.haeufigkeit;
