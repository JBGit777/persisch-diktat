/**
 * Normalisiert persischen Text für einen toleranten, fairen Vergleich im
 * Diktat-Modus. Diese Funktion MUSS vor JEDEM Vergleich angewendet werden,
 * damit Tippvarianten, die phonemisch/orthografisch identisch sind, nicht als
 * Fehler gewertet werden.
 *
 * Bewusste Entscheidungen (siehe README → „Persisch-Normalisierung"):
 *  - ZWNJ (U+200C) wird entfernt → toleranter Vergleich (نمی‌روم == نمیروم).
 *    Für erzwungene korrekte Orthografie die ZWNJ-Zeile streichen.
 *  - آ (Alef madda) wird BEWUSST NICHT zu ا normalisiert – der lange Vokal
 *    soll phonemisch unterschieden bleiben.
 */
export function normalizeFa(s: string): string {
  return s
    .normalize("NFC")
    .replace(/ي/g, "ی") // arab. Ye -> pers. Ye
    .replace(/ك/g, "ک") // arab. Kaf -> pers. Kaf
    .replace(/[ً-ْٰ]/g, "") // Harakat/Tanwin entfernen
    .replace(/ـ/g, "") // Tatweel entfernen
    .replace(/[۰-۹]/g, (d) =>
      String.fromCharCode(d.charCodeAt(0) - 0x06f0 + 48)
    ) // pers. Ziffern -> ASCII
    .replace(/[٠-٩]/g, (d) =>
      String.fromCharCode(d.charCodeAt(0) - 0x0660 + 48)
    ) // arab. Ziffern -> ASCII
    .replace(/‌/g, "") // ZWNJ tolerieren
    .replace(/\s+/g, " ")
    .trim();
}
