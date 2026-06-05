import NavBar from "@/components/NavBar";
import CsvImporter from "@/components/CsvImporter";

export const dynamic = "force-dynamic";

export default function ImportPage() {
  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-bold">Vokabeln importieren</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Lade einen CSV-Export aus Anki, Quizlet o. Ä. hoch und ordne die
          Spalten den Feldern zu.
        </p>
        <CsvImporter />
      </main>
    </>
  );
}
