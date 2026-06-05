"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import KoreaFlag from "@/components/KoreaFlag";

type Modus = "anmelden" | "registrieren" | "magic";

export default function LoginPage() {
  const router = useRouter();
  const [modus, setModus] = useState<Modus>("anmelden");
  const [email, setEmail] = useState("");
  const [passwort, setPasswort] = useState("");
  const [laeuft, setLaeuft] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);
  const [magicGesendet, setMagicGesendet] = useState(false);

  async function absenden(e: React.FormEvent) {
    e.preventDefault();
    setLaeuft(true);
    setFehler(null);
    const supabase = createClient();

    try {
      if (modus === "magic") {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });
        if (error) throw error;
        setMagicGesendet(true);
        return;
      }

      if (modus === "registrieren") {
        const { data, error } = await supabase.auth.signUp({ email, password: passwort });
        if (error) throw error;
        // Wenn E-Mail-Bestätigung in Supabase deaktiviert ist, gibt es sofort
        // eine Session. Andernfalls ist data.session null.
        if (!data.session) {
          setFehler(
            "Konto angelegt, aber es ist noch keine Anmeldung möglich. Deaktiviere in Supabase unter Authentication → Sign In / Providers → Email die Option „Confirm email“ und registriere dich erneut."
          );
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password: passwort,
        });
        if (error) throw error;
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setFehler(err instanceof Error ? err.message : "Anmeldung fehlgeschlagen.");
    } finally {
      setLaeuft(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-b from-slate-50 via-white to-blue-50/40 px-4 py-10 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="flex animate-fade-in-up flex-col items-center gap-3">
        <KoreaFlag width={88} className="rounded-md shadow-sm ring-1 ring-slate-200 dark:ring-slate-700" />
        <h1 className="text-3xl font-bold tracking-tight">
          <span lang="fa">فارسی</span>{" "}
          <span className="text-taeguk-blue">Diktat</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Persisch hören, schreiben, lernen</p>
      </div>
      <div className="w-full max-w-sm animate-fade-in-up rounded-2xl bg-white dark:bg-slate-800 p-8 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700">
        <h2 className="text-lg font-semibold">
          {modus === "registrieren"
            ? "Konto erstellen"
            : modus === "magic"
              ? "Per E-Mail-Link anmelden"
              : "Anmelden"}
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {modus === "magic"
            ? "Melde dich per E-Mail-Link an."
            : modus === "registrieren"
              ? "Erstelle ein Konto. Dein Fortschritt synchronisiert sich über alle Geräte."
              : "Melde dich an. Dein Fortschritt synchronisiert sich über alle Geräte."}
        </p>

        {modus === "magic" && magicGesendet ? (
          <div className="mt-6 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800">
            <p className="font-medium">E-Mail unterwegs! 📬</p>
            <p className="mt-1">
              Öffne den Link an <strong>{email}</strong> auf diesem Gerät.
            </p>
          </div>
        ) : (
          <form onSubmit={absenden} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                E-Mail-Adresse
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="du@beispiel.de"
                className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              />
            </div>

            {modus !== "magic" && (
              <div>
                <label htmlFor="passwort" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Passwort
                </label>
                <input
                  id="passwort"
                  type="password"
                  required
                  minLength={6}
                  value={passwort}
                  onChange={(e) => setPasswort(e.target.value)}
                  placeholder="mindestens 6 Zeichen"
                  className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                />
              </div>
            )}

            {fehler && <p className="text-sm text-red-600">{fehler}</p>}

            <button
              type="submit"
              disabled={laeuft}
              className="w-full rounded-lg bg-gradient-to-br from-taeguk-blue to-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
            >
              {laeuft
                ? "Bitte warten …"
                : modus === "magic"
                  ? "Anmelde-Link senden"
                  : modus === "registrieren"
                    ? "Konto erstellen"
                    : "Anmelden"}
            </button>
          </form>
        )}

        {/* Moduswechsel */}
        <div className="mt-6 space-y-1 border-t border-slate-100 dark:border-slate-700 pt-4 text-sm">
          {modus === "anmelden" && (
            <button
              onClick={() => { setModus("registrieren"); setFehler(null); }}
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
            >
              Noch kein Konto? <span className="font-medium">Registrieren</span>
            </button>
          )}
          {modus === "registrieren" && (
            <button
              onClick={() => { setModus("anmelden"); setFehler(null); }}
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
            >
              Schon ein Konto? <span className="font-medium">Anmelden</span>
            </button>
          )}
          <div>
            {modus === "magic" ? (
              <button
                onClick={() => { setModus("anmelden"); setFehler(null); setMagicGesendet(false); }}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              >
                Lieber mit Passwort anmelden
              </button>
            ) : (
              <button
                onClick={() => { setModus("magic"); setFehler(null); }}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              >
                Stattdessen per E-Mail-Link anmelden
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
