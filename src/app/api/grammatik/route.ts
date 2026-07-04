import { NextResponse, type NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";

/**
 * Erzeugt einen Grammatik-Entwurf (Markdown, Deutsch) für eine Lektion mit der
 * Claude API. Der Entwurf basiert auf den Vokabeln der Lektion und ist
 * eigenständig formuliert (kein Kopieren von Lehrbuchtexten). Er wird im
 * Editor angezeigt und muss von dir geprüft/freigegeben werden.
 *
 * Voraussetzung: ANTHROPIC_API_KEY in .env.local.
 */

const SYSTEM_PROMPT = `Du bist ein erfahrener Persisch-Lehrer (Farsi) und schreibst auf Deutsch.
Erstelle eine prägnante, eigenständig formulierte Grammatik-Erklärung für eine Lektion
für deutschsprachige Anfänger:innen. Wichtig:
- Schreibe ausschließlich auf Deutsch (persische Beispiele in arabisch-persischer Schrift
  mit lateinischer Umschrift).
- Formuliere alles selbst; kopiere keine Lehrbuchtexte.
- Leite die behandelten Grammatikpunkte aus den genannten Vokabeln ab (z. B. Ezafe,
  Personalendungen, Verbstämme, Präpositionen, die Verschriftung mit/ohne ZWNJ).
- Gib 2–4 klar strukturierte Grammatikpunkte, jeweils mit kurzer Erklärung und 1–2
  Beispielsätzen (Persisch – Umschrift – deutsche Übersetzung).
- Antworte in sauberem Markdown (Überschriften, Listen, ggf. Tabelle). Keine Vorrede,
  kein abschließender Kommentar – nur der Lerninhalt.`;

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY ist nicht gesetzt. Trage ihn in .env.local ein." },
      { status: 400 }
    );
  }

  // Authentifizierung prüfen (RLS schützt die Daten zusätzlich).
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });

  let body: { lektionNummer?: number; lektionTitel?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }
  const { lektionNummer, lektionTitel } = body;
  if (lektionNummer == null) {
    return NextResponse.json({ error: "lektionNummer fehlt." }, { status: 400 });
  }

  // Vokabeln der Lektion laden (zur inhaltlichen Verankerung).
  const { data: vokabeln } = await supabase
    .from("vocab_items")
    .select("hangul, deutsch, romanisierung")
    .eq("lektion_nummer", lektionNummer)
    .limit(60);

  if (!vokabeln || vokabeln.length === 0) {
    return NextResponse.json(
      { error: "Keine Vokabeln in dieser Lektion gefunden." },
      { status: 400 }
    );
  }

  const vokabelListe = vokabeln
    .map((v) => `- ${v.hangul}${v.romanisierung ? ` (${v.romanisierung})` : ""} = ${v.deutsch}`)
    .join("\n");

  const anthropic = new Anthropic({ apiKey });
  const model = process.env.ANTHROPIC_MODEL ?? "claude-opus-4-8";

  try {
    const antwort = await anthropic.messages.create({
      model,
      max_tokens: 1500,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          // Prompt-Caching: der lange, gleichbleibende System-Prompt wird
          // zwischengespeichert und spart Kosten bei wiederholten Aufrufen.
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        {
          role: "user",
          content: `Lektion: ${lektionTitel ?? `Lektion ${lektionNummer}`}\n\nVokabeln dieser Lektion:\n${vokabelListe}\n\nErstelle die Grammatik-Erklärung als Markdown.`,
        },
      ],
    });

    const markdown = antwort.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    return NextResponse.json({ markdown });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unbekannter Fehler.";
    return NextResponse.json({ error: `Claude API: ${msg}` }, { status: 502 });
  }
}
