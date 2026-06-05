"use client";

import { useMemo, useState } from "react";
import Papa from "papaparse";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type ZielFeld = "hangul" | "romanisierung" | "deutsch" | "lektion";

const ZIELFELDER: { key: ZielFeld; label: string; pflicht: boolean }[] = [
  { key: "hangul", label: "Persisch (Farsi)", pflicht: true },
  { key: "deutsch", label: "Deutsch", pflicht: true },
  { key: "romanisierung", label: "Romanisierung", pflicht: false },
  { key: "lektion", label: "Lektion (Nummer)", pflicht: false },
];

const NICHT_ZUORDNEN = "__none__";

/** Versucht eine Spalte automatisch zu erraten. */
function rateSpalte(felder: string[], ziel: ZielFeld): string {
  const lc = felder.map((f) => f.toLowerCase());
  const treffer = (begriffe: string[]) =>
    felder[lc.findIndex((f) => begriffe.some((b) => f.includes(b)))];
  switch (ziel) {
    case "hangul":
      return treffer(["persisch", "farsi", "persian", "hangul"]) ?? felder[0] ?? NICHT_ZUORDNEN;
    case "deutsch":
      return treffer(["deutsch", "german", "bedeutung", "übersetzung", "meaning"]) ?? felder[1] ?? NICHT_ZUORDNEN;
    case "romanisierung":
      return treffer(["roman", "lautschrift", "pronunciation", "reading"]) ?? NICHT_ZUORDNEN;
    case "lektion":
      return treffer(["lektion", "lesson", "kapitel", "unit"]) ?? NICHT_ZUORDNEN;
  }
}

function parseLektion(wert: string | undefined): number | null {
  if (!wert) return null;
  const m = wert.match(/\d+/);
  return m ? parseInt(m[0], 10) : null;
}

export default function CsvImporter() {
  const router = useRouter();
  const [spalten, setSpalten] = useState<string[]>([]);
  const [zeilen, setZeilen] = useState<Record<string, string>[]>([]);
  const [mapping, setMapping] = useState<Record<ZielFeld, string>>({
    hangul: NICHT_ZUORDNEN,
    deutsch: NICHT_ZUORDNEN,
    romanisierung: NICHT_ZUORDNEN,
    lektion: NICHT_ZUORDNEN,
  });
  const [dateiName, setDateiName] = useState("");
  const [status, setStatus] = useState<"idle" | "importiere" | "fertig" | "fehler">(
    "idle"
  );
  const [meldung, setMeldung] = useState<string | null>(null);
  const [anzahlImportiert, setAnzahlImportiert] = useState(0);

  function dateiGewaehlt(e: React.ChangeEvent<HTMLInputElement>) {
    const datei = e.target.files?.[0];
    if (!datei) return;
    setDateiName(datei.name);
    setStatus("idle");
    setMeldung(null);

    Papa.parse<Record<string, string>>(datei, {
      header: true,
      skipEmptyLines: true,
      complete: (ergebnis) => {
        const felder = ergebnis.meta.fields ?? [];
        setSpalten(felder);
        setZeilen(ergebnis.data);
        setMapping({
          hangul: rateSpalte(felder, "hangul"),
          deutsch: rateSpalte(felder, "deutsch"),
          romanisierung: rateSpalte(felder, "romanisierung"),
          lektion: rateSpalte(felder, "lektion"),
        });
      },
      error: (err) => {
        setMeldung(`Fehler beim Lesen: ${err.message}`);
        setStatus("fehler");
      },
    });
  }

  const vorschau = useMemo(() => {
    return zeilen.slice(0, 5).map((zeile) => ({
      hangul: mapping.hangul !== NICHT_ZUORDNEN ? zeile[mapping.hangul] : "",
      deutsch: mapping.deutsch !== NICHT_ZUORDNEN ? zeile[mapping.deutsch] : "",
      romanisierung:
        mapping.romanisierung !== NICHT_ZUORDNEN ? zeile[mapping.romanisierung] : "",
      lektion: mapping.lektion !== NICHT_ZUORDNEN ? zeile[mapping.lektion] : "",
    }));
  }, [zeilen, mapping]);

  const bereit =
    zeilen.length > 0 &&
    mapping.hangul !== NICHT_ZUORDNEN &&
    mapping.deutsch !== NICHT_ZUORDNEN;

  async function importieren() {
    setStatus("importiere");
    setMeldung(null);
    const supabase = createClient();

    const datensaetze = zeilen
      .map((zeile) => ({
        hangul: (zeile[mapping.hangul] ?? "").trim(),
        deutsch: (zeile[mapping.deutsch] ?? "").trim(),
        romanisierung:
          mapping.romanisierung !== NICHT_ZUORDNEN
            ? (zeile[mapping.romanisierung] ?? "").trim() || null
            : null,
        lektion_nummer:
          mapping.lektion !== NICHT_ZUORDNEN
            ? parseLektion(zeile[mapping.lektion])
            : null,
      }))
      .filter((d) => d.hangul && d.deutsch);

    if (datensaetze.length === 0) {
      setMeldung("Keine gültigen Zeilen gefunden (Persisch und Deutsch sind Pflicht).");
      setStatus("fehler");
      return;
    }

    // In Blöcken einfügen, um große Listen zu verarbeiten.
    const BLOCK = 500;
    let eingefuegt = 0;
    for (let i = 0; i < datensaetze.length; i += BLOCK) {
      const block = datensaetze.slice(i, i + BLOCK);
      const { error } = await supabase.from("vocab_items").insert(block);
      if (error) {
        setMeldung(`Fehler beim Import: ${error.message}`);
        setStatus("fehler");
        return;
      }
      eingefuegt += block.length;
      setAnzahlImportiert(eingefuegt);
    }

    setStatus("fertig");
    setMeldung(`${eingefuegt} Vokabeln erfolgreich importiert.`);
    router.refresh();
  }

  return (
    <div className="mt-6 space-y-6">
      <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          CSV-Datei auswählen
        </label>
        <input
          type="file"
          accept=".csv,text/csv"
          onChange={dateiGewaehlt}
          className="mt-2 block w-full text-sm text-slate-600 dark:text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-slate-700"
        />
        {dateiName && (
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {dateiName} – {zeilen.length} Zeilen erkannt.
          </p>
        )}
      </div>

      {spalten.length > 0 && (
        <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700">
          <h2 className="text-lg font-semibold">Spalten zuordnen</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {ZIELFELDER.map((feld) => (
              <div key={feld.key}>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  {feld.label}
                  {feld.pflicht && <span className="text-red-500"> *</span>}
                </label>
                <select
                  value={mapping[feld.key]}
                  onChange={(e) =>
                    setMapping((m) => ({ ...m, [feld.key]: e.target.value }))
                  }
                  className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm outline-none focus:border-slate-900"
                >
                  <option value={NICHT_ZUORDNEN}>– nicht zuordnen –</option>
                  {spalten.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <h3 className="mt-6 text-sm font-semibold text-slate-700 dark:text-slate-200">
            Vorschau (erste 5 Zeilen)
          </h3>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-slate-400 dark:text-slate-500">
                <tr>
                  <th className="py-2 pr-4">Persisch</th>
                  <th className="py-2 pr-4">Deutsch</th>
                  <th className="py-2 pr-4">Romanis.</th>
                  <th className="py-2">Lektion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {vorschau.map((z, i) => (
                  <tr key={i}>
                    <td className="py-2 pr-4 text-base">{z.hangul}</td>
                    <td className="py-2 pr-4">{z.deutsch}</td>
                    <td className="py-2 pr-4 text-slate-500 dark:text-slate-400">{z.romanisierung}</td>
                    <td className="py-2 text-slate-500 dark:text-slate-400">{z.lektion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {meldung && (
            <p
              className={`mt-4 text-sm ${
                status === "fehler" ? "text-red-600" : "text-emerald-700"
              }`}
            >
              {meldung}
            </p>
          )}

          <button
            onClick={importieren}
            disabled={!bereit || status === "importiere"}
            className="mt-4 rounded-lg bg-gradient-to-br from-taeguk-blue to-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:brightness-110 active:scale-95 disabled:opacity-50"
          >
            {status === "importiere"
              ? `Importiere … (${anzahlImportiert})`
              : `${zeilen.length} Vokabeln importieren`}
          </button>
        </div>
      )}
    </div>
  );
}
