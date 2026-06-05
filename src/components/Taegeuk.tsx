/**
 * Rundes App-Emblem in den Farben der iranischen Flagge (Grün-Weiß-Rot).
 * Dateiname/Export bleiben aus der Koreanisch-Vorlage erhalten, damit die
 * bestehenden Importe (NavBar, Startseite) unverändert funktionieren.
 */
export default function Taegeuk({
  size = 24,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <clipPath id="iran-emblem-kreis">
          <circle cx="50" cy="50" r="48" />
        </clipPath>
      </defs>
      <g clipPath="url(#iran-emblem-kreis)">
        <rect x="0" y="0" width="100" height="33.33" fill="#239F40" />
        <rect x="0" y="33.33" width="100" height="33.34" fill="#ffffff" />
        <rect x="0" y="66.67" width="100" height="33.33" fill="#DA0000" />
      </g>
      <circle
        cx="50"
        cy="50"
        r="48"
        fill="none"
        stroke="#0f172a"
        strokeOpacity="0.12"
        strokeWidth="2"
      />
    </svg>
  );
}
