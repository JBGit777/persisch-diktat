-- ============================================================================
-- Bereinigt Vorarbeits-/Editorial-Hinweise (Platzhalter, „… prüfen", medienlastig …).
-- Präsensstämme und sinnvolle Hinweise (Homograph/Eigenname) bleiben erhalten.
-- ADDITIV/idempotent, kein Fortschrittsverlust. Im SQL Editor ausführen.
-- >>> App-Login-E-Mail: jreitzenstein@gmail.com
-- ============================================================================

update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'اگر';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'یعنی';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'بین';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'بدون';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'رو';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'همین';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'من';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'وی';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'تمام';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'چند';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'چه';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'هیچ';
update public.vocab_items set hinweis = 'Homograph: نه = nein / neun'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'نه';
update public.vocab_items set hinweis = 'Präsensstamm: دان.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'دانستن';
update public.vocab_items set hinweis = 'Präsensstamm: آی.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'آمدن';
update public.vocab_items set hinweis = 'Präsensstamm: یاب.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'یافتن';
update public.vocab_items set hinweis = 'Präsensstamm: آور.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'آوردن';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'وارد';
update public.vocab_items set hinweis = 'Präsensstamm: ده.'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'نشان دادن';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'عنوان';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'مورد';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'دست';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'قرار';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'برنامه';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'بخش';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'وجود';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'مسئله';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'توجه';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'امر';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'طور';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'مشکل';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'نتیجه';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'رابطه';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'شرط';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'اساس';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'زمینه';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'نفت';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'گروه';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'اسلامی';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'رئیس';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'دولت';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'جمله';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'نفر';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'سیاسی';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'جهان';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'علی';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'سازمان';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'فرد';
update public.vocab_items set hinweis = 'Anrede / Eigenname'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'آقا';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'جنگ';
update public.vocab_items set hinweis = 'religiöser Begriff'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'اسلام';
update public.vocab_items set hinweis = 'Eigenname'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'حسن';
update public.vocab_items set hinweis = 'politischer Begriff'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'انقلاب';
update public.vocab_items set hinweis = 'religiöser Begriff'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'دین';
update public.vocab_items set hinweis = 'religiös/politischer Begriff'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'شهید';
update public.vocab_items set hinweis = 'politischer Begriff'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'حزب';
update public.vocab_items set hinweis = 'religiöser Begriff'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'امام';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'نزدیک';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'سو';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'منطقه';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'بالا';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'آمریکا';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'زمین';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'بهتر';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'مختلف';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'جدید';
update public.vocab_items set hinweis = 'Homograph: نظامی = militärisch / Nezami'
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'نظامی';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'گذشته';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'ماه';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'زمان';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'بار';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'حال';
update public.vocab_items set hinweis = NULL
where user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and hangul = 'بعد';
