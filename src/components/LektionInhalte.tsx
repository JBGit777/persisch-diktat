"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createClient } from "@/lib/supabase/client";
import type { LessonResource, LessonProgress } from "@/lib/types";

interface Props {
  userId: string;
  lessonId: string;
  initialStatus: LessonProgress["status"];
  initialGrammatik: LessonResource[];
}

const STATUS_OPTIONEN: { value: LessonProgress["status"]; label: string }[] = [
  { value: "offen", label: "Offen" },
  { value: "in_arbeit", label: "In Arbeit" },
  { value: "fertig", label: "Fertig" },
];

function Markdown({ text }: { text: string }) {
  return (
    <div className="space-y-3 text-sm leading-relaxed [&_h1]:text-lg [&_h1]:font-bold [&_h2]:mt-4 [&_h2]:text-base [&_h2]:font-semibold [&_h3]:font-semibold [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1 [&_li]:ml-4 [&_li]:list-disc [&_strong]:font-semibold [&_table]:w-full [&_td]:border [&_td]:border-slate-200 [&_td]:px-2 [&_td]:py-1 [&_th]:border [&_th]:border-slate-200 [&_th]:bg-slate-50 [&_th]:px-2 [&_th]:py-1">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
    </div>
  );
}

export default function LektionInhalte({
  userId,
  lessonId,
  initialStatus,
  initialGrammatik,
}: Props) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [status, setStatus] = useState(initialStatus);

  async function statusAendern(neu: LessonProgress["status"]) {
    setStatus(neu);
    await supabase.from("lesson_progress").upsert(
      { user_id: userId, lesson_id: lessonId, status: neu, aktualisiert_am: new Date().toISOString() },
      { onConflict: "user_id,lesson_id" }
    );
    router.refresh();
  }

  return (
    <div className="space-y-8">
      {/* Status */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-500 dark:text-slate-400">Status:</span>
        <select
          value={status}
          onChange={(e) => statusAendern(e.target.value as LessonProgress["status"])}
          className="rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-sm outline-none focus:border-slate-900"
        >
          {STATUS_OPTIONEN.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Grammatik (nur wenn vorhanden) */}
      {initialGrammatik.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold">📖 Grammatik</h2>
          <div className="mt-3 space-y-4">
            {initialGrammatik.map((g) => (
              <div
                key={g.id}
                className="rounded-xl bg-white dark:bg-slate-800 p-4 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700"
              >
                <Markdown text={g.inhalt ?? ""} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
