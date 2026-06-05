import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/types";

type CookieEintraege = { name: string; value: string; options: CookieOptions }[];

/**
 * Supabase-Client für Server Components, Route Handler und Server Actions.
 * Nutzt die Next.js cookie-API, damit Sessions geräteübergreifend gültig bleiben.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieEintraege) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // In Server Components kann set() fehlschlagen – die Middleware
            // aktualisiert die Session dann beim nächsten Request.
          }
        },
      },
    }
  );
}
