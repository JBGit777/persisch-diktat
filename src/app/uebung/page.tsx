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
          Lückentexte aus deinem Wortschatz – gezielt für deine schwächsten
          Wörter.
        </p>
        <div className="mt-6">
          <LueckenQuiz kiVerfuegbar={kiVerfuegbar} />
        </div>
      </main>
    </>
  );
}
