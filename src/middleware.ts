import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Alle Pfade außer statischen Assets, Bildern und den öffentlichen
     * TTS-Audiodateien (/tts/*.mp3 – kein Login nötig).
     */
    "/((?!_next/static|_next/image|favicon.ico|tts|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp3|m4a|ogg|wav)$).*)",
  ],
};
