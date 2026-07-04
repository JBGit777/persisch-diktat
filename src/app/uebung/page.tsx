import NavBar from "@/components/NavBar";
import LueckenQuiz from "@/components/LueckenQuiz";

export const dynamic = "force-dynamic";

export default function UebungPage() {
  const kiVerfuegbar = Boolean(process.env.ANTHROPIC_API_KEY);

  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-2xl font-bold">Quiz</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          KI-generierte Lückentexte aus deinem Wortschatz – gezielt für deine
          schwächsten Wörter.
        </p>
        <div className="mt-6">
          {kiVerfuegbar ? (
            <LueckenQuiz />
          ) : (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
              <p className="text-lg font-medium">KI-Quiz nicht konfiguriert.</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
                Hinterlege einen <code className="rounded bg-slate-100 px-1 dark:bg-slate-700">ANTHROPIC_API_KEY</code>{" "}
                in den Umgebungsvariablen (Vercel bzw. <code className="rounded bg-slate-100 px-1 dark:bg-slate-700">.env.local</code>),
                um Lückentext-Aufgaben aus deinem Wortschatz generieren zu lassen.
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
