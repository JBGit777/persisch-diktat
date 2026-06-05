import type { createClient } from "@/lib/supabase/server";
import { alleZeilen } from "@/lib/paginate";
import type {
  Lesson,
  LessonResource,
  LessonProgress,
  RessourcenTyp,
  VocabItem,
} from "@/lib/types";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

export interface LektionUebersicht extends Lesson {
  vokabelAnzahl: number;
  status: LessonProgress["status"];
  hatGrammatik: boolean;
  hatVideo: boolean;
  hatAudio: boolean;
}

/** Lädt alle Lektionen mit Vokabelanzahl, Fortschritt und Ressourcen-Flags. */
export async function ladeLektionen(
  supabase: SupabaseClient
): Promise<LektionUebersicht[]> {
  const [{ data: lessons }, vocab, { data: progress }, { data: resources }] =
    await Promise.all([
      supabase.from("lessons").select("*").order("reihenfolge", { ascending: true }),
      // Paginiert, da > 1000 Vokabeln (sonst fehlen hohe Lektionen).
      alleZeilen<{ lektion_nummer: number | null }>((von, bis) =>
        supabase
          .from("vocab_items")
          .select("lektion_nummer")
          .order("id", { ascending: true })
          .range(von, bis)
      ),
      supabase.from("lesson_progress").select("lesson_id, status"),
      supabase.from("lesson_resources").select("lesson_id, typ"),
    ]);

  const vokabelProLektion = new Map<number, number>();
  for (const v of vocab ?? []) {
    if (v.lektion_nummer == null) continue;
    vokabelProLektion.set(v.lektion_nummer, (vokabelProLektion.get(v.lektion_nummer) ?? 0) + 1);
  }

  const statusMap = new Map<string, LessonProgress["status"]>();
  for (const p of progress ?? []) statusMap.set(p.lesson_id, p.status);

  const typenProLektion = new Map<string, Set<RessourcenTyp>>();
  for (const r of resources ?? []) {
    if (!typenProLektion.has(r.lesson_id)) typenProLektion.set(r.lesson_id, new Set());
    typenProLektion.get(r.lesson_id)!.add(r.typ);
  }

  return (lessons ?? []).map((l) => {
    const typen = typenProLektion.get(l.id) ?? new Set<RessourcenTyp>();
    return {
      ...l,
      vokabelAnzahl: vokabelProLektion.get(l.lektion_nummer) ?? 0,
      status: statusMap.get(l.id) ?? "offen",
      hatGrammatik: typen.has("grammatik"),
      hatVideo: typen.has("video"),
      hatAudio: typen.has("audio"),
    };
  });
}

export interface AudioRessource extends LessonResource {
  /** Temporär signierte URL zum Abspielen (privater Bucket). */
  signierteUrl: string | null;
}

export interface LektionDetail {
  lesson: Lesson;
  status: LessonProgress["status"];
  grammatik: LessonResource[];
  videos: LessonResource[];
  audios: AudioRessource[];
  vokabeln: VocabItem[];
}

/** Lädt eine einzelne Lektion samt Ressourcen, Vokabeln und Audio-Links. */
export async function ladeLektion(
  supabase: SupabaseClient,
  lessonId: string
): Promise<LektionDetail | null> {
  const { data: lesson } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", lessonId)
    .single();
  if (!lesson) return null;

  const [{ data: resources }, { data: progress }, { data: vokabeln }] = await Promise.all([
    supabase
      .from("lesson_resources")
      .select("*")
      .eq("lesson_id", lessonId)
      .order("reihenfolge", { ascending: true }),
    supabase.from("lesson_progress").select("status").eq("lesson_id", lessonId).maybeSingle(),
    supabase
      .from("vocab_items")
      .select("*")
      .eq("lektion_nummer", lesson.lektion_nummer)
      .order("erstellt_am", { ascending: true }),
  ]);

  const alle = resources ?? [];
  const grammatik = alle.filter((r) => r.typ === "grammatik");
  const videos = alle.filter((r) => r.typ === "video");

  // Audio: signierte URLs aus dem privaten Bucket erzeugen (1 Stunde gültig).
  const audioRoh = alle.filter((r) => r.typ === "audio");
  const audios: AudioRessource[] = await Promise.all(
    audioRoh.map(async (r) => {
      let signierteUrl: string | null = null;
      if (r.storage_pfad) {
        const { data } = await supabase.storage
          .from("lektion-audio")
          .createSignedUrl(r.storage_pfad, 3600);
        signierteUrl = data?.signedUrl ?? null;
      }
      return { ...r, signierteUrl };
    })
  );

  return {
    lesson,
    status: progress?.status ?? "offen",
    grammatik,
    videos,
    audios,
    vokabeln: vokabeln ?? [],
  };
}

/** Wandelt eine YouTube-URL in eine einbettbare Embed-URL um. */
export function youtubeEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    let id = "";
    if (u.hostname.includes("youtu.be")) id = u.pathname.slice(1);
    else if (u.searchParams.get("v")) id = u.searchParams.get("v")!;
    else if (u.pathname.includes("/embed/")) id = u.pathname.split("/embed/")[1];
    else if (u.pathname.includes("/shorts/")) id = u.pathname.split("/shorts/")[1];
    id = id.split(/[/?&]/)[0];
    return id ? `https://www.youtube.com/embed/${id}` : null;
  } catch {
    return null;
  }
}
