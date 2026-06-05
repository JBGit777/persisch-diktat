import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        // Vazirmatn (via next/font, CSS-Variable) als Standard – mit robustem
        // Fallback, falls die Web-Schrift noch nicht geladen ist.
        sans: [
          "var(--font-vazirmatn)",
          "Vazirmatn",
          "Tahoma",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif",
        ],
      },
      colors: {
        // Akzentfarben der iranischen Flagge (Grün/Rot) – ersetzt die
        // koreanischen Taegukgi-Farben. Schlüsselname „taeguk" bleibt für
        // minimale Diffs in den bestehenden Komponenten erhalten.
        taeguk: {
          blue: "#239F40", // Grün (Iran)
          red: "#DA0000", // Rot (Iran)
        },
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "confetti-fall": {
          "0%": { transform: "translateY(-10vh) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateY(110vh) rotate(720deg)", opacity: "0" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.35s ease-out both",
        "confetti-fall": "confetti-fall linear forwards",
      },
    },
  },
  plugins: [],
};

export default config;
