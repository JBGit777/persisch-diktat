"use client";

import { Volume2, Turtle } from "lucide-react";
import { sprichPersisch } from "@/lib/tts";

/**
 * Lautsprecher-Button, der den persischen Text vorliest.
 * Mit `mitLangsam` wird zusätzlich ein „langsam"-Knopf (🐢, ~0,3×) gezeigt.
 */
export default function SprechButton({
  text,
  size = 16,
  mitLangsam = false,
  className = "",
}: {
  text: string;
  size?: number;
  mitLangsam?: boolean;
  className?: string;
}) {
  function sprich(e: React.MouseEvent, rate: number) {
    e.preventDefault(); // falls in einem Link
    e.stopPropagation();
    sprichPersisch(text, rate);
  }

  return (
    <span className={`inline-flex items-center ${className}`}>
      <button
        type="button"
        onClick={(e) => sprich(e, 1)}
        title="Aussprache anhören"
        aria-label={`Aussprache von ${text} anhören`}
        className="inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-400 dark:text-slate-500 transition hover:bg-taeguk-blue/10 hover:text-taeguk-blue"
      >
        <Volume2 size={size} />
      </button>
      {mitLangsam && (
        <button
          type="button"
          onClick={(e) => sprich(e, 0.3)}
          title="Langsam anhören"
          aria-label={`Aussprache von ${text} langsam anhören`}
          className="inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-400 dark:text-slate-500 transition hover:bg-taeguk-blue/10 hover:text-taeguk-blue"
        >
          <Turtle size={size - 1} />
        </button>
      )}
    </span>
  );
}
