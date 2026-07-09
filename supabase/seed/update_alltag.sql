-- Alltagswortschatz aus den Lesetexten (Teil 5, Lektionen 505/506) -- additiv.
-- App-Login-E-Mail: jreitzenstein@gmail.com. Im SQL Editor ausfuehren.

insert into public.lessons (user_id, buch, lektion_nummer, titel, beschreibung, reihenfolge)
select (select id from auth.users where email='jreitzenstein@gmail.com'), 5, 505, 'Familie, Schule & Bildung', 'Teil 5 – Themen', 505
on conflict (user_id, lektion_nummer) do update set titel=excluded.titel, beschreibung=excluded.beschreibung;
insert into public.lessons (user_id, buch, lektion_nummer, titel, beschreibung, reihenfolge)
select (select id from auth.users where email='jreitzenstein@gmail.com'), 5, 506, 'Stadt, Reise & Einkaufen', 'Teil 5 – Themen', 506
on conflict (user_id, lektion_nummer) do update set titel=excluded.titel, beschreibung=excluded.beschreibung;

insert into public.vocab_items
  (user_id, hangul, romanisierung, deutsch, lektion_nummer, beispielsatz_ko, beispielsatz_de, hinweis, haeufigkeit)
select (select id from auth.users where email='jreitzenstein@gmail.com'), v.*
from (values
  ('مادر', 'mâdar', 'Mutter', 505, 'من مادرم را دوست دارم.', 'Ich liebe meine Mutter.', NULL, 3),
  ('پدر', 'pedar', 'Vater', 505, 'پدرم در نانوایی کار می‌کند.', 'Mein Vater arbeitet in der Bäckerei.', NULL, 3),
  ('خواهر', 'khâhar', 'Schwester', 505, 'من دو خواهر دارم.', 'Ich habe zwei Schwestern.', NULL, 3),
  ('برادر', 'barâdar', 'Bruder', 505, 'برادرم جوان است.', 'Mein Bruder ist jung.', NULL, 3),
  ('همسر', 'hamsar', 'Ehepartner(in)', 505, 'او برای همسرش هدیه خرید.', 'Er kaufte ein Geschenk für seine Frau.', NULL, 3),
  ('دختر', 'dokhtar', 'Tochter / Mädchen', 505, 'آن دختر دانش‌آموز است.', 'Dieses Mädchen ist Schülerin.', NULL, 3),
  ('پسر', 'pesar', 'Sohn / Junge', 505, 'پسرها فوتبال بازی می‌کنند.', 'Die Jungen spielen Fußball.', NULL, 3),
  ('مادربزرگ', 'mâdarbozorg', 'Großmutter', 505, 'مادربزرگم مهربان است.', 'Meine Großmutter ist lieb.', NULL, 3),
  ('دانش‌آموز', 'dânesh-âmuz', 'Schüler(in)', 505, 'او دانش‌آموز سال سوم است.', 'Er ist Schüler der dritten Klasse.', NULL, 3),
  ('مسافر', 'mosâfer', 'Reisende(r) / Passagier', 505, 'مسافران از هواپیما پیاده شدند.', 'Die Passagiere stiegen aus dem Flugzeug.', NULL, 3),
  ('درس', 'dars', 'Unterricht / Lektion', 505, 'این درس آسان است.', 'Diese Lektion ist einfach.', NULL, 3),
  ('کلاس', 'kelâs', 'Klasse / Unterricht', 505, 'کلاس ساعت هشت شروع می‌شود.', 'Der Unterricht beginnt um acht.', NULL, 3),
  ('دبیرستان', 'dabirestân', 'Oberschule', 505, 'او به دبیرستان می‌رود.', 'Er geht auf die Oberschule.', NULL, 3),
  ('تحصیل', 'tahsil', 'Studium / Bildung', 505, 'او تحصیل را ادامه می‌دهد.', 'Er setzt das Studium fort.', NULL, 3),
  ('دیپلم', 'diplom', 'Diplom / Abschluss', 505, 'امسال دیپلم می‌گیرم.', 'Dieses Jahr mache ich meinen Abschluss.', NULL, 3),
  ('لیسانس', 'lisâns', 'Bachelor', 505, 'او لیسانس فیزیک دارد.', 'Er hat einen Bachelor in Physik.', NULL, 3),
  ('دبیر', 'dabir', 'Lehrer(in)', 505, 'دبیر ما خیلی خوب است.', 'Unser Lehrer ist sehr gut.', NULL, 3),
  ('تکلیف', 'taklif', 'Hausaufgabe', 505, 'تکلیف‌هایم را انجام دادم.', 'Ich habe meine Hausaufgaben gemacht.', NULL, 3),
  ('مکانیک', 'mekânik', 'Mechaniker', 505, 'او می‌خواهد مکانیک شود.', 'Er möchte Mechaniker werden.', NULL, 3),
  ('استراحت', 'esterâhat', 'Ruhe / Pause', 505, 'بعد از ناهار استراحت می‌کنم.', 'Nach dem Mittagessen ruhe ich mich aus.', NULL, 3),
  ('زنگ', 'zang', 'Klingel / Schulstunde', 505, 'زنگ تفریح خورد.', 'Es klingelte zur Pause.', NULL, 3),
  ('تفریح', 'tafrih', 'Pause / Freizeit', 505, 'در تفریح بازی می‌کنیم.', 'In der Pause spielen wir.', NULL, 3),
  ('تاریخ', 'târikh', 'Geschichte / Datum', 505, 'درس تاریخ را دوست دارم.', 'Ich mag das Fach Geschichte.', NULL, 3),
  ('جغرافیا', 'joghrâfiyâ', 'Geografie', 505, 'جغرافیا سخت نیست.', 'Geografie ist nicht schwer.', NULL, 3),
  ('ریاضی', 'riyâzi', 'Mathematik', 505, 'ریاضی درس مهمی است.', 'Mathematik ist ein wichtiges Fach.', NULL, 3),
  ('فیزیک', 'fizik', 'Physik', 505, 'او فیزیک می‌خواند.', 'Er studiert Physik.', NULL, 3),
  ('علوم', 'olum', 'Naturwissenschaften', 505, 'علوم جالب است.', 'Naturwissenschaften sind interessant.', NULL, 3),
  ('فرودگاه', 'forudgâh', 'Flughafen', 506, 'هواپیما در فرودگاه نشست.', 'Das Flugzeug landete am Flughafen.', NULL, 3),
  ('هتل', 'hotel', 'Hotel', 506, 'او در هتل اقامت کرد.', 'Er übernachtete im Hotel.', NULL, 3),
  ('خیابان', 'khiyâbân', 'Straße', 506, 'خیابان‌ها شلوغ است.', 'Die Straßen sind voll.', NULL, 3),
  ('مغازه', 'maghâze', 'Laden', 506, 'مغازه باز است.', 'Der Laden ist geöffnet.', NULL, 3),
  ('فروشگاه', 'forushgâh', 'Geschäft / Kaufhaus', 506, 'به فروشگاه رفتیم.', 'Wir gingen ins Geschäft.', NULL, 3),
  ('نانوایی', 'nânvâyi', 'Bäckerei', 506, 'نان را از نانوایی خریدم.', 'Ich kaufte das Brot in der Bäckerei.', NULL, 3),
  ('کارگاه', 'kârgâh', 'Werkstatt', 506, 'او در کارگاه کار می‌کند.', 'Er arbeitet in der Werkstatt.', NULL, 3),
  ('تاکسی', 'tâksi', 'Taxi', 506, 'با تاکسی به مدرسه رفتم.', 'Ich fuhr mit dem Taxi zur Schule.', NULL, 3),
  ('مدرک', 'madrak', 'Dokument / Zeugnis', 506, 'مدارک خود را نشان داد.', 'Er zeigte seine Dokumente.', NULL, 3),
  ('هدیه', 'hedye', 'Geschenk', 506, 'برای مادرم هدیه خریدم.', 'Ich kaufte ein Geschenk für meine Mutter.', NULL, 3),
  ('عطر', 'atr', 'Parfüm', 506, 'او عطر دوست دارد.', 'Sie mag Parfüm.', NULL, 3),
  ('پیراهن', 'pirâhan', 'Hemd / Kleid', 506, 'این پیراهن نو است.', 'Dieses Hemd ist neu.', NULL, 3),
  ('دامن', 'dâman', 'Rock', 506, 'او یک دامن خرید.', 'Sie kaufte einen Rock.', NULL, 3),
  ('روسری', 'rusari', 'Kopftuch', 506, 'روسری قشنگی خرید.', 'Sie kaufte ein schönes Kopftuch.', NULL, 3),
  ('لباس', 'lebâs', 'Kleidung', 506, 'لباس آنها شبیه هم است.', 'Ihre Kleidung ist ähnlich.', NULL, 3),
  ('تبریک', 'tabrik', 'Glückwunsch', 506, 'روز مادر را تبریک گفت.', 'Er gratulierte zum Muttertag.', NULL, 3),
  ('شعر', 'she''r', 'Gedicht', 506, 'او شعر فارسی می‌خواند.', 'Er liest persische Gedichte.', NULL, 3),
  ('رنگ', 'rang', 'Farbe', 506, 'رنگ چشم‌هایش قهوه‌ای است.', 'Seine Augenfarbe ist braun.', NULL, 3),
  ('مو', 'mu', 'Haar', 506, 'موهای او صاف است.', 'Ihr Haar ist glatt.', NULL, 3),
  ('قیافه', 'ghiyâfe', 'Aussehen / Gesicht', 506, 'قیافهٔ آنها شبیه است.', 'Ihr Aussehen ist ähnlich.', NULL, 3),
  ('شبیه', 'shabih', 'ähnlich', 506, 'آنها شبیه هم هستند.', 'Sie sind einander ähnlich.', NULL, 3),
  ('صاف', 'sâf', 'glatt / gerade', 506, 'موهایش صاف است.', 'Sein Haar ist glatt.', NULL, 3),
  ('دوقلو', 'doghlu', 'Zwilling', 506, 'آنها دوقلو هستند.', 'Sie sind Zwillinge.', NULL, 3),
  ('صبح', 'sobh', 'Morgen', 506, 'صبح به مدرسه می‌روم.', 'Am Morgen gehe ich zur Schule.', NULL, 3),
  ('شب', 'shab', 'Nacht / Abend', 506, 'شب به خانه برمی‌گردیم.', 'Abends kehren wir nach Hause zurück.', NULL, 3),
  ('مسواک', 'mesvâk', 'Zahnbürste / Zähneputzen', 506, 'قبل از خواب مسواک می‌زنم.', 'Vor dem Schlafen putze ich die Zähne.', NULL, 3),
  ('خریدن', 'kharidan', 'kaufen', 506, 'من یک کتاب خریدم.', 'Ich kaufte ein Buch.', NULL, 3),
  ('صحبت کردن', 'sohbat kardan', 'sprechen', 506, 'او فارسی صحبت می‌کند.', 'Er spricht Persisch.', NULL, 3),
  ('خوابیدن', 'khâbidan', 'schlafen', 506, 'من زود خوابیدم.', 'Ich ging früh schlafen.', NULL, 3),
  ('برگشتن', 'bargashtan', 'zurückkehren', 506, 'او به خانه برگشت.', 'Er kehrte nach Hause zurück.', NULL, 3),
  ('تعجب کردن', 'ta''ajob kardan', 'sich wundern', 506, 'از دیدن آن تعجب کردم.', 'Ich wunderte mich, das zu sehen.', NULL, 3)
) as v(hangul, romanisierung, deutsch, lektion_nummer, beispielsatz_ko, beispielsatz_de, hinweis, haeufigkeit)
on conflict (user_id, hangul, lektion_nummer) do update set
  romanisierung=excluded.romanisierung, deutsch=excluded.deutsch,
  beispielsatz_ko=excluded.beispielsatz_ko, beispielsatz_de=excluded.beispielsatz_de, haeufigkeit=excluded.haeufigkeit;
