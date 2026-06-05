"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [dunkel, setDunkel] = useState(false);
  const [bereit, setBereit] = useState(false);

  useEffect(() => {
    setDunkel(document.documentElement.classList.contains("dark"));
    setBereit(true);
  }, []);

  function umschalten() {
    const neu = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", neu);
    try {
      localStorage.setItem("theme", neu ? "dark" : "light");
    } catch {
      // localStorage nicht verfügbar – egal
    }
    setDunkel(neu);
  }

  return (
    <button
      type="button"
      onClick={umschalten}
      title={dunkel ? "Hell" : "Dunkel"}
      aria-label="Farbschema umschalten"
      className="flex h-8 w-8 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-100"
    >
      {bereit && dunkel ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
