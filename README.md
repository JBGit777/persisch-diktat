# Persisch-Diktat 🇮🇷

Deutschsprachige Web-App für Hör- und Diktatübungen auf Persisch (Farsi), mit
Cloud-Sync über mehrere Geräte (Supabase). Abgeleitet aus der Koreanisch-Diktat-App;
Architektur, Supabase-Schema und Deploy-Setup sind unverändert übernommen.

- **Next.js** (App Router) · TypeScript · Tailwind CSS
- **RTL** durchgängig (`dir="rtl"`, `lang="fa"`) mit Bidi-Handling für
  eingestreute Latein-/Zahlenteile
- **Vazirmatn** als Web-Schrift (via `next/font`) mit System-Fallback
- **Supabase** für Auth (E-Mail Magic Link), Postgres-Datenbank und Sync
- **Web Speech API** (fa-IR) für die Sprachausgabe – mit Verfügbarkeitsprüfung
  und Fallback-Plan (s. u.)
- Zentrale **`normalizeFa()`**-Normalisierung vor jedem Antwortvergleich
- **SM-2** Spaced-Repetition für die Auswahl der nächsten Übungen

> **Texteingabe** erfolgt über die persische Systemtastatur von iOS/macOS –
> es gibt bewusst keine eingebettete Bildschirm-Tastatur.

---

## Voraussetzungen

- **Node.js 20+** (LTS) – Installer: <https://nodejs.org/en/download>
- Ein kostenloses **Supabase**-Konto: <https://supabase.com>

---

## Schritt 1 – Pakete installieren

```bash
cd ~/Projekte/persisch-diktat
npm install
```

## Schritt 2 – Supabase-Projekt anlegen

1. Auf <https://supabase.com> einloggen → **New project**.
2. Name z. B. `persisch-diktat`, ein Datenbank-Passwort vergeben, Region
   „Central EU (Frankfurt)" wählen → **Create new project** (dauert ~1 Min.).
3. Nach dem Anlegen unter **Project Settings → Data API** die **Project URL**
   kopieren und unter **Project Settings → API Keys** den **anon / public**
   Key kopieren.

## Schritt 3 – Umgebungsvariablen eintragen

```bash
cp .env.local.example .env.local
```

Dann `.env.local` öffnen und die beiden Werte eintragen:

```
NEXT_PUBLIC_SUPABASE_URL=https://DEIN-PROJEKT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=DEIN-ANON-PUBLIC-KEY
```

## Schritt 4 – Datenbank-Tabellen erstellen

1. Im Supabase-Dashboard links auf **SQL Editor** → **New query**.
2. Die Migrationen **der Reihe nach** ausführen (jeweils Inhalt einfügen → **Run**):
   [`0001_init.sql`](supabase/migrations/0001_init.sql) ·
   [`0002_lessons.sql`](supabase/migrations/0002_lessons.sql) ·
   [`0003_haeufigkeit.sql`](supabase/migrations/0003_haeufigkeit.sql) ·
   [`0004_hinweis.sql`](supabase/migrations/0004_hinweis.sql)
3. Das legt die Tabellen `vocab_items`, `dictation_attempts`, `review_state`,
   `lessons`, `lesson_resources`, `lesson_progress` an (inkl. **Row Level
   Security**) und ergänzt die Spalte `vocab_items.hinweis` (Lernhinweis).

## Schritt 5 – Magic-Link-Login konfigurieren

1. **Authentication → Sign In / Providers → Email**: sicherstellen, dass
   *Email* aktiviert ist. (Für den lokalen Start reicht „Enable Email
   provider"; „Confirm email" kann an bleiben.)
2. **Authentication → URL Configuration**:
   - **Site URL**: `http://localhost:3000`
   - **Redirect URLs**: `http://localhost:3000/**` hinzufügen.
3. Hinweis: Im kostenlosen Tarif verschickt Supabase die Magic-Link-Mails
   selbst (begrenztes Kontingent). Für den Test reicht das problemlos.

## Schritt 6 – App starten

```bash
npm run dev
```

→ <http://localhost:3000> öffnen. Du wirst auf **/login** umgeleitet.

## Schritt 7 – Vokabeln einspielen

**Empfohlen (vollständig):** der SQL-Seed mit **500 Kern-Vokabeln** (Frequenzrang
1–500) inkl. Beispielsätzen, Lernhinweisen, Häufigkeit und **28 Lektionen** in 4 Teilen.

1. Einmal in der App **registrieren/anmelden** (damit dein Nutzerkonto existiert).
2. [`supabase/seed/persisch_seed.sql`](supabase/seed/persisch_seed.sql) öffnen und
   ganz oben deine **App-Login-E-Mail** eintragen (eine Stelle; aktuell
   `jreitzenstein@gmail.com`).
3. Den Inhalt im **SQL Editor** ausführen. Das Skript ist idempotent
   (löscht vorherige Seed-Vokabeln im Bereich 101–499 und legt sie neu an).

Die Vokabeln sind nach grammatischer Funktion in **4 Teile** gegliedert; große
Kategorien sind frequenzsortiert in Unter-Lektionen (~25 Wörter) aufgeteilt:

| Teil | Lektionen |
|---|---|
| 1 – Grammatik-Gerüst | Konnektoren · Präpositionen · Pronomen · Quantoren · Fragewörter · Verneinung |
| 2 – Verben | Kernverben (1–2) · Modalverben · Funktionsverbgefüge |
| 3 – Wortschatz | Abstrakta (1–7) · Gesellschaft (1–3) · Orte · Adjektive (1–3) · Adverbien |
| 4 – Zeit & Zahlen | Zeit (1–2) · Zahlen |

Häufigkeit nach Frequenzrang: **1–150 → Tier 5**, 151–300 → 4, 301–500 → 3
(Funktionswörter mind. 4). Der Häufigkeitsfilter im Diktat lässt dich so gezielt
„nur die wichtigsten" üben.

### Quelle, Review-Status & Attribution

Wortliste, Wortart und IPA stammen aus der Wiktionary-Frequenzliste **Miller /
Aghajanian-Stewart (2009)**, basierend auf *A Frequency Dictionary of Persian:
Core Vocabulary for Learners* (Routledge). Erstellt nach dem **Review-Workflow**
der Arbeitsmappe:

- **Rang 1–120** stammen aus der geprüften Arbeitsmappe (mit Beispielsätzen).
- **Rang 121–500** sind redaktioneller **Entwurf** (deutsche Übersetzung +
  Kategorie von Claude; Romanisierung deterministisch aus IPA) – vor
  Veröffentlichung bitte durchsehen.
- Korrupte Schreibungen der Quelle (z. B. `لا`↔`ال`, vertauschte Verb-Token)
  wurden korrigiert; **Eigennamen / religiös-politische / medienlastige** Begriffe
  sind im `hinweis`-Feld markiert.
- Vor einer Veröffentlichung der App: Wiktionary-Lizenz (CC BY-SA) prüfen und
  Quellenangabe in der App ergänzen (Wiktionary-Frequenzliste, Miller 2009).

**Grammatik (optional):** [`supabase/seed/grammatik_seed.sql`](supabase/seed/grammatik_seed.sql)
im SQL Editor ausführen (E-Mail wie oben). Das hängt **deutsche Grammatik-Notizen**
(Ezafe, Verbstämme + Personalendungen, Verneinung, Light-Verben, Plural, Zahlen …)
an die passenden grammatischen Lektionen (Teil 1+2 sowie Zahlen). Sie erscheinen
read-only auf der jeweiligen Lektionsseite; Substantiv-Lektionen haben keine.

**Alternativ (nur Grundwortschatz):** [`vokabeln.csv`](supabase/seed/vokabeln.csv)
über **Import** in der App hochladen – das bringt nur Wort/Umschrift/Deutsch/Lektion
(ohne Beispielsätze und Hinweise).

Danach unter **Diktat** eine Übungssitzung starten. Über den **Zieltext**-Schalter
wählst du, ob das **Wort** (Beispielsatz als Kontext) oder der ganze **Satz**
diktiert wird. 🎧

> **Schema-Hinweis:** Das Supabase-Schema bleibt bis auf die additive Spalte
> `vocab_items.hinweis` unverändert. Die Spalte `hangul` hält den **persischen**
> Wortlaut, `beispielsatz_ko` den persischen Beispielsatz.

---

## Geräteübergreifende Synchronisierung

Sobald du auf einem zweiten Gerät denselben Magic-Link-Login nutzt, sind deine
Vokabeln, Diktat-Versuche und der SM-2-Lernstand sofort verfügbar – die Daten
liegen in Supabase, nicht lokal.

## Projektstruktur (modular)

```
src/
  app/
    page.tsx              Übersichts-Dashboard
    login/                Magic-Link-Login
    auth/callback/        Session-Austausch nach E-Mail-Klick
    auth/signout/         Abmelden
    diktat/               Diktat-Modus (Seite)
    import/               CSV-Import (Seite)
  components/
    NavBar.tsx
    CsvImporter.tsx       CSV-Upload + Spaltenzuordnung
    DiktatSession.tsx     Sitzungs-Ablauf (TTS, Eingabe, Bewertung)
  lib/
    supabase/             Browser-/Server-/Middleware-Clients
    types.ts              Datenbank-Typen
    srs.ts                SM-2-Logik (rein, testbar)  ← Vokabel-SRS-Modul
    session.ts            Kartenauswahl einer Sitzung
    diff.ts               Zeichengenauer Vergleich (nutzt normalizeFa)
    normalizeFa.ts        Zentrale Persisch-Normalisierung (vor jedem Vergleich)
    tts.ts                Web-Speech-Hook (fa-IR) + Verfügbarkeitsprüfung
    dashboard.ts          Dashboard-Kennzahlen
supabase/
  migrations/0001_init.sql
  seed/vokabeln.csv
```

Die fachliche Logik (`srs.ts`, `session.ts`, `diff.ts`, `dashboard.ts`,
`lessons.ts`) ist bewusst von der UI getrennt.

## Lektions-Modul (Migration 0002)

Macht die Lektion zur zentralen Einheit: Grammatik, Video, Audio und ein
lektionsbezogenes Diktat.

1. Im Supabase **SQL Editor** den Inhalt von
   [`supabase/migrations/0002_lessons.sql`](supabase/migrations/0002_lessons.sql)
   ausführen. Das legt `lessons`, `lesson_resources`, `lesson_progress` (mit RLS)
   sowie den privaten Storage-Bucket `lektion-audio` an und erzeugt die Lektionen
   automatisch aus deinen importierten Vokabeln.
2. Dev-Server neu starten → Tab **Lektionen**.

Pro Lektion (`/lektionen/[id]`):
- **📖 Grammatik** – Markdown-Editor; optional „✨ KI-Entwurf erzeugen" (s. u.).
- **🎬 Video** – YouTube-URL einbetten.
- **🎧 Audio** – eigene Audiodateien in den **privaten** Bucket hochladen
  (nur dein Konto kann sie per signierter URL abspielen).
- **🎧 Diktat zu dieser Lektion** – startet `/diktat?lektion=NNN`, gefiltert auf
  die Vokabeln der Lektion.

### Optional: KI-Grammatik-Entwürfe

Trage in `.env.local` einen `ANTHROPIC_API_KEY` ein (Key unter
<https://console.anthropic.com> → API Keys). Dann erscheint im Grammatik-Bereich
ein Button, der mit der Claude API einen deutschsprachigen Grammatik-Entwurf
(basierend auf den Vokabeln der Lektion) erzeugt, den du prüfen und speichern
kannst. Ohne Key bleibt der Button ausgeblendet – Grammatik kann man trotzdem
selbst schreiben.

---

## Persisch-Normalisierung (`normalizeFa`)

Vor **jedem** Antwortvergleich werden erwarteter Text und Eingabe durch
[`src/lib/normalizeFa.ts`](src/lib/normalizeFa.ts) geschickt (eingebunden in
[`src/lib/diff.ts`](src/lib/diff.ts)). Das macht den Vergleich fair gegenüber
gleichwertigen Schreibweisen:

- arabisches **ي → ی** (Ye) und **ك → ک** (Kaf) vereinheitlicht
- **Harakat/Tanwin** (Vokalzeichen) und **Tatweel** (ـ) entfernt
- **persische (۰–۹) und arabische (٠–٩) Ziffern → ASCII** 0–9
- mehrfache Leerzeichen zusammengefasst, getrimmt

**Bewusste Entscheidungen (anpassbar in `normalizeFa.ts`):**

- **ZWNJ (U+200C) wird entfernt** → toleranter Vergleich
  (نمی‌روم == نمیروم). Möchtest du korrekte Orthografie **erzwingen**, streiche
  die ZWNJ-Zeile.
- **آ (Alef madda) wird NICHT zu ا normalisiert** – der lange Vokal soll
  phonemisch unterschieden bleiben.

## TTS-Fallback (fa-IR)

Die Sprachausgabe nutzt die **Web Speech API** mit Sprache `fa-IR`
([`src/lib/tts.ts`](src/lib/tts.ts)). **Wichtig:** iOS/macOS liefern
standardmäßig **keine** persische Systemstimme mit; Chrome/Edge am Desktop haben
teils eine. Der Hook prüft zur Laufzeit, ob überhaupt eine fa-Stimme existiert,
und meldet `unterstuetzt = false`, wenn nicht – die UI blendet dann einen Hinweis
ein und der Hör-Modus stuft sauber zurück (Übersetzen-Modus bleibt nutzbar).

**Geplante Ausbaustufen für verlässliches Audio** (falls keine Systemstimme da):

1. **Vorab erzeugte Audiodateien** je Satz/Vokabel im bereits vorhandenen
   privaten Storage-Bucket (`lesson_resources.typ = 'audio'`) – kein laufender
   API-Aufwand, offline-fähig.
2. **Cloud-TTS-Route** (z. B. Google/Azure/ElevenLabs fa-IR) analog zu
   `src/app/api/grammatik/route.ts`: serverseitig MP3 erzeugen und streamen.

Bis dahin funktioniert die App vollständig im **Übersetzen-Modus** (Deutsch →
Persisch tippen) ohne jede Sprachausgabe.
