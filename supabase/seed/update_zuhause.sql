-- Zuhause & Wohnen (Teil 5, Lektion 504) -- additiv, im SQL Editor ausfuehren.
-- App-Login-E-Mail: jreitzenstein@gmail.com
insert into public.lessons (user_id, buch, lektion_nummer, titel, beschreibung, reihenfolge)
select (select id from auth.users where email='jreitzenstein@gmail.com'), 5, 504, 'Zuhause & Wohnen', 'Teil 5 – Themen', 504
on conflict (user_id, lektion_nummer) do update set titel=excluded.titel, beschreibung=excluded.beschreibung;

insert into public.vocab_items
  (user_id, hangul, romanisierung, deutsch, lektion_nummer, beispielsatz_ko, beispielsatz_de, hinweis, haeufigkeit)
select (select id from auth.users where email='jreitzenstein@gmail.com'), v.*
from (values
  ('طبقه', 'tabaghe', 'Stockwerk / Etage', 504, 'آپارتمان ما در طبقهٔ سوم است.', 'Unsere Wohnung ist im dritten Stock.', NULL, 3),
  ('آپارتمان', 'âpârtemân', 'Wohnung / Apartment', 504, 'آپارتمان ما بزرگ نیست.', 'Unsere Wohnung ist nicht groß.', NULL, 3),
  ('ساختمان', 'sâkhtemân', 'Gebäude', 504, 'ما در یک ساختمان بلند زندگی می‌کنیم.', 'Wir wohnen in einem hohen Gebäude.', NULL, 3),
  ('آسانسور', 'âsânsor', 'Aufzug', 504, 'آسانسور خراب است.', 'Der Aufzug ist kaputt.', NULL, 3),
  ('اتاق', 'otâgh', 'Zimmer', 504, 'این اتاق خیلی روشن است.', 'Dieses Zimmer ist sehr hell.', NULL, 3),
  ('اتاق خواب', 'otâgh-e khâb', 'Schlafzimmer', 504, 'اتاق خواب من کوچک است.', 'Mein Schlafzimmer ist klein.', NULL, 3),
  ('خواب', 'khâb', 'Schlaf / Traum', 504, 'خواب خوبی داشتم.', 'Ich hatte einen guten Schlaf.', NULL, 3),
  ('آشپزخانه', 'âshpazkhâne', 'Küche', 504, 'ما در آشپزخانه صبحانه می‌خوریم.', 'Wir frühstücken in der Küche.', NULL, 3),
  ('دستشویی', 'dastshuyi', 'Toilette', 504, 'دستشویی آن طرف است.', 'Die Toilette ist auf der anderen Seite.', NULL, 3),
  ('حمام', 'hammâm', 'Bad / Badezimmer', 504, 'حمام ما تمیز است.', 'Unser Bad ist sauber.', NULL, 3),
  ('هال', 'hâl', 'Wohnzimmer', 504, 'ما در هال تلویزیون تماشا می‌کنیم.', 'Im Wohnzimmer schauen wir fern.', NULL, 3),
  ('حیاط', 'hayât', 'Hof', 504, 'بچه‌ها در حیاط بازی می‌کنند.', 'Die Kinder spielen im Hof.', NULL, 3),
  ('پارکینگ', 'pârking', 'Parkplatz / Garage', 504, 'ماشین در پارکینگ است.', 'Das Auto ist in der Garage.', NULL, 3),
  ('انباری', 'anbâri', 'Abstellraum', 504, 'وسایل قدیمی در انباری است.', 'Die alten Sachen sind im Abstellraum.', NULL, 3),
  ('دیوار', 'divâr', 'Wand / Mauer', 504, 'روی دیوار یک تابلو است.', 'An der Wand ist ein Bild.', NULL, 3),
  ('تابلو', 'tâblo', 'Bild / Tafel', 504, 'این تابلو زیباست.', 'Dieses Bild ist schön.', NULL, 3),
  ('نقاشی', 'naghghâshi', 'Malerei / Gemälde', 504, 'او نقاشی دوست دارد.', 'Er mag Malerei.', NULL, 3),
  ('قالی', 'ghâli', 'Teppich', 504, 'این قالی خیلی قشنگ است.', 'Dieser Teppich ist sehr schön.', NULL, 3),
  ('مبل', 'mobl', 'Sofa / Sessel', 504, 'روی مبل نشستیم.', 'Wir setzten uns aufs Sofa.', NULL, 3),
  ('پشتی', 'poshti', 'Sitzkissen', 504, 'چند پشتی روی زمین است.', 'Einige Sitzkissen liegen auf dem Boden.', NULL, 3),
  ('میز', 'miz', 'Tisch', 504, 'کتاب روی میز است.', 'Das Buch ist auf dem Tisch.', NULL, 3),
  ('کمد', 'komod', 'Schrank', 504, 'لباس‌ها در کمد است.', 'Die Kleider sind im Schrank.', NULL, 3),
  ('قفسه', 'ghafase', 'Regal', 504, 'کتاب‌ها در قفسه است.', 'Die Bücher sind im Regal.', NULL, 3),
  ('آینه', 'âyene', 'Spiegel', 504, 'او در آینه نگاه کرد.', 'Er schaute in den Spiegel.', NULL, 3),
  ('تخت‌خواب', 'takhtekhâb', 'Bett', 504, 'من روی تخت‌خواب خوابیدم.', 'Ich schlief im Bett.', NULL, 3),
  ('یخچال', 'yakhchâl', 'Kühlschrank', 504, 'غذا در یخچال است.', 'Das Essen ist im Kühlschrank.', NULL, 3),
  ('فریزر', 'ferizer', 'Gefrierschrank', 504, 'گوشت در فریزر است.', 'Das Fleisch ist im Gefrierschrank.', NULL, 3),
  ('اجاق', 'ojâgh', 'Herd', 504, 'غذا روی اجاق است.', 'Das Essen ist auf dem Herd.', NULL, 3),
  ('گاز', 'gâz', 'Gas', 504, 'اجاق گاز روشن است.', 'Der Gasherd ist an.', NULL, 3),
  ('آبگرمکن', 'âbgarmkon', 'Boiler / Warmwasserbereiter', 504, 'آبگرمکن خراب شد.', 'Der Boiler ging kaputt.', NULL, 3),
  ('تلویزیون', 'televizion', 'Fernseher', 504, 'تلویزیون روشن است.', 'Der Fernseher ist an.', NULL, 3),
  ('رادیو', 'râdio', 'Radio', 504, 'به رادیو گوش می‌کنیم.', 'Wir hören Radio.', NULL, 3),
  ('کامپیوتر', 'kâmpiuter', 'Computer', 504, 'کامپیوتر روی میز است.', 'Der Computer ist auf dem Tisch.', NULL, 3),
  ('ماشین', 'mâshin', 'Maschine / Auto', 504, 'ماشین لباسشویی کار می‌کند.', 'Die Waschmaschine läuft.', NULL, 3),
  ('ماشین لباسشویی', 'mâshin-e lebâsshuyi', 'Waschmaschine', 504, 'ماشین لباسشویی در حمام است.', 'Die Waschmaschine ist im Bad.', NULL, 3),
  ('وسایل', 'vasâyel', 'Sachen / Gegenstände', 504, 'وسایل زیادی در اتاق است.', 'Es sind viele Sachen im Zimmer.', NULL, 3),
  ('صبحانه', 'sobhâne', 'Frühstück', 504, 'صبحانه آماده است.', 'Das Frühstück ist fertig.', NULL, 3),
  ('ناهار', 'nâhâr', 'Mittagessen', 504, 'ناهار می‌خوریم.', 'Wir essen zu Mittag.', NULL, 3),
  ('شام', 'shâm', 'Abendessen', 504, 'شام حاضر است.', 'Das Abendessen ist fertig.', NULL, 3),
  ('راحت', 'râhat', 'bequem / gemütlich', 504, 'خانهٔ ما راحت است.', 'Unsere Wohnung ist gemütlich.', NULL, 3),
  ('بیشتر', 'bishtar', 'mehr / meistens', 504, 'من بیشتر در هال هستم.', 'Ich bin meistens im Wohnzimmer.', NULL, 3),
  ('گاهی', 'gâhi', 'manchmal', 504, 'گاهی تلویزیون تماشا می‌کنم.', 'Manchmal schaue ich fern.', NULL, 3),
  ('پهن', 'pahn', 'breit / ausgebreitet', 504, 'قالی روی زمین پهن است.', 'Der Teppich ist auf dem Boden ausgebreitet.', NULL, 3),
  ('نشستن', 'neshastan', 'sitzen', 504, 'ما در هال می‌نشینیم.', 'Wir sitzen im Wohnzimmer.', NULL, 3),
  ('خوردن', 'khordan', 'essen', 504, 'ناهار می‌خوریم.', 'Wir essen zu Mittag.', NULL, 3),
  ('مطالعه کردن', 'motâle''e kardan', 'lesen / studieren', 504, 'او مطالعه می‌کند.', 'Er liest.', NULL, 3),
  ('تماشا کردن', 'tamâshâ kardan', 'anschauen / zusehen', 504, 'ما فیلم تماشا می‌کنیم.', 'Wir schauen einen Film an.', NULL, 3),
  ('گوش کردن', 'gush kardan', 'zuhören', 504, 'به موسیقی گوش می‌کنم.', 'Ich höre Musik.', NULL, 3)
) as v(hangul, romanisierung, deutsch, lektion_nummer, beispielsatz_ko, beispielsatz_de, hinweis, haeufigkeit)
on conflict (user_id, hangul, lektion_nummer) do update set
  romanisierung=excluded.romanisierung, deutsch=excluded.deutsch,
  beispielsatz_ko=excluded.beispielsatz_ko, beispielsatz_de=excluded.beispielsatz_de, haeufigkeit=excluded.haeufigkeit;
