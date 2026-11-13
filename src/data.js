export const EVENT_YEAR = 2026;

export const RANKS = [
  {
    min: 0,
    max: 30000,
    name: "Prompt Padawan",
    emoji: "🌱",
    color: "#9AA7B8",
    description: "Still learning the prompts",
  },
  {
    min: 30000,
    max: 50000,
    name: "Context Window Walker",
    emoji: "🧭",
    color: "#5B9CF6",
    description: "Expanding your context, one step at a time",
  },
  {
    min: 50000,
    max: 75000,
    name: "Vibe Coder",
    emoji: "✨",
    color: "#34D399",
    description: "Shipping on pure vibes",
  },
  {
    min: 75000,
    max: 100000,
    name: "Token Burner",
    emoji: "🔥",
    color: "#A78BFA",
    description: "Burning tokens and calories",
  },
  {
    min: 100000,
    max: 125000,
    name: "Agentic Strider",
    emoji: "🤖",
    color: "#FBBF24",
    description: "Autonomous, goal-driven, unstoppable",
  },
  {
    min: 125000,
    max: 150000,
    name: "Multi-Agent Legend",
    emoji: "🧠",
    color: "#F87171",
    description: "Orchestrating every hall in Vegas",
  },
  {
    min: 150000,
    max: 175000,
    name: "AGI Titan",
    emoji: "👑",
    color: "#FF9900",
    description: "Superhuman walking intelligence",
  },
  {
    min: 175000,
    max: Infinity,
    name: "Werner Vogels Mode",
    emoji: "🚀",
    color: "#FF6B35",
    description: "Everything fails all the time... except your legs!",
  },
];

export const VENUES = [
  "The Venetian",
  "MGM Grand",
  "Wynn",
  "Caesars Forum",
  "Caesars Palace",
  "Mandalay Bay",
  "Encore",
  "LINQ",
];

// Días oficiales de re:Invent 2026: lunes 30 de noviembre a viernes 4 de diciembre.
// Las etiquetas por idioma están en i18n.js (LANGS.*.days).
export const EVENT_DAY_COUNT = 5;

export const defaultDays = () =>
  Array.from({ length: EVENT_DAY_COUNT }, () => ({ steps: "", active: true }));

export const num = (day) => parseInt(day.steps, 10) || 0;

export function getRank(total) {
  return RANKS.find((r) => total >= r.min && total < r.max) || RANKS.at(-1);
}

export function nextRank(total) {
  return RANKS.find((r) => r.min > total) || null;
}

export const formatNumber = (n, locale) => n.toLocaleString(locale);

export const stepsToKm = (steps, locale) =>
  (steps * 0.000762).toLocaleString(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
