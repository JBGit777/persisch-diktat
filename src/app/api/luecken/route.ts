import { NextResponse, type NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { normalizeFa } from "@/lib/normalizeFa";
import quizPool from "../../../../data/quiz.json";

/**
 * Lückentext-Aufgaben (Multiple Choice) mit hartem Vokabular-Constraint.
 *
 * Zwei Betriebsarten:
 *  - "pool" (Standard, KOSTENLOS, ohne API-Key): liefert Aufgaben aus dem
 *    vorab mit Claude/MAX erzeugten, geprüften Pool (data/quiz.json), gewichtet
 *    nach den persönlich schwächsten Wörtern (SRS).
 *  - "live" (nur wenn ANTHROPIC_API_KEY gesetzt): generiert frische Aufgaben
 *    per Claude API mit Structured Outputs; serverseitig validiert.
 */

export const maxDuration = 60;

interface LueckenAufgabe {
  satz: string;
  loesung: string;
  optionen: string[];
  uebersetzung: string;
}

const POOL = quizPool as LueckenAufgabe[];

function mische<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const SYSTEM_PROMPT = `Du bist ein Persisch-Didaktiker und erstellst Lückentext-Aufgaben für
deutschsprachige Lernende (Niveau: Wiedereinstieg).

HARTE REGELN:
1. Jeder Satz verwendet AUSSCHLIESSLICH Wörter aus der bereitgestellten
   Wortschatzliste (einfache Flexionen wie Personalendungen, می‌-Präsens,
   Plural ـها, Ezafe-Verbindungen und را sind erlaubt).
2. Kurze, natürliche Alltagssätze (4–9 Wörter), korrekte persische
   Orthografie inkl. Halbabstand (ZWNJ) wo nötig (z. B. می‌روم، نمی‌دانم).
3. Genau EINE Lücke pro Satz, als ___ markiert.
4. Genau 4 Optionen pro Aufgabe: die Lösung plus 3 plausible Distraktoren aus
   der Wortschatzliste (gleiche Wortart bevorzugt).
5. Die deutsche Übersetzung gibt den vollständigen Satz (mit Lösung) wieder.
6. Jedes vorgegebene Zielwort bekommt genau eine Aufgabe.`;

const AUFGABEN_SCHEMA = {
  type: "object" as const,
  properties: {
    aufgaben: {
      type: "array" as const,
      items: {
        type: "object" as const,
        properties: {
          satz: { type: "string" as const },
          loesung: { type: "string" as const },
          optionen: { type: "array" as const, items: { type: "string" as const } },
          uebersetzung: { type: "string" as const },
        },
        required: ["satz", "loesung", "optionen", "uebersetzung"],
        additionalProperties: false,
      },
    },
  },
  required: ["aufgaben"],
  additionalProperties: false,
};

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });

  let anzahl = 8;
  let modus: "pool" | "live" = "pool";
  try {
    const body = await request.json();
    if (typeof body.anzahl === "number") anzahl = Math.min(12, Math.max(3, body.anzahl));
    if (body.modus === "live") modus = "live";
  } catch {
    /* Defaults bleiben */
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  // ---- Pool-Modus (Standard, kostenlos) ----
  if (modus === "pool" || !apiKey) {
    // Schwache Wörter zuerst: Pool-Aufgaben, deren Lösung ein schwaches Wort
    // ist, bevorzugen; danach zufällig auffüllen.
    const { data: reviews } = await supabase
      .from("review_state")
      .select("vocab_item_id, ease_factor")
      .order("ease_factor", { ascending: true })
      .limit(80);
    let schwacheWoerter = new Set<string>();
    if (reviews && reviews.length) {
      const ids = reviews.map((r) => r.vocab_item_id);
      const { data: vok } = await supabase.from("vocab_items").select("id, hangul").in("id", ids);
      schwacheWoerter = new Set((vok ?? []).map((v) => normalizeFa(v.hangul)));
    }
    const passt = (a: LueckenAufgabe) => schwacheWoerter.has(normalizeFa(a.loesung));
    const bevorzugt = mische(POOL.filter(passt));
    const rest = mische(POOL.filter((a) => !passt(a)));
    const aufgaben = [...bevorzugt, ...rest].slice(0, anzahl);
    return NextResponse.json({ aufgaben, quelle: "pool" });
  }

  // ---- Live-Modus (API-Key vorhanden) ----
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

  const geuebt = new Set((reviews ?? []).map((r) => r.vocab_item_id));
  const erlaubt = woerter
    .filter((w) => (w.haeufigkeit ?? 3) >= 4 || geuebt.has(w.id))
    .map((w) => w.hangul)
    .sort((a, b) => a.localeCompare(b, "fa"));

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
      output_config: { format: { type: "json_schema", schema: AUFGABEN_SCHEMA } },
      messages: [
        {
          role: "user",
          content: [
            {
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

    const wortSet = new Set(erlaubt.map((w) => normalizeFa(w)));
    const aufgaben = (roh.aufgaben ?? []).filter((a) => {
      if (!a.satz?.includes("___")) return false;
      if (!a.loesung || !wortSet.has(normalizeFa(a.loesung))) return false;
      if (!Array.isArray(a.optionen) || a.optionen.length < 2) return false;
      if (!a.optionen.some((o) => normalizeFa(o) === normalizeFa(a.loesung))) return false;
      return true;
    });

    if (aufgaben.length === 0) {
      // Fallback auf den Pool, statt den Nutzer leer stehen zu lassen.
      const aus = mische(POOL).slice(0, anzahl);
      return NextResponse.json({ aufgaben: aus, quelle: "pool-fallback" });
    }
    return NextResponse.json({ aufgaben, quelle: "live" });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unbekannter Fehler.";
    return NextResponse.json({ error: `Claude API: ${msg}` }, { status: 502 });
  }
}
