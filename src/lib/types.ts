/**
 * Datenbank-Typen passend zur Migration supabase/migrations/0001_init.sql.
 * Diese können später per `supabase gen types typescript` automatisch
 * generiert werden – hier von Hand gepflegt, damit der Client typsicher ist.
 */

// Bewusst `type` (Objekt-Literal) statt `interface`: nur Objekt-Literal-Typen
// sind zu `Record<string, unknown>` zuweisbar, was @supabase/supabase-js für
// die Schema-Typprüfung (GenericTable) voraussetzt.
export type VocabItem = {
  id: string;
  user_id: string;
  hangul: string;
  romanisierung: string | null;
  deutsch: string;
  lektion_nummer: number | null;
  beispielsatz_ko: string | null;
  beispielsatz_de: string | null;
  /** Kurzer Lern-/Gebrauchshinweis (Deutsch), z. B. Präsensstamm, Register. */
  hinweis: string | null;
  /** 1 = selten … 5 = Kernwortschatz (null = noch nicht eingestuft). */
  haeufigkeit: number | null;
  erstellt_am: string;
};

export type DictationAttempt = {
  id: string;
  user_id: string;
  vocab_item_id: string;
  eingabe: string;
  korrekt: boolean;
  zeichen_genauigkeit: number;
  /** Tippdauer in Millisekunden (Messwert für die Auto-Bewertung). */
  antwortzeit_ms: number | null;
  /** Erwarteter Zieltext dieses Versuchs. */
  ziel: string | null;
  /** Klassifizierte Fehlerarten (persische Taxonomie), JSON. */
  fehler: import("@/lib/fehleranalyse").Fehler[] | null;
  erstellt_am: string;
};

export type ReviewState = {
  user_id: string;
  vocab_item_id: string;
  ease_factor: number;
  intervall: number;
  wiederholungen: number;
  naechste_faelligkeit: string;
  aktualisiert_am: string;
};

export type Lesson = {
  id: string;
  user_id: string;
  buch: number | null;
  lektion_nummer: number;
  titel: string | null;
  beschreibung: string | null;
  reihenfolge: number | null;
  erstellt_am: string;
};

export type RessourcenTyp = "grammatik" | "video" | "audio";

export type LessonResource = {
  id: string;
  user_id: string;
  lesson_id: string;
  typ: RessourcenTyp;
  titel: string | null;
  inhalt: string | null;
  url: string | null;
  storage_pfad: string | null;
  reihenfolge: number;
  aktualisiert_am: string;
};

export type LessonProgress = {
  user_id: string;
  lesson_id: string;
  status: "offen" | "in_arbeit" | "fertig";
  aktualisiert_am: string;
};

type InsertOf<T, Optional extends keyof T> = Omit<T, Optional> &
  Partial<Pick<T, Optional>>;

export interface Database {
  // Markiert die PostgREST-Version (Supabase v12). Optional, aber sorgt für
  // korrekte Typ-Inferenz in @supabase/supabase-js ≥ 2.107.
  __InternalSupabase: { PostgrestVersion: "12" };
  public: {
    Tables: {
      vocab_items: {
        Row: VocabItem;
        Insert: InsertOf<
          VocabItem,
          | "id"
          | "user_id"
          | "romanisierung"
          | "lektion_nummer"
          | "beispielsatz_ko"
          | "beispielsatz_de"
          | "hinweis"
          | "haeufigkeit"
          | "erstellt_am"
        >;
        Update: Partial<VocabItem>;
        Relationships: [];
      };
      dictation_attempts: {
        Row: DictationAttempt;
        Insert: InsertOf<
          DictationAttempt,
          "id" | "user_id" | "erstellt_am" | "antwortzeit_ms" | "ziel" | "fehler"
        >;
        Update: Partial<DictationAttempt>;
        Relationships: [];
      };
      review_state: {
        Row: ReviewState;
        Insert: InsertOf<
          ReviewState,
          | "user_id"
          | "ease_factor"
          | "intervall"
          | "wiederholungen"
          | "naechste_faelligkeit"
          | "aktualisiert_am"
        >;
        Update: Partial<ReviewState>;
        Relationships: [];
      };
      lessons: {
        Row: Lesson;
        Insert: InsertOf<
          Lesson,
          "id" | "user_id" | "buch" | "titel" | "beschreibung" | "reihenfolge" | "erstellt_am"
        >;
        Update: Partial<Lesson>;
        Relationships: [];
      };
      lesson_resources: {
        Row: LessonResource;
        Insert: InsertOf<
          LessonResource,
          | "id"
          | "user_id"
          | "titel"
          | "inhalt"
          | "url"
          | "storage_pfad"
          | "reihenfolge"
          | "aktualisiert_am"
        >;
        Update: Partial<LessonResource>;
        Relationships: [];
      };
      lesson_progress: {
        Row: LessonProgress;
        Insert: InsertOf<LessonProgress, "user_id" | "status" | "aktualisiert_am">;
        Update: Partial<LessonProgress>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

/** Bewertung im Diktat-Modus – steuert die SM-2-Logik. */
export type Schwierigkeit = "schwer" | "mittel" | "leicht";
