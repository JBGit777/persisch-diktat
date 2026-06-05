import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/types";

type CookieEintraege = { name: string; value: string; options: CookieOptions }[];

/**
 * Aktualisiert die Auth-Session bei jedem Request und leitet nicht
 * eingeloggte Nutzer:innen auf /login um (außer bei öffentlichen Pfaden).
 */
export async function updateSession(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Magic-Link-Absicherung: Landet der Anmelde-Code (oder Token-Hash) auf einer
  // anderen Seite als /auth/callback – etwa weil Supabase auf die Site-URL "/"
  // umleitet – fangen wir ihn hier ab und leiten ihn zur Callback-Route weiter,
  // damit die Session korrekt erstellt wird.
  const hatAuthCode =
    request.nextUrl.searchParams.has("code") ||
    request.nextUrl.searchParams.has("token_hash");
  if (hatAuthCode && path !== "/auth/callback") {
    const callbackUrl = request.nextUrl.clone();
    callbackUrl.pathname = "/auth/callback";
    return NextResponse.redirect(callbackUrl);
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieEintraege) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const istOeffentlich =
    path === "/login" ||
    path.startsWith("/auth") ||
    path.startsWith("/_next") ||
    path === "/manifest.webmanifest" ||
    path === "/favicon.ico" ||
    path.startsWith("/icon") ||
    path.startsWith("/apple-icon");

  if (!user && !istOeffentlich) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
