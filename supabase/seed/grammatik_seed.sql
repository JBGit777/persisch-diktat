-- ============================================================================
-- Grammatik-Notizen pro grammatischer Lektion (Deutsch, Markdown).
-- Voraussetzung: Migrationen 0001–0004 + persisch_seed.sql (Lektionen existieren).
-- Im Supabase SQL Editor ausführen. Idempotent (ersetzt vorhandene Grammatik-Notizen).
-- >>> App-Login-E-Mail (eine Stelle): jreitzenstein@gmail.com
-- ============================================================================

delete from public.lesson_resources
 where typ = 'grammatik' and user_id = (select id from auth.users where email='jreitzenstein@gmail.com');

insert into public.lesson_resources (user_id, lesson_id, typ, titel, inhalt, reihenfolge)
select (select id from auth.users where email='jreitzenstein@gmail.com'), l.id, 'grammatik', g.titel, g.inhalt, 0
from (values
  (102, 'Präpositionen & Ezafe', '# Präpositionen & Ezafe

## Häufige Präpositionen
| fa | Umschrift | de |
|---|---|---|
| از | az | von, aus, seit |
| به | be | zu, nach, an |
| در | dar | in |
| با | bâ | mit |
| برای | barâye | für |
| بر | bar | auf, über |
| تا | tâ | bis |

## Ezafe – das wichtigste Verbindungsstück
Die **Ezafe** ist ein unbetontes **-e** (nach Vokal **-ye**), das Wörter verknüpft:
Nomen + Adjektiv, Nomen + Nomen (Besitz), Vorname + Nachname.

- کتاب خوب — *ketâb-e khub* — „das gute Buch"
- کتاب من — *ketâb-e man* — „mein Buch"
- در خانه — *dar-e khâne* — „die Tür des Hauses"
- خانه‌ی بزرگ — *khâne-ye bozorg* — „das große Haus" (nach Vokal **-ye**)

Die Ezafe wird meist **nicht geschrieben**, nur mitgesprochen.'),
  (103, 'Pronomen & Possessivendungen', '# Pronomen

## Personalpronomen
| fa | Umschrift | de |
|---|---|---|
| من | man | ich |
| تو | to | du |
| او | u | er/sie |
| ما | mâ | wir |
| شما | shomâ | ihr/Sie |
| آن‌ها | ânhâ | sie (Pl.) |

## Enklitische Possessivendungen
Besitz wird oft als **Endung** ans Nomen gehängt: کتاب → کتابم (*ketâbam* „mein Buch"),
کتابت (dein), کتابش (sein/ihr), کتابمان (unser), کتابتان (euer), کتابشان (ihr, Pl.).

## Objektmarker را
Ein **bestimmtes** direktes Objekt bekommt **را** (*râ*, ugs. *-o*):
کتاب را خواندم — *ketâb râ khândam* — „Ich las **das** Buch.\"'),
  (106, 'Verneinung', '# Verneinung

- Verben verneint das Präfix **نـ** (*na-*): رفتم → **نرفتم** (*naraftam* „ich ging nicht").
- Im **Präsens** verschmilzt es zu **نمی‌**: می‌روم → **نمی‌روم** (*nemiravam* „ich gehe nicht").
- „sein" (است) wird zu **نیست** (*nist* „ist nicht").
- Einzelnes „nein": **نه** (*na*). „kein/nichts": **هیچ** (*hich*).

> نمی‌ schreibt man mit **ZWNJ** (نمی‌روم). Beim Diktat akzeptiert die App auch die Schreibung ohne ZWNJ.'),
  (101, 'Konnektoren', '# Konnektoren (Verbindungswörter)

| fa | Umschrift | de |
|---|---|---|
| و | va/o | und |
| یا | yâ | oder |
| اما / ولی | ammâ / vali | aber |
| چون | chun | weil |
| اگر | agar | wenn, falls |
| که | ke | dass / der, die (Relativ) |
| تا | tâ | bis, damit |

**که** ist das häufigste: es leitet **Nebensätze** ein – „dass"-Sätze und **Relativsätze**:
- می‌دانم **که** او می‌آید — „Ich weiß, **dass** er kommt."
- کتابی **که** خریدم — „das Buch, **das** ich kaufte.\"'),
  (104, 'Quantoren & Plural', '# Quantoren & Plural

## Pluralbildung
- **ـها** (universell): کتاب → کتاب‌ها (*ketâbhâ* „Bücher").
- **ـان** (Belebtes, gehoben): دانشجو → دانشجویان.
- Nach einer **Zahl** bleibt das Nomen **Singular**: سه کتاب (*se ketâb* „drei Bücher").

## Häufige Quantoren
| fa | de |
|---|---|
| هر | jede/r/s |
| همه | alle / alles |
| چند | einige / wie viele |
| بعضی / برخی | manche |
| هیچ | kein / keiner |

## Unbestimmtheit
Ein **ی** am Wortende heißt „ein(e) …": کتابی (*ketâbi* „ein Buch").'),
  (105, 'Fragen & Fragewörter', '# Fragen & Fragewörter

## Ja/Nein-Fragen
Gleiche Wortstellung wie die Aussage, nur **Intonation** – oder einleitendes **آیا**:
**آیا** می‌آیی؟ — *âyâ miâyi?* — „Kommst du?"

## Fragewörter
| fa | Umschrift | de |
|---|---|---|
| چه / چی | che / chi | was |
| که / کی | ke / ki | wer |
| کجا | kojâ | wo |
| کی | key | wann |
| چرا | cherâ | warum |
| چطور / چگونه | chetor / chegune | wie |
| کدام | kodâm | welche/r |

Das Fragewort steht meist **dort, wo die Antwort** stünde: کجا می‌روی؟ — „Wohin gehst du?\"'),
  (201, 'Verben 1 – Bau & Präsens', '# Verben 1 – Bau & Präsens

## Infinitiv & Stämme
Infinitive enden auf **-تن/-دن**: رفتن (*raftan* „gehen"). Jedes Verb hat zwei Stämme:
- **Vergangenheitsstamm** = Infinitiv ohne ن: رفت (*raft*)
- **Präsensstamm** (unregelmäßig – lernen!): رو (*rav*)

| Infinitiv | Präsensstamm | de |
|---|---|---|
| رفتن | رو | gehen |
| دیدن | بین | sehen |
| کردن | کن | machen |
| بودن | باش | sein |

## Präsens = می‌ + Präsensstamm + Endung
می‌روم *miravam* (ich gehe), می‌روی, می‌رود, می‌رویم, می‌روید, می‌روند.

Personalendungen: من ـم · تو ـی · او ـد · ما ـیم · شما ـید · آن‌ها ـند.'),
  (202, 'Verben 2 – Vergangenheit & Perfekt', '# Verben 2 – Vergangenheit & Perfekt

## Einfache Vergangenheit
**Vergangenheitsstamm + Endung** (او ohne Endung):
رفتم، رفتی، رفت، رفتیم، رفتید، رفتند (*raftam* „ich ging" …).

## Imperfekt (Verlauf/Gewohnheit)
**می‌ + Vergangenheitsstamm + Endung**: می‌رفتم (*miraftam* „ich ging gerade / pflegte zu gehen").

## Perfekt
**Partizip (Vergangenheitsstamm + ـه) + Kurzform von بودن**:
رفته‌ام (*rafte-am* „ich bin gegangen"), رفته‌ای, رفته است …

## Futur (formell)
**خواه + Endung + Kurzinfinitiv**: خواهم رفت (*khâham raft* „ich werde gehen"). Umgangssprachlich oft einfach Präsens.'),
  (203, 'Modalverben & Konjunktiv', '# Modalverben & Konjunktiv

## باید (müssen/sollen)
Unveränderlich **باید** + Konjunktiv: **باید بروم** (*bâyad beravam* „ich muss gehen"). Verneint: **نباید**.

## توانستن (können) & خواستن (wollen)
Konjugiertes Modalverb + Konjunktiv des Vollverbs:
- می‌توانم بروم — *mitavânam beravam* — „ich kann gehen"
- می‌خواهم بروم — *mikhâham beravam* — „ich will gehen"

> Der **Konjunktiv** = **بـ + Präsensstamm + Endung**: بروم، بروی، برود …'),
  (204, 'Funktionsverbgefüge (Light-Verben)', '# Funktionsverbgefüge (zusammengesetzte Verben)

Sehr viele persische Verben sind **Nomen/Adjektiv + Light-Verb**. Konjugiert wird nur das Light-Verb:

| Light-Verb | Bedeutung | Beispiel |
|---|---|---|
| کردن | machen | کار کردن (arbeiten), استفاده کردن (benutzen) |
| شدن | werden | باز شدن (sich öffnen), تمام شدن (enden) |
| دادن | geben | انجام دادن (durchführen), نشان دادن (zeigen) |
| زدن | schlagen | حرف زدن (reden), زنگ زدن (anrufen) |
| گرفتن | nehmen | یاد گرفتن (lernen), تماس گرفتن (Kontakt aufnehmen) |
| داشتن | haben | دوست داشتن (mögen), قرار داشتن (sich befinden) |

Beispiel: کار **می‌کنم** (*kâr mikonam* „ich arbeite") · انجام **دادم** (*anjâm dâdam* „ich führte durch").'),
  (403, 'Zahlen', '# Zahlen

## 1–10
۱ یک *yek* · ۲ دو *do* · ۳ سه *se* · ۴ چهار *chahâr* · ۵ پنج *panj* · ۶ شش *shesh* · ۷ هفت *haft* · ۸ هشت *hasht* · ۹ نه *noh* · ۱۰ ده *dah*

## Zehner & mehr
بیست (20), سی (30), چهل (40), پنجاه (50) … صد (100), هزار (1000), میلیون.
Verbindung mit **و**: بیست **و** یک = 21 (*bist-o-yek*).

## Zähleinheit تا
Beim Zählen steht oft **تا** zwischen Zahl und Nomen: سه **تا** کتاب (*se tâ ketâb*). Das Nomen bleibt **Singular**.

## Persische Ziffern
۰۱۲۳۴۵۶۷۸۹ – die App rechnet sie beim Diktat automatisch in 0–9 um.')
) as g(lek, titel, inhalt)
join public.lessons l on l.user_id = (select id from auth.users where email='jreitzenstein@gmail.com') and l.lektion_nummer = g.lek;
