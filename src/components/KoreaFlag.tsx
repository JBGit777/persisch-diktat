/**
 * Stilisierte iranische Flagge (Trikolore Grün-Weiß-Rot, Seitenverhältnis 4:7).
 * Dateiname/Export bleiben aus der Koreanisch-Vorlage erhalten, damit der
 * bestehende Import auf der Login-Seite unverändert funktioniert.
 */
export default function KoreaFlag({
  width = 96,
  className = "",
}: {
  width?: number;
  className?: string;
}) {
  return (
    <svg
      width={width}
      height={(width * 4) / 7}
      viewBox="0 0 350 200"
      className={className}
      aria-label="Iranische Flagge"
      role="img"
    >
      <rect x="0" y="0" width="350" height="200" rx="10" fill="#ffffff" />
      <rect x="0" y="0" width="350" height="66.67" rx="10" fill="#239F40" />
      <rect x="0" y="50" width="350" height="20" fill="#239F40" />
      <rect x="0" y="133.33" width="350" height="56.67" fill="#DA0000" />
      <rect x="0" y="180" width="350" height="10" rx="10" fill="#DA0000" />
    </svg>
  );
}
