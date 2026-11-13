export const LANGS = {
  es: {
    locale: "es-AR",
    days: ["LUN 30", "MAR 1", "MIÉ 2", "JUE 3", "VIE 4"],
    headline: (year) => `¿Cuánto caminaste en re:Invent ${year}?`,
    intro:
      "Cargá tus pasos de cada día, elegí los venues que recorriste y descargá tu tarjeta para compartirla en LinkedIn.",
    linkedin: "Tu perfil de LinkedIn",
    handlePlaceholder: "tunombre",
    stepsPerDay: "Pasos por día",
    dayHint: "Tocá un día para excluirlo",
    dayToggle: (active) => (active ? "Excluir este día" : "Incluir este día"),
    stepsOn: (day) => `Pasos del ${day}`,
    venues: "Venues que recorriste",
    summaryKm: (km) => `pasos, ${km} km`,
    remaining: (n, next) => `Te faltan ${n} pasos para ${next.name} ${next.emoji}`,
    maxRank:
      "Llegaste al rango máximo. Everything fails all the time, menos tus piernas.",
    download: "Descargar PNG",
    generating: "Generando PNG",
    reset: "Reiniciar",
    error: "No se pudo generar la imagen. Probá de nuevo.",
    footer: "Hecho con ♥️ para la comunidad de AWS re:Invent",
    ranks: "Rangos",
    rangeTo: "a",
    fileSuffix: "pasos",
    cardSteps: (d) => `pasos en ${d} ${d === 1 ? "día" : "días"},`,
    cardWalked: "recorridos",
    cardAvg: (km) => `pasos por día, ${km} km`,
  },
  en: {
    locale: "en-US",
    days: ["MON 30", "TUE 1", "WED 2", "THU 3", "FRI 4"],
    headline: (year) => `How far did you walk at re:Invent ${year}?`,
    intro:
      "Enter your steps for each day, pick the venues you walked through and download your card to share on LinkedIn.",
    linkedin: "Your LinkedIn profile",
    handlePlaceholder: "yourname",
    stepsPerDay: "Steps per day",
    dayHint: "Tap a day to exclude it",
    dayToggle: (active) => (active ? "Exclude this day" : "Include this day"),
    stepsOn: (day) => `Steps on ${day}`,
    venues: "Venues you walked",
    summaryKm: (km) => `steps, ${km} km`,
    remaining: (n, next) => `${n} more steps to reach ${next.name} ${next.emoji}`,
    maxRank: "You reached the top rank. Everything fails all the time, except your legs.",
    download: "Download PNG",
    generating: "Generating PNG",
    reset: "Reset",
    error: "Couldn't generate the image. Try again.",
    footer: "Made with ♥️ for the AWS re:Invent community",
    ranks: "Ranks",
    rangeTo: "to",
    fileSuffix: "steps",
    cardSteps: (d) => `steps over ${d} ${d === 1 ? "day" : "days"},`,
    cardWalked: "walked",
    cardAvg: (km) => `steps per day, ${km} km`,
  },
};

export function detectLang() {
  try {
    const saved = localStorage.getItem("lang");
    if (saved in LANGS) return saved;
  } catch {
    /* storage blocked: fall through to browser language */
  }
  return navigator.language?.toLowerCase().startsWith("es") ? "es" : "en";
}

export function saveLang(lang) {
  try {
    localStorage.setItem("lang", lang);
  } catch {
    /* per-viewer convenience only */
  }
}
