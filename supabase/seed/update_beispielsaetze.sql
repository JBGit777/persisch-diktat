-- ============================================================================
-- Beispielsätze für die wichtigen Wörter (Häufigkeit 4–5 + alle Verben).
-- ADDITIV/idempotent: setzt beispielsatz nur, wo noch keiner ist. Kein Re-Run
-- des Haupt-Seeds nötig → Übungsfortschritt bleibt erhalten. Im SQL Editor ausführen.
-- >>> App-Login-E-Mail: jreitzenstein@gmail.com
-- ============================================================================

update public.vocab_items set beispielsatz_ko='اگر باران بیاید، نمی‌رویم.', beispielsatz_de='Wenn es regnet, gehen wir nicht.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'اگر' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='دیر شد، یعنی باید عجله کنیم.', beispielsatz_de='Es ist spät, das heißt, wir müssen uns beeilen.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'یعنی' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='مغازه بین بانک و داروخانه است.', beispielsatz_de='Der Laden ist zwischen Bank und Apotheke.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'بین' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='بدون تو نمی‌روم.', beispielsatz_de='Ohne dich gehe ich nicht.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'بدون' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='کتاب رو میز است.', beispielsatz_de='Das Buch ist auf dem Tisch.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'رو' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='همین را می‌خواستم.', beispielsatz_de='Genau das wollte ich.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'همین' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='من فردا می‌آیم.', beispielsatz_de='Ich komme morgen.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'من' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='وی سال‌ها در اینجا کار کرده است.', beispielsatz_de='Er hat jahrelang hier gearbeitet.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'وی' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='چنین چیزی ندیده بودم.', beispielsatz_de='So etwas hatte ich nicht gesehen.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'چنین' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='همان فیلم را دوباره دیدیم.', beispielsatz_de='Wir sahen denselben Film nochmal.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'همان' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='سایر مهمانان هم آمدند.', beispielsatz_de='Die übrigen Gäste kamen auch.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'سایر' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='ایشان استاد دانشگاه هستند.', beispielsatz_de='Er/Sie ist Universitätsprofessor(in).'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'ایشان' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='تمام روز کار کردم.', beispielsatz_de='Ich habe den ganzen Tag gearbeitet.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'تمام' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='چند روز اینجا می‌مانی؟', beispielsatz_de='Wie viele Tage bleibst du hier?'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'چند' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='چه کتابی می‌خوانی؟', beispielsatz_de='Welches Buch liest du?'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'چه' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='هیچ کس خانه نبود.', beispielsatz_de='Niemand war zu Hause.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'هیچ' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='نه، من نمی‌آیم.', beispielsatz_de='Nein, ich komme nicht.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'نه' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='می‌خواهم جواب را بدانم.', beispielsatz_de='Ich möchte die Antwort wissen.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'دانستن' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='او دیر آمد.', beispielsatz_de='Er ist spät gekommen.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'آمدن' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='راه‌حل را یافتیم.', beispielsatz_de='Wir haben die Lösung gefunden.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'یافتن' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='برایم یک لیوان آب بیاور.', beispielsatz_de='Bring mir ein Glas Wasser.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'آوردن' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='او وارد اتاق شد.', beispielsatz_de='Er trat ins Zimmer ein.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'وارد' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='فردا به مدرسه می‌روم.', beispielsatz_de='Morgen gehe ich zur Schule.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'رفتن' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='این نامه را به پست ببر.', beispielsatz_de='Bring diesen Brief zur Post.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'بردن' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='او ما را به خانه رساند.', beispielsatz_de='Er hat uns nach Hause gebracht.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'رساندن' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='کلید را روی میز گذاشتم.', beispielsatz_de='Ich habe den Schlüssel auf den Tisch gelegt.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'گذاشتن' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='دیروز او را دیدم.', beispielsatz_de='Gestern habe ich ihn gesehen.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'دیدن' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='صورت‌حساب را پرداختم.', beispielsatz_de='Ich habe die Rechnung bezahlt.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'پرداختن' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='سال‌ها زود می‌گذرند.', beispielsatz_de='Die Jahre vergehen schnell.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'گذشتن' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='کمی نمک به غذا افزود.', beispielsatz_de='Er fügte dem Essen etwas Salz hinzu.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'افزودن' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='او شغل تازه‌ای یافته است.', beispielsatz_de='Er hat eine neue Stelle gefunden.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'یافته' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='هر شب کتاب می‌خوانم.', beispielsatz_de='Jeden Abend lese ich ein Buch.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'خواندن' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='او سعی نمود به ما کمک کند.', beispielsatz_de='Er versuchte, uns zu helfen.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'نمودن' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='در زد و داخل شد.', beispielsatz_de='Er klopfte und kam herein.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'زدن' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='نامه‌ای به دوستم نوشتم.', beispielsatz_de='Ich habe meinem Freund einen Brief geschrieben.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'نوشتن' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='آن‌ها خانه‌ای نو ساختند.', beispielsatz_de='Sie haben ein neues Haus gebaut.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'ساختن' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='شایستن یعنی سزاوار بودن.', beispielsatz_de='„Schâyestan“ bedeutet „würdig sein“.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'شایستن' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='راه را به من نشان داد.', beispielsatz_de='Er zeigte mir den Weg.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'نشان دادن' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='با هم دست دادند.', beispielsatz_de='Sie gaben sich die Hand.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'دست دادن' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='گلدان را کنار پنجره قرار داد.', beispielsatz_de='Sie stellte die Vase ans Fenster.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'قرار دادن' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='خانه در مرکز شهر قرار دارد.', beispielsatz_de='Das Haus befindet sich im Stadtzentrum.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'قرار داشتن' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='از اتاق خارج شد.', beispielsatz_de='Er ging aus dem Zimmer hinaus.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'خارج شدن' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='قرار بود ساعت پنج بیاید.', beispielsatz_de='Er sollte um fünf kommen.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'قرار بودن' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='کار به‌موقع انجام شد.', beispielsatz_de='Die Arbeit wurde rechtzeitig erledigt.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'انجام شدن' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='عنوان این کتاب چیست؟', beispielsatz_de='Wie lautet der Titel dieses Buches?'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'عنوان' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='در این مورد بعداً حرف می‌زنیم.', beispielsatz_de='Über diesen Punkt sprechen wir später.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'مورد' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='دستم درد می‌کند.', beispielsatz_de='Meine Hand tut weh.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'دست' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='فردا با دکتر قرار دارم.', beispielsatz_de='Morgen habe ich einen Termin beim Arzt.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'قرار' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='برنامه‌ی امروز چیست؟', beispielsatz_de='Was ist das Programm für heute?'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'برنامه' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='این بخش از کتاب سخت است.', beispielsatz_de='Dieser Teil des Buches ist schwer.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'بخش' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='مشکلی وجود ندارد.', beispielsatz_de='Es gibt kein Problem.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'وجود' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='این مسئله را حل کردیم.', beispielsatz_de='Wir haben dieses Problem gelöst.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'مسئله' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='لطفاً به من توجه کن.', beispielsatz_de='Bitte schenk mir Aufmerksamkeit.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'توجه' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='این امر مهمی است.', beispielsatz_de='Das ist eine wichtige Angelegenheit.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'امر' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='این طور بهتر است.', beispielsatz_de='So ist es besser.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'طور' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='مشکلی پیش آمد.', beispielsatz_de='Ein Problem ist aufgetreten.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'مشکل' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='نتیجه‌ی امتحان خوب بود.', beispielsatz_de='Das Ergebnis der Prüfung war gut.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'نتیجه' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='رابطه‌ی خوبی با هم داریم.', beispielsatz_de='Wir haben eine gute Beziehung zueinander.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'رابطه' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='به یک شرط می‌آیم.', beispielsatz_de='Ich komme unter einer Bedingung.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'شرط' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='این کار اساس درستی دارد.', beispielsatz_de='Diese Sache hat eine solide Grundlage.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'اساس' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='در این زمینه تجربه دارم.', beispielsatz_de='Auf diesem Gebiet habe ich Erfahrung.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'زمینه' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='دلیل تأخیرت چیست؟', beispielsatz_de='Was ist der Grund für deine Verspätung?'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'دلیل' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='او نقش مهمی دارد.', beispielsatz_de='Er spielt eine wichtige Rolle.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'نقش' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='نام تو چیست؟', beispielsatz_de='Wie ist dein Name?'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'نام' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='استفاده از تلفن اینجا ممنوع است.', beispielsatz_de='Der Gebrauch des Telefons ist hier verboten.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'استفاده' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='قطار در حال حرکت است.', beispielsatz_de='Der Zug ist in Bewegung.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'حرکت' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='طرح تازه‌ای داریم.', beispielsatz_de='Wir haben einen neuen Plan.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'طرح' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='حدود صد نفر آمدند.', beispielsatz_de='Etwa hundert Leute kamen.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'حدود' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='این کار شغل ایجاد می‌کند.', beispielsatz_de='Diese Maßnahme schafft Arbeitsplätze.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'ایجاد' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='حضور شما باعث افتخار است.', beispielsatz_de='Ihre Anwesenheit ist eine Ehre.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'حضور' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='دیگر نیرو ندارم.', beispielsatz_de='Ich habe keine Kraft mehr.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'نیرو' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='فعالیت ورزشی خوب است.', beispielsatz_de='Sportliche Aktivität ist gut.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'فعالیت' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='تنش از سرما می‌لرزید.', beispielsatz_de='Sein Körper zitterte vor Kälte.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'تن' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='با دست به در اشاره کرد.', beispielsatz_de='Er deutete mit der Hand auf die Tür.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'اشاره' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='ده درصد تخفیف گرفتم.', beispielsatz_de='Ich habe zehn Prozent Rabatt bekommen.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'درصد' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='باید قانون را رعایت کنیم.', beispielsatz_de='Wir müssen das Gesetz beachten.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'قانون' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='هدف من یادگیری فارسی است.', beispielsatz_de='Mein Ziel ist es, Persisch zu lernen.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'هدف' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='بزرگی این شهر مرا شگفت‌زده کرد.', beispielsatz_de='Die Größe dieser Stadt erstaunte mich.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'بزرگی' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='تو حق داری.', beispielsatz_de='Du hast recht.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'حق' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='این دارو اثر خوبی دارد.', beispielsatz_de='Dieses Medikament hat eine gute Wirkung.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'اثر' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='بحث جالبی بود.', beispielsatz_de='Es war eine interessante Diskussion.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'بحث' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='این انگشتر ارزش زیادی دارد.', beispielsatz_de='Dieser Ring hat einen hohen Wert.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'ارزش' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='موضوع جلسه چیست؟', beispielsatz_de='Was ist das Thema der Sitzung?'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'موضوع' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='از این طرف بیا.', beispielsatz_de='Komm von dieser Seite.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'طرف' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='یک لیوان آب می‌خواهم.', beispielsatz_de='Ich möchte ein Glas Wasser.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'آب' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='چه نوع موسیقی دوست داری؟', beispielsatz_de='Welche Art Musik magst du?'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'نوع' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='اجرای کنسرت عالی بود.', beispielsatz_de='Die Aufführung des Konzerts war großartig.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'اجرا' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='به عمل خود فکر کن.', beispielsatz_de='Denk über deine Tat nach.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'عمل' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='زندگی در شهر گران است.', beispielsatz_de='Das Leben in der Stadt ist teuer.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'زندگی' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='نظام آموزشی تغییر کرد.', beispielsatz_de='Das Bildungssystem hat sich geändert.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'نظام' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='این میز شکل گردی دارد.', beispielsatz_de='Dieser Tisch hat eine runde Form.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'شکل' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='نسبت به دیروز بهتر است.', beispielsatz_de='Im Vergleich zu gestern ist es besser.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'نسبت' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='دنیا خیلی بزرگ است.', beispielsatz_de='Die Welt ist sehr groß.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'دنیا' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='این کتاب را خواندم.', beispielsatz_de='Dieses Buch habe ich gelesen.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'کتاب' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='توسعه‌ی شهر ادامه دارد.', beispielsatz_de='Die Entwicklung der Stadt geht weiter.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'توسعه' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='انجام این کار وقت می‌برد.', beispielsatz_de='Die Durchführung dieser Arbeit braucht Zeit.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'انجام' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='نتایج فردا اعلام می‌شود.', beispielsatz_de='Die Ergebnisse werden morgen bekannt gegeben.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'اعلام' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='اطلاع تازه‌ای ندارم.', beispielsatz_de='Ich habe keine neue Information.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'اطلاع' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='گفته‌ی او درست بود.', beispielsatz_de='Seine Aussage war richtig.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'گفته' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='گزارش را به رئیس دادم.', beispielsatz_de='Ich habe den Bericht dem Chef gegeben.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'گزارش' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='سرم درد می‌کند.', beispielsatz_de='Mein Kopf tut weh.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'سر' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='تغییر بزرگی لازم است.', beispielsatz_de='Eine große Veränderung ist nötig.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'تغییر' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='تعداد دانش‌آموزان زیاد است.', beispielsatz_de='Die Anzahl der Schüler ist hoch.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'تعداد' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='مدارک را بررسی کردیم.', beispielsatz_de='Wir haben die Unterlagen geprüft.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'بررسی' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='اقدام لازم انجام شد.', beispielsatz_de='Die nötige Maßnahme wurde ergriffen.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'اقدام' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='قیمت‌ها افزایش یافت.', beispielsatz_de='Die Preise sind gestiegen.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'افزایش' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='این گونه گل کمیاب است.', beispielsatz_de='Diese Blumenart ist selten.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'گونه' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='او سال‌ها خدمت کرد.', beispielsatz_de='Er hat jahrelang Dienst geleistet.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'خدمت' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='خبر خوبی دارم.', beispielsatz_de='Ich habe eine gute Nachricht.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'خبر' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='این آب از یک منبع طبیعی است.', beispielsatz_de='Dieses Wasser stammt aus einer natürlichen Quelle.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'منبع' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='یک خط راست بکش.', beispielsatz_de='Zieh eine gerade Linie.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'خط' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='این کشور قدرت زیادی دارد.', beispielsatz_de='Dieses Land hat große Macht.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'قدرت' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='به کمک تو نیاز دارم.', beispielsatz_de='Ich brauche deine Hilfe.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'نیاز' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='میزان بارش کم بود.', beispielsatz_de='Die Niederschlagsmenge war gering.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'میزان' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='این تصمیم در اختیار توست.', beispielsatz_de='Diese Entscheidung liegt bei dir.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'اختیار' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='ارائه‌ی او عالی بود.', beispielsatz_de='Seine Präsentation war ausgezeichnet.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'ارائه' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='گرما باعث خستگی می‌شود.', beispielsatz_de='Hitze verursacht Müdigkeit.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'باعث' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='رشد اقتصادی کند است.', beispielsatz_de='Das Wirtschaftswachstum ist langsam.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'رشد' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='دنبال کلیدم می‌گردم.', beispielsatz_de='Ich suche nach meinem Schlüssel.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'دنبال' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='انتخاب با توست.', beispielsatz_de='Die Wahl liegt bei dir.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'انتخاب' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='گفت‌وگوی خوبی داشتیم.', beispielsatz_de='Wir hatten ein gutes Gespräch.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'گفت‌وگو' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='به خاطر تو ماندم.', beispielsatz_de='Deinetwegen bin ich geblieben.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'خاطر' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='به سمت چپ برو.', beispielsatz_de='Geh nach links.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'سمت' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='خواب کم عامل خستگی است.', beispielsatz_de='Wenig Schlaf ist ein Faktor für Müdigkeit.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'عامل' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='موسیقی تأثیر زیادی دارد.', beispielsatz_de='Musik hat großen Einfluss.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'تأثیر' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='ساخت این پل دو سال طول کشید.', beispielsatz_de='Der Bau dieser Brücke dauerte zwei Jahre.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'ساخت' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='از طریق ایمیل خبر بده.', beispielsatz_de='Gib per E-Mail Bescheid.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'طریق' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='کاهش قیمت‌ها خوب است.', beispielsatz_de='Die Senkung der Preise ist gut.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'کاهش' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='جلسه تشکیل شد.', beispielsatz_de='Die Sitzung kam zustande.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'تشکیل' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='غیر از این راهی نیست.', beispielsatz_de='Außer diesem gibt es keinen Weg.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'غیر' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='این نقطه را روی نقشه پیدا کن.', beispielsatz_de='Finde diesen Punkt auf der Karte.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'نقطه' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='بازی فوتبال شروع شد.', beispielsatz_de='Das Fußballspiel hat begonnen.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'بازی' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='تولید این کارخانه زیاد است.', beispielsatz_de='Die Produktion dieser Fabrik ist hoch.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'تولید' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='او را قبلاً ندیده بودم.', beispielsatz_de='Ich hatte ihn vorher nicht gesehen.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'دیده' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='اصل کار صداقت است.', beispielsatz_de='Das Grundprinzip ist Ehrlichkeit.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'اصل' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='به کمکت احتیاج دارم.', beispielsatz_de='Ich brauche deine Hilfe.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'کمک' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='این موضوع اهمیت دارد.', beispielsatz_de='Dieses Thema ist wichtig.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'اهمیت' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='اندیشه‌ی خوبی است.', beispielsatz_de='Das ist eine gute Idee.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'اندیشه' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='ما یک گروه کوچک هستیم.', beispielsatz_de='Wir sind eine kleine Gruppe.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'گروه' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='این یک هنر اسلامی است.', beispielsatz_de='Das ist eine islamische Kunst.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'اسلامی' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='رئیس امروز نیامد.', beispielsatz_de='Der Chef ist heute nicht gekommen.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'رئیس' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='دولت قانون تازه‌ای تصویب کرد.', beispielsatz_de='Die Regierung verabschiedete ein neues Gesetz.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'دولت' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='این جمله را ترجمه کن.', beispielsatz_de='Übersetze diesen Satz.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'جمله' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='ده نفر در صف بودند.', beispielsatz_de='Zehn Personen standen in der Schlange.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'نفر' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='این یک مسئله‌ی سیاسی است.', beispielsatz_de='Das ist eine politische Frage.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'سیاسی' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='او دور جهان سفر کرد.', beispielsatz_de='Er reiste um die Welt.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'جهان' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='علی دوست خوبی است.', beispielsatz_de='Ali ist ein guter Freund.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'علی' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='او در یک سازمان بزرگ کار می‌کند.', beispielsatz_de='Er arbeitet in einer großen Organisation.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'سازمان' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='هر فرد حقوقی دارد.', beispielsatz_de='Jedes Individuum hat Rechte.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'فرد' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='تیم ما برنده شد.', beispielsatz_de='Unser Team hat gewonnen.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'تیم' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='شورای شهر جلسه داشت.', beispielsatz_de='Der Stadtrat hatte eine Sitzung.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'شورا' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='وزیر سخنرانی کرد.', beispielsatz_de='Der Minister hielt eine Rede.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'وزیر' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='آقای محمدی اینجاست؟', beispielsatz_de='Ist Herr Mohammadi hier?'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'آقا' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='او در یک شرکت بزرگ کار می‌کند.', beispielsatz_de='Er arbeitet in einer großen Firma.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'شرکت' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='کسی در خانه نیست.', beispielsatz_de='Niemand ist zu Hause.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'کس' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='او عضو باشگاه است.', beispielsatz_de='Er ist Mitglied des Klubs.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'عضو' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='محمد فردا می‌آید.', beispielsatz_de='Mohammad kommt morgen.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'محمد' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='جامعه در حال تغییر است.', beispielsatz_de='Die Gesellschaft verändert sich.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'جامعه' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='او به مقام بالایی رسید.', beispielsatz_de='Er erreichte einen hohen Rang.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'مقام' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='مجلس قانون را تصویب کرد.', beispielsatz_de='Das Parlament verabschiedete das Gesetz.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'مجلس' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='آن زن معلم است.', beispielsatz_de='Diese Frau ist Lehrerin.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'زن' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='این کشور یک جمهوری است.', beispielsatz_de='Dieses Land ist eine Republik.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'جمهوری' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='او به سیاست علاقه دارد.', beispielsatz_de='Er interessiert sich für Politik.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'سیاست' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='او نماینده‌ی مردم است.', beispielsatz_de='Er ist Vertreter des Volkes.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'نماینده' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='یک ملت بزرگ است.', beispielsatz_de='Es ist eine große Nation.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'ملت' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='هر صبح روزنامه می‌خوانم.', beispielsatz_de='Jeden Morgen lese ich die Zeitung.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'روزنامه' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='جنگ سال‌ها طول کشید.', beispielsatz_de='Der Krieg dauerte Jahre.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'جنگ' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='صنعت خودرو مهم است.', beispielsatz_de='Die Autoindustrie ist wichtig.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'صنعت' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='از همکاری شما ممنونم.', beispielsatz_de='Ich danke für Ihre Zusammenarbeit.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'همکاری' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='اسلام در این منطقه گسترش یافت.', beispielsatz_de='Der Islam breitete sich in dieser Region aus.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'اسلام' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='حسن همسایه‌ی ماست.', beispielsatz_de='Hasan ist unser Nachbar.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'حسن' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='خانواده‌ی بزرگی داریم.', beispielsatz_de='Wir haben eine große Familie.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'خانواده' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='او در وزارت کار می‌کند.', beispielsatz_de='Er arbeitet im Ministerium.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'وزارت' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='خانه‌ام نزدیک ایستگاه است.', beispielsatz_de='Mein Haus ist nahe der Station.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'نزدیک' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='از هر سو صدا می‌آمد.', beispielsatz_de='Von allen Seiten kamen Geräusche.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'سو' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='این منطقه خیلی سرسبز است.', beispielsatz_de='Diese Region ist sehr grün.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'منطقه' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='کتاب روی طبقه‌ی بالا است.', beispielsatz_de='Das Buch ist im oberen Regal.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'بالا' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='او در آمریکا زندگی می‌کند.', beispielsatz_de='Er lebt in Amerika.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'آمریکا' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='تهران پایتخت ایران است.', beispielsatz_de='Teheran ist die Hauptstadt des Iran.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'تهران' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='اینجا جای خوبی است.', beispielsatz_de='Hier ist ein guter Platz.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'جا' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='مغازه در مرکز شهر است.', beispielsatz_de='Der Laden ist im Stadtzentrum.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'مرکز' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='توپ روی زمین افتاد.', beispielsatz_de='Der Ball fiel auf den Boden.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'زمین' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='او در خارج درس می‌خواند.', beispielsatz_de='Er studiert im Ausland.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'خارج' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='امروز حالم بهتر است.', beispielsatz_de='Heute geht es mir besser.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'بهتر' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='رنگ‌های مختلفی دارد.', beispielsatz_de='Es hat verschiedene Farben.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'مختلف' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='این کفش‌ها جدید هستند.', beispielsatz_de='Diese Schuhe sind neu.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'جدید' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='او مرد جوانی است.', beispielsatz_de='Er ist ein junger Mann.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'جوان' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='امروز جشن ملی است.', beispielsatz_de='Heute ist Nationalfeiertag.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'ملی' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='وضع اقتصادی بهتر شده است.', beispielsatz_de='Die wirtschaftliche Lage hat sich verbessert.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'اقتصادی' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='همه در جلسه حاضر بودند.', beispielsatz_de='Alle waren bei der Sitzung anwesend.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'حاضر' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='این کار ممکن است.', beispielsatz_de='Diese Sache ist möglich.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'ممکن' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='قند زیادی خوردی.', beispielsatz_de='Du hast zu viel Zucker gegessen.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'زیادی' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='دلیل اصلی این بود.', beispielsatz_de='Der Hauptgrund war dieser.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'اصلی' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='او یک زبان خارجی بلد است.', beispielsatz_de='Er kann eine Fremdsprache.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'خارجی' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='همراه دوستم آمدم.', beispielsatz_de='Ich kam zusammen mit meinem Freund.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'همراه' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='این یک مشکل جهانی است.', beispielsatz_de='Das ist ein globales Problem.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'جهانی' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='این روز ویژه‌ای است.', beispielsatz_de='Das ist ein besonderer Tag.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'ویژه' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='دو نیمه برابر است.', beispielsatz_de='Die zwei Hälften sind gleich.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'برابر' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='غذای ایرانی خوشمزه است.', beispielsatz_de='Iranisches Essen ist lecker.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'ایرانی' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='کار را کامل انجام بده.', beispielsatz_de='Erledige die Arbeit vollständig.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'کامل' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='امروز وقت آزاد دارم.', beispielsatz_de='Heute habe ich freie Zeit.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'آزاد' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='چه کسی مسئول است؟', beispielsatz_de='Wer ist verantwortlich?'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'مسئول' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='در امتحان موفق شدم.', beispielsatz_de='Ich war in der Prüfung erfolgreich.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'موفق' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='در روزهای اخیر سرد بوده است.', beispielsatz_de='In den letzten Tagen war es kalt.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'اخیر' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='شهر آن‌ها دور است.', beispielsatz_de='Ihre Stadt ist weit weg.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'دور' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='جشن دیشب برگزار شد.', beispielsatz_de='Das Fest fand gestern Abend statt.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'برگزار' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='این آب قابل نوشیدن است.', beispielsatz_de='Dieses Wasser ist trinkbar.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'قابل' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='البته که کمکت می‌کنم.', beispielsatz_de='Natürlich helfe ich dir.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'البته' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='او در حال خواندن است.', beispielsatz_de='Er ist gerade beim Lesen.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'در حال' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='آخرِ ماه پول کم می‌آورم.', beispielsatz_de='Am Monatsende fehlt mir Geld.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'آخر' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='کاملاً درست می‌گویی.', beispielsatz_de='Du hast völlig recht.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'کاملاً' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='او هنوز نیامده است.', beispielsatz_de='Er ist noch nicht gekommen.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'هنوز' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='نخست باید استراحت کنی.', beispielsatz_de='Zuerst musst du dich ausruhen.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'نخست' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='او مانند پدرش است.', beispielsatz_de='Er ist wie sein Vater.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'مانند' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='اکنون وقت رفتن است.', beispielsatz_de='Jetzt ist es Zeit zu gehen.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'اکنون' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='گذشته را فراموش کن.', beispielsatz_de='Vergiss die Vergangenheit.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'گذشته' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='ماه آینده تعطیلات دارم.', beispielsatz_de='Nächsten Monat habe ich Urlaub.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'ماه' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='زمان زود می‌گذرد.', beispielsatz_de='Die Zeit vergeht schnell.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'زمان' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='این بار من می‌پردازم.', beispielsatz_de='Dieses Mal zahle ich.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'بار' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='حالت چطور است؟', beispielsatz_de='Wie ist dein Befinden?'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'حال' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='بعد از ناهار می‌آیم.', beispielsatz_de='Nach dem Mittagessen komme ich.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'بعد' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='یک دوره‌ی زبان شروع کردم.', beispielsatz_de='Ich habe einen Sprachkurs begonnen.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'دوره' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='تا پایان فیلم ماندیم.', beispielsatz_de='Wir blieben bis zum Ende des Films.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'پایان' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='به آینده امیدوارم.', beispielsatz_de='Ich bin hoffnungsvoll für die Zukunft.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'آینده' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='امروز هوا آفتابی است.', beispielsatz_de='Heute ist das Wetter sonnig.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'امروز' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='ساعت چند است؟', beispielsatz_de='Wie spät ist es?'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'ساعت' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='این هفته خیلی شلوغ است.', beispielsatz_de='Diese Woche ist sehr voll.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'هفته' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='آغاز سال نو مبارک.', beispielsatz_de='Frohen Beginn des neuen Jahres.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'آغاز' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='به مرحله‌ی بعد رسیدیم.', beispielsatz_de='Wir haben die nächste Stufe erreicht.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'مرحله' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='این بار دوم است.', beispielsatz_de='Das ist das zweite Mal.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'دوم' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='سه کتاب خریدم.', beispielsatz_de='Ich habe drei Bücher gekauft.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'سه' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='این لباس صد هزار تومان است.', beispielsatz_de='Dieses Kleid kostet hunderttausend Tuman.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'هزار' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='این شهر دو میلیون نفر جمعیت دارد.', beispielsatz_de='Diese Stadt hat zwei Millionen Einwohner.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'میلیون' and beispielsatz_ko is null;
update public.vocab_items set beispielsatz_ko='او در مسابقه سوم شد.', beispielsatz_de='Er wurde im Wettbewerb Dritter.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'سوم' and beispielsatz_ko is null;
