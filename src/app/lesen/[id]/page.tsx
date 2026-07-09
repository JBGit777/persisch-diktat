import NavBar from "@/components/NavBar";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import LeseReader, { type LeseText } from "@/components/LeseReader";
import texteData from "../../../../data/texte.json";

export const dynamic = "force-dynamic";

const TEXTE = texteData.texte as LeseText[];

export default async function LeseTextPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const text = TEXTE.find((t) => t.id === id);
  if (!text) notFound();

  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <Link
          href="/lesen"
          className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 transition hover:text-taeguk-blue dark:text-slate-400"
        >
          <ChevronRight size={15} className="rotate-180" /> Alle Texte
        </Link>
        <LeseReader text={text} />
      </main>
    </>
  );
}
