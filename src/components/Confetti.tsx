"use client";

import { useMemo } from "react";

/** Dezenter Konfetti-Regen (rein per CSS, in Flaggenfarben). */
export default function Confetti({ stueck = 36 }: { stueck?: number }) {
  const farben = ["#CD2E3A", "#0047A0", "#f59e0b", "#10b981"];
  const teile = useMemo(
    () =>
      Array.from({ length: stueck }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        dauer: 1.8 + Math.random() * 1.4,
        farbe: farben[i % farben.length],
        groesse: 6 + Math.random() * 6,
        rund: Math.random() > 0.5,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stueck]
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {teile.map((t, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            top: 0,
            left: `${t.left}%`,
            width: t.groesse,
            height: t.groesse,
            backgroundColor: t.farbe,
            borderRadius: t.rund ? "9999px" : "2px",
            animation: `confetti-fall ${t.dauer}s linear ${t.delay}s forwards`,
          }}
        />
      ))}
    </div>
  );
}
