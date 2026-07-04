import { NextResponse, type NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { normalizeFa } from "@/lib/normalizeFa";

/**
 * Generiert Lückentext-Aufgaben (Multiple Choice) mit hartem
 * Vokabular-Constraint: Die Sätze verwenden AUSSCHLIESSLICH Wörter aus dem
 * Wortschatz der App (i+1-Prinzip). Zielwörter sind bevorzugt die persönlich
 * schwächsten (niedriger SRS-Ease); aufgefüllt wird mit häufigen Wörtern.
 *
 * Antwortformat ist per Structured Outputs (output_config.format) erzwungen –
 * die Route liefert validiertes JSON, der Client muss nichts parsen-raten.
 * Serverseitig wird zusätzlich geprüft: Lösung ∈ Wortschatz (normalizeFa),
 * Lücke im Satz vorhanden, Lösung unter den Optionen.
 */

export const maxDuration = 60; // Vercel: Opus + Thinking braucht ggf. > 10 s

const SYSTEM_PROMPT = `Du bist ein Persisch-Didaktiker und erstellst Lückentext-Aufgaben für
deutschsprachige Lernende (Niveau: Wiedereinstieg).

HARTE REGELN:
1. Jeder Satz verwendet AUSSCHLIESSLICH Wörter aus der bereitgestellten
   Wortschatzliste (einfache Flexionen wie Personalendungen, می‌-Präsens,
   Plural ـها, Ezafe-Verbindungen und را sind erlaubt).
2. Kurze, natürliche Alltagssätze (4–9 Wörter), korrekte persische
   Orthografie inkl. Halbabstand (ZWNJ) wo nötig (z. B. می‌روم، نمی‌دانم).
3. Genau EINE Lücke pro Satz, als ___ markiert. Die Lücke ersetzt exakt das
   Zielwort in unflektierter oder minimal flektierter Form.
4. Genau 4 Optionen pro Aufgabe: die Lösung plus 3 plausible Distraktoren aus
   der Wortschatzliste (gleiche Wortart bevorzugt, z. B. Verwechslungsgefahr
   bei ähnlicher Bedeutung oder Schreibung).
5. Die deutsche Übersetzung gibt den vollständigen Satz (mit eingesetzter
   Lösung) wieder.
6. Jedes vorgegebene Zielwort bekommt genau eine Aufgabe.`;

const AUFGABEN_SCHEMA = {
  type: "object" as const,
  properties: {
    aufgaben: {
      type: "array" as const,
      items: {
        type: "object" as const,
        properties: {
          satz: {
            type: "string" as const,
            description: "Persischer Satz mit genau einer Lücke ___",
          },
          loesung: {
            type: "string" as const,
            description: "Das Wort, das in die Lücke gehört (aus der Wortschatzliste)",
          },
          optionen: {
            type: "array" as const,
            items: { type: "string" as const },
            description: "Genau 4 persische Optionen, die Lösung ist enthalten",
          },
          uebersetzung: {
            type: "string" as const,
            description: "Deutsche Übersetzung des vollständigen Satzes",
          },
        },
        required: ["satz", "loesung", "optionen", "uebersetzung"],
        additionalProperties: false,
      },
    },
  },
  required: ["aufgaben"],
  additionalProperties: false,
};

export interface LueckenAufgabe {
  satz: string;
  loesung: string;
  optionen: string[];
  uebersetzung: string;
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY ist nicht gesetzt." },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });

  let anzahl = 8;
  try {
    const body = await request.json();
    if (typeof body.anzahl === "number") anzahl = Math.min(12, Math.max(3, body.anzahl));
  } catch {
    /* Default bleibt */
  }

  // Wortschatz + eigener SRS-Zustand (RLS: Inhalte shared, review_state privat).
  const [{ data: woerter }, { data: reviews }] = await Promise.all([
    supabase
      .from("vocab_items")
      .select("id, hangul, deutsch, haeufigkeit")
      .order("hangul", { ascending: true })
      .limit(2000),
    supabase
      .from("review_state")
      .select("vocab_item_id, ease_factor")
      .order("ease_factor", { ascending: true })
      .limit(200),
  ]);
  if (!woerter || woerter.length < 30) {
    return NextResponse.json(
      { error: "Zu wenig Wortschatz für sinnvolle Aufgaben." },
      { status: 400 }
    );
  }

  // Erlaubter Satz-Wortschatz: häufige Wörter (Tier ≥ 4) + alle bereits geübten.
  // Deterministisch sortiert, damit der Cache-Breakpoint stabil bleibt.
  const geuebt = new Set((reviews ?? []).map((r) => r.vocab_item_id));
  const erlaubt = woerter
    .filter((w) => (w.haeufigkeit ?? 3) >= 4 || geuebt.has(w.id))
    .map((w) => w.hangul)
    .sort((a, b) => a.localeCompare(b, "fa"));

  // Zielwörter: schwächste zuerst (niedriger Ease), mit häufigen auffüllen.
  const nachId = new Map(woerter.map((w) => [w.id, w]));
  const schwach = (reviews ?? [])
    .map((r) => nachId.get(r.vocab_item_id))
    .filter((w): w is NonNullable<typeof w> => !!w && !w.hangul.includes(" "));
  const haeufig = woerter.filter(
    (w) => (w.haeufigkeit ?? 3) >= 4 && !w.hangul.includes(" ")
  );
  const ziele: { hangul: string; deutsch: string }[] = [];
  const gesehen = new Set<string>();
  for (const w of [...schwach, ...haeufig]) {
    if (ziele.length >= anzahl) break;
    if (gesehen.has(w.hangul)) continue;
    gesehen.add(w.hangul);
    ziele.push({ hangul: w.hangul, deutsch: w.deutsch });
  }

  const anthropic = new Anthropic({ apiKey });
  const model = process.env.ANTHROPIC_MODEL ?? "claude-opus-4-8";

  try {
    const antwort = await anthropic.messages.create({
      model,
      max_tokens: 16000,
      thinking: { type: "adaptive" },
      system: SYSTEM_PROMPT,
      output_config: {
        format: { type: "json_schema", schema: AUFGABEN_SCHEMA },
      },
      messages: [
        {
          role: "user",
          content: [
            {
              // Stabiler Präfix-Block (System + Wortliste) → Cache-Breakpoint.
              // Ändert sich nur, wenn neue Wörter geübt/importiert werden.
              type: "text",
              text: `WORTSCHATZLISTE (nur diese Wörter verwenden):\n${erlaubt.join("، ")}`,
              cache_control: { type: "ephemeral" },
            },
            {
              type: "text",
              text: `Erstelle je eine Lückentext-Aufgabe für diese ${ziele.length} Zielwörter:\n${ziele
                .map((z) => `- ${z.hangul} (${z.deutsch})`)
                .join("\n")}`,
            },
          ],
        },
      ],
    });

    const text = antwort.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();
    const roh = JSON.parse(text) as { aufgaben: LueckenAufgabe[] };

    // Serverseitige Validierung des Vokabular-Constraints.
    const wortSet = new Set(erlaubt.map((w) => normalizeFa(w)));
    const aufgaben = (roh.aufgaben ?? []).filter((a) => {
      if (!a.satz?.includes("___")) return false;
      if (!a.loesung || !wortSet.has(normalizeFa(a.loesung))) return false;
      if (!Array.isArray(a.optionen) || a.optionen.length < 2) return false;
      if (!a.optionen.some((o) => normalizeFa(o) === normalizeFa(a.loesung))) return false;
      return true;
    });

    if (aufgaben.length === 0) {
      return NextResponse.json(
        { error: "Keine gültigen Aufgaben generiert – bitte erneut versuchen." },
        { status: 502 }
      );
    }
    return NextResponse.json({ aufgaben });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unbekannter Fehler.";
    return NextResponse.json({ error: `Claude API: ${msg}` }, { status: 502 });
  }
}
