import NavBar from "@/components/NavBar";
import Link from "next/link";
import Image from "next/image";
import { BookOpenText, Headphones } from "lucide-react";
import texteData from "../../../data/texte.json";
import type { LeseText } from "@/components/LeseReader";

export const dynamic = "force-dynamic";

const TEXTE = texteData.texte as LeseText[];

export default function LesenPage() {
  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <BookOpenText size={22} className="text-taeguk-blue" /> Lesen
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Einfache persische Texte mit Vorlese-Funktion und Übersetzung Satz für Satz.
        </p>

        <Link
          href="/lesen/hoeren"
          className="mt-4 flex items-center gap-3 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 px-4 py-3 text-white shadow-sm ring-1 ring-slate-700 transition hover:brightness-110"
        >
          <Headphones size={20} className="shrink-0 text-taeguk-blue" />
          <span className="flex-1">
            <span className="block text-sm font-semibold">Hörmodus</span>
            <span className="block text-xs text-slate-300">
              Alle Texte am Stück anhören – fürs Unterwegs-Lernen, auch bei gesperrtem Bildschirm.
            </span>
          </span>
          <span aria-hidden className="text-slate-400">
            →
          </span>
        </Link>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {TEXTE.map((t) => (
            <Link
              key={t.id}
              href={`/lesen/${t.id}`}
              className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:shadow-md hover:ring-taeguk-blue/40 dark:bg-slate-800 dark:ring-slate-700"
            >
              {t.bild && (
                <div className="aspect-[898/413] overflow-hidden bg-slate-100 dark:bg-slate-900">
                  <Image
                    src={t.bild}
                    alt={t.titel_de}
                    width={898}
                    height={413}
                    className="h-full w-full object-cover transition group-hover:scale-[1.03]"
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-baseline justify-between gap-2">
                  <span lang="fa" dir="rtl" className="text-xl font-bold">
                    {t.titel}
                  </span>
                  {t.niveau && (
                    <span className="rounded-full bg-taeguk-blue/10 px-2 py-0.5 text-xs font-medium text-taeguk-blue">
                      {t.niveau}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{t.titel_de}</p>
                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                  {t.saetze.length} Sätze
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
