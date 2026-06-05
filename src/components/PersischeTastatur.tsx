/**
 * Referenz-Abbildung der persischen Standard-Tastatur (ISIRI 2901, entspricht
 * dem macOS-Layout „Persisch"). Reine Tipphilfe für die Desktop-Eingabe: zeigt,
 * welche physische Taste welches persische Zeichen erzeugt.
 *
 * Voraussetzung: Im System eine persische Eingabequelle aktivieren
 * (macOS: Systemeinstellungen → Tastatur → Eingabequellen → „Persisch").
 */

type Taste = { fa: string; en: string };

const ZAHLEN: Taste[] = [
  { fa: "۱", en: "1" },
  { fa: "۲", en: "2" },
  { fa: "۳", en: "3" },
  { fa: "۴", en: "4" },
  { fa: "۵", en: "5" },
  { fa: "۶", en: "6" },
  { fa: "۷", en: "7" },
  { fa: "۸", en: "8" },
  { fa: "۹", en: "9" },
  { fa: "۰", en: "0" },
];

const REIHE_1: Taste[] = [
  { fa: "ض", en: "Q" },
  { fa: "ص", en: "W" },
  { fa: "ث", en: "E" },
  { fa: "ق", en: "R" },
  { fa: "ف", en: "T" },
  { fa: "غ", en: "Y" },
  { fa: "ع", en: "U" },
  { fa: "ه", en: "I" },
  { fa: "خ", en: "O" },
  { fa: "ح", en: "P" },
  { fa: "ج", en: "[" },
  { fa: "چ", en: "]" },
];

const REIHE_2: Taste[] = [
  { fa: "ش", en: "A" },
  { fa: "س", en: "S" },
  { fa: "ی", en: "D" },
  { fa: "ب", en: "F" },
  { fa: "ل", en: "G" },
  { fa: "ا", en: "H" },
  { fa: "ت", en: "J" },
  { fa: "ن", en: "K" },
  { fa: "م", en: "L" },
  { fa: "ک", en: ";" },
  { fa: "گ", en: "'" },
];

const REIHE_3: Taste[] = [
  { fa: "ظ", en: "Z" },
  { fa: "ط", en: "X" },
  { fa: "ز", en: "C" },
  { fa: "ر", en: "V" },
  { fa: "ذ", en: "B" },
  { fa: "د", en: "N" },
  { fa: "پ", en: "M" },
  { fa: "و", en: "," },
  { fa: ".", en: "." },
  { fa: "/", en: "/" },
];

function Reihe({ tasten, einzug = 0 }: { tasten: Taste[]; einzug?: number }) {
  return (
    <div
      className="flex justify-center gap-1"
      style={einzug ? { paddingInlineStart: einzug } : undefined}
    >
      {tasten.map((t) => (
        <div
          key={t.en}
          className="flex h-10 w-9 flex-col items-center justify-center rounded-md bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-600 sm:h-11 sm:w-10"
          title={`Taste ${t.en}`}
        >
          <span className="text-base leading-none sm:text-lg">{t.fa}</span>
          <span className="mt-0.5 text-[9px] leading-none text-slate-400 dark:text-slate-500">
            {t.en}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function PersischeTastatur() {
  return (
    <details open className="mt-6 rounded-xl bg-slate-50 dark:bg-slate-900 p-3 ring-1 ring-slate-200 dark:ring-slate-700">
      <summary className="cursor-pointer select-none text-sm font-medium text-slate-600 dark:text-slate-300">
        ⌨️ Persische Tastatur (Referenz)
      </summary>
      <div className="mt-3 space-y-1" dir="ltr">
        <Reihe tasten={ZAHLEN} />
        <Reihe tasten={REIHE_1} />
        <Reihe tasten={REIHE_2} einzug={10} />
        <Reihe tasten={REIHE_3} einzug={20} />
      </div>
      <p className="mt-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        Standard-Layout (ISIRI 2901 = macOS „Persisch"). Die kleine Beschriftung
        zeigt die physische Taste. <strong>Halbabstand</strong> (ZWNJ, z. B. in{" "}
        <span lang="fa">نمی‌روم</span>): <kbd>Umschalt</kbd>+<kbd>Leertaste</kbd>.
        Mit <kbd>Umschalt</kbd> erreichst du Varianten (آ، ء، ژ، «»…). Aktiviere
        die Eingabequelle „Persisch" in den Systemeinstellungen.
      </p>
    </details>
  );
}
