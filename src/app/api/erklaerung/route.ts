import { NextResponse, type NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";

/**
 * Erklärt nach einem fehlerhaften Diktat-Versuch, WARUM die Eingabe falsch
 * war – kurz, deutsch, mit persischem Bezug (Homophone, ZWNJ, Vokal-Hörfehler).
 * Wird on-demand aus dem Ergebnis-Screen aufgerufen ("✨ Warum?").
 *
 * Voraussetzung: ANTHROPIC_API_KEY (Vercel-Env bzw. .env.local). Ohne Key
 * blendet die UI den Button aus; die Route antwortet dann mit 400.
 */

// Statischer System-Prompt → Prompt-Caching-Breakpoint (Präfix bleibt
// byte-identisch; nur die User-Message variiert pro Aufruf).
const SYSTEM_PROMPT = `Du bist ein erfahrener Persisch-Lehrer (Farsi) für deutschsprachige Lernende.
Ein:e Lernende:r hat im Hördiktat einen Fehler gemacht. Erkläre kurz und
konkret, WARUM die Eingabe falsch ist und woran man sich die richtige
Schreibung merkt. Wichtig:
- Antworte auf Deutsch, maximal 4 Sätze, kein Vorwort, keine Wiederholung der Aufgabe.
- Benenne die Fehlerart präzise: homophone Buchstaben (س/ص/ث، ت/ط، ز/ذ/ض/ظ،
  ه/ح، ق/غ), fehlender/überflüssiger Halbabstand (ZWNJ, نیم‌فاصله), lange vs.
  kurze Vokale, آ vs. ا, fehlende oder vertauschte Buchstaben.
- Gib eine konkrete Merkhilfe oder Regel, wenn es eine gibt (z. B. Wortherkunft,
  häufige Wortfamilie, Schreibkonvention).
- Persische Beispiele in arabisch-persischer Schrift, deutsche Umschrift in Klammern.`;

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY ist nicht gesetzt." },
      { status: 400 }
    );
  }

  // Nur für angemeldete Nutzer.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });

  let body: { ziel?: string; eingabe?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }
  const ziel = (body.ziel ?? "").slice(0, 500);
  const eingabe = (body.eingabe ?? "").slice(0, 500);
  if (!ziel) return NextResponse.json({ error: "ziel fehlt." }, { status: 400 });

  const anthropic = new Anthropic({ apiKey });
  const model = process.env.ANTHROPIC_MODEL ?? "claude-opus-4-8";

  try {
    const antwort = await anthropic.messages.create({
      model,
      max_tokens: 1024,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        {
          role: "user",
          content: `Richtig wäre: ${ziel}\nGeschrieben wurde: ${eingabe || "(leer)"}\n\nErkläre den Fehler.`,
        },
      ],
    });

    const text = antwort.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    return NextResponse.json({ erklaerung: text });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unbekannter Fehler.";
    return NextResponse.json({ error: `Claude API: ${msg}` }, { status: 502 });
  }
}
