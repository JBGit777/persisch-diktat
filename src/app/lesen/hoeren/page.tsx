import NavBar from "@/components/NavBar";
import HoerModus, { type HoerText } from "@/components/HoerModus";
import texteData from "../../../../data/texte.json";

export const dynamic = "force-dynamic";

const TEXTE = (texteData.texte as HoerText[]).map((t) => ({
  id: t.id,
  titel: t.titel,
  titel_de: t.titel_de,
  saetze: t.saetze.map((s) => ({ fa: s.fa, de: s.de })),
}));

export default function HoerenPage() {
  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <HoerModus texte={TEXTE} />
      </main>
    </>
  );
}
