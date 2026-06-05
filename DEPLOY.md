# Deployment auf Vercel (kostenlos)

So machst du die App unter einer öffentlichen `https`-Adresse verfügbar – nutzbar
auf iPhone/iPad und überall, ohne dass dein Mac laufen muss. Deine Daten liegen
weiterhin in Supabase.

## Voraussetzungen
- Ein **GitHub**-Konto (github.com)
- Ein **Vercel**-Konto (vercel.com – „Continue with GitHub")

Diese Persisch-Variante ist aus der Koreanisch-App **abgeleitet**: eigenes
GitHub-Repo, eigenes Supabase-Projekt, eigenes Vercel-Projekt. Architektur und
Schema bleiben gleich, nur die Werte sind neu. `.env.local` ist absichtlich
**nicht** eingecheckt – die Keys trägst du in Vercel ein.

## 1. Auf GitHub hochladen
1. Auf <https://github.com/new> ein **neues, leeres** Repository anlegen
   (Name z. B. `persisch-diktat`, **ohne** README/.gitignore).
2. GitHub zeigt dir „…or push an existing repository". Führe in einem Terminal aus
   (im Projektordner `~/Projekte/persisch-diktat`):
   ```bash
   git init && git add -A && git commit -m "Persisch-Diktat: erster Commit"
   git branch -M main
   git remote add origin https://github.com/DEIN-NAME/persisch-diktat.git
   git push -u origin main
   ```
   (Beim ersten Push nach Benutzername + **Personal Access Token** gefragt? Token
   unter github.com → Settings → Developer settings → Tokens erstellen.)

## 2. In Vercel importieren
1. Auf <https://vercel.com/new> das GitHub-Repo **Import**.
2. Framework wird automatisch als **Next.js** erkannt – nichts ändern.
3. Unter **Environment Variables** eintragen (Werte aus deiner `.env.local`):
   | Name | Wert |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://DEIN-NEUES-PROJEKT.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | dein `sb_publishable_…`-Key |
   | `ANTHROPIC_API_KEY` *(optional)* | nur falls du KI-Grammatik online willst |
4. **Deploy** klicken. Nach ~1 Min. bekommst du eine URL wie
   `https://persisch-diktat.vercel.app`.

## 3. Supabase für die neue Adresse freigeben
Supabase-Dashboard → **Authentication → URL Configuration**:
- **Site URL**: deine Vercel-URL
- **Redirect URLs**: zusätzlich `https://DEINE-URL.vercel.app/**`

(Für den Passwort-Login nicht zwingend, aber gut für Magic Link / künftige Flows.)

## 4. Auf dem iPhone/iPad installieren
1. Vercel-URL in **Safari** öffnen, anmelden.
2. **Teilen-Symbol → „Zum Home-Bildschirm"**.
3. Die App startet künftig im Vollbild mit dem App-Icon – wie eine native App.

## Updates veröffentlichen
Jede Änderung einfach committen und pushen – Vercel deployt automatisch neu:
```bash
git add -A && git commit -m "…" && git push
```
