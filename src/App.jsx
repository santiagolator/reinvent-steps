import { useEffect, useRef, useState } from "react";
import * as htmlToImage from "html-to-image";
import { Analytics } from "@vercel/analytics/react";
import {
  DAY_LABELS,
  EVENT_YEAR,
  VENUES,
  defaultDays,
  formatNumber,
  getRank,
  nextRank,
  num,
  stepsToKm,
} from "./data.js";
import StepsCard from "./components/StepsCard.jsx";
import RankLegend from "./components/RankLegend.jsx";
import { AwsLogo, GitHubIcon, LinkedInIcon } from "./components/Icons.jsx";

const CARD_WIDTH = 420;

const chip = (on) =>
  `rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
    on
      ? "border-orange/40 bg-orange/15 text-orange"
      : "border-line bg-surface text-muted hover:border-muted/40 hover:text-text"
  }`;

export default function App() {
  const [linkedinUser, setLinkedinUser] = useState("");
  const [days, setDays] = useState(defaultDays);
  const [venues, setVenues] = useState([]);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");
  const cardRef = useRef(null);
  const frameRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [cardHeight, setCardHeight] = useState(0);

  // La tarjeta siempre mide 420px; en pantallas angostas se escala visualmente
  // para que el PNG salga igual en mobile y desktop.
  useEffect(() => {
    const ro = new ResizeObserver(() => {
      setScale(Math.min(1, frameRef.current.clientWidth / CARD_WIDTH));
      setCardHeight(cardRef.current.offsetHeight);
    });
    ro.observe(frameRef.current);
    ro.observe(cardRef.current);
    return () => ro.disconnect();
  }, []);

  const active = days.filter((d) => d.active);
  const totalSteps = active.reduce((sum, d) => sum + num(d), 0);
  const walkedDays = active.filter((d) => num(d) > 0).length;
  const avgSteps = walkedDays ? Math.round(totalSteps / walkedDays) : 0;
  const rank = getRank(totalSteps);
  const next = nextRank(totalSteps);
  const progress = next
    ? ((totalSteps - rank.min) / (next.min - rank.min)) * 100
    : 100;

  const updateDay = (i, patch) =>
    setDays((ds) => ds.map((d, j) => (j === i ? { ...d, ...patch } : d)));

  const toggleVenue = (v) =>
    setVenues((vs) => (vs.includes(v) ? vs.filter((x) => x !== v) : [...vs, v]));

  const reset = () => {
    setLinkedinUser("");
    setDays(defaultDays());
    setVenues([]);
    setError("");
  };

  const download = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    setError("");
    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        pixelRatio: 3,
        width: CARD_WIDTH,
        height: cardRef.current.offsetHeight,
        backgroundColor: "#16223a",
      });
      const a = document.createElement("a");
      a.download = `reinvent-${EVENT_YEAR}-${totalSteps}-pasos.png`;
      a.href = dataUrl;
      a.click();
    } catch (e) {
      console.error(e);
      setError("No se pudo generar la imagen. Probá de nuevo.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 md:px-6 md:py-12">
      <div className="mesh" aria-hidden />

      <header className="mx-auto mb-10 max-w-5xl">
        <AwsLogo width={56} />
        <h1 className="mt-5 max-w-2xl font-display text-4xl leading-[1.05] font-bold tracking-tight md:text-5xl">
          ¿Cuánto caminaste en re:Invent {EVENT_YEAR}?
        </h1>
        <p className="mt-3 max-w-xl text-muted">
          Cargá tus pasos de cada día, elegí los venues que recorriste y
          descargá tu tarjeta para compartirla en LinkedIn.
        </p>
      </header>

      <main className="mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <section className="min-w-0 rounded-3xl border border-line bg-surface/70 p-5 backdrop-blur md:p-7">
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <LinkedInIcon /> Tu perfil de LinkedIn
            </span>
            <div className="flex overflow-hidden rounded-xl border border-line bg-ink/60 focus-within:border-orange/60">
              <span className="flex shrink-0 items-center border-r border-line px-3 text-sm text-muted">
                in/
              </span>
              <input
                type="text"
                value={linkedinUser}
                onChange={(e) => setLinkedinUser(e.target.value.trim())}
                placeholder="tunombre"
                autoComplete="off"
                className="min-w-0 flex-1 bg-transparent p-3 outline-none placeholder:text-muted/60"
              />
            </div>
          </label>

          <div className="mt-7">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold">Pasos por día</span>
              {days.length < 7 && (
                <button
                  type="button"
                  onClick={() =>
                    setDays([...days, { label: DAY_LABELS[days.length], steps: "", active: true }])
                  }
                  className="rounded-lg border border-orange/40 bg-orange/15 px-3 py-1.5 text-xs font-semibold text-orange hover:bg-orange/25"
                >
                  Agregar día
                </button>
              )}
            </div>

            <div className="flex flex-col gap-2">
              {days.map((day, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 ${day.active ? "" : "opacity-50"}`}
                >
                  <button
                    type="button"
                    onClick={() => updateDay(i, { active: !day.active })}
                    aria-pressed={day.active}
                    title={day.active ? "Excluir este día" : "Incluir este día"}
                    className={`w-14 shrink-0 rounded-lg border py-2.5 text-xs font-bold transition-colors ${
                      day.active
                        ? "border-orange/40 bg-orange/15 text-orange"
                        : "border-line bg-surface text-muted"
                    }`}
                  >
                    {day.label}
                  </button>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    value={day.steps}
                    onChange={(e) => updateDay(i, { steps: e.target.value })}
                    placeholder="0"
                    disabled={!day.active}
                    aria-label={`Pasos del ${day.label}`}
                    className="min-w-0 flex-1 rounded-lg border border-line bg-ink/60 p-2.5 tabular-nums outline-none focus:border-orange/60"
                  />
                  <span className="hidden w-16 shrink-0 text-right text-xs text-muted tabular-nums sm:block">
                    {stepsToKm(num(day))} km
                  </span>
                  {days.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setDays(days.filter((_, j) => j !== i))}
                      aria-label={`Quitar ${day.label}`}
                      className="rounded-md p-2 text-sm text-muted hover:bg-red-500/15 hover:text-red-400"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-7">
            <span className="mb-3 block text-sm font-semibold">Venues que recorriste</span>
            <div className="flex flex-wrap gap-2">
              {VENUES.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => toggleVenue(v)}
                  aria-pressed={venues.includes(v)}
                  className={chip(venues.includes(v))}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-7 rounded-2xl border border-line bg-ink/50 p-4">
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <div className="font-display text-3xl leading-none font-bold tabular-nums text-orange">
                  {formatNumber(totalSteps)}
                </div>
                <div className="mt-1 text-xs text-muted">
                  pasos, {stepsToKm(totalSteps)} km
                </div>
              </div>
              <div className="text-right">
                <div className="font-display text-base font-bold" style={{ color: rank.color }}>
                  {rank.emoji} {rank.name}
                </div>
                <div className="mt-1 text-xs text-muted">{rank.description}</div>
              </div>
            </div>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full transition-[width] duration-500"
                style={{ width: `${Math.min(progress, 100)}%`, background: rank.color }}
              />
            </div>
            <p className="mt-2 text-xs text-muted">
              {next
                ? `Te faltan ${formatNumber(next.min - totalSteps)} pasos para ${next.name} ${next.emoji}`
                : "Llegaste al rango máximo. Everything fails all the time, menos tus piernas."}
            </p>
          </div>
        </section>

        <aside className="flex min-w-0 flex-col gap-4 lg:sticky lg:top-8">
          <div ref={frameRef} style={{ height: cardHeight * scale }}>
            <div
              style={{
                width: CARD_WIDTH,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
            >
              <StepsCard
                ref={cardRef}
                days={days}
                venues={venues}
                linkedinUser={linkedinUser}
                totalSteps={totalSteps}
                avgSteps={avgSteps}
                rank={rank}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={download}
              disabled={downloading || totalSteps === 0}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange py-3 font-bold text-ink transition-colors hover:bg-amber disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-muted"
            >
              {downloading ? (
                <>
                  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                    <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                  </svg>
                  Generando PNG
                </>
              ) : (
                "Descargar PNG"
              )}
            </button>
            <button
              type="button"
              onClick={reset}
              className="shrink-0 rounded-xl border border-line px-5 py-3 font-semibold text-muted transition-colors hover:text-text"
            >
              Reiniciar
            </button>
          </div>
          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}

          <RankLegend current={rank} />
        </aside>
      </main>

      <footer className="mx-auto mt-16 flex max-w-5xl flex-wrap items-center justify-between gap-4 text-sm text-muted">
        <span>Hecho con ♥️ para la comunidad de AWS re:Invent</span>
        <div className="flex items-center gap-4">
          <a
            href="https://linkedin.com/in/santiago-lator"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="transition-colors hover:text-text"
          >
            <LinkedInIcon size={22} fill="currentColor" />
          </a>
          <a
            href="https://github.com/santiagolator/reinvent-steps"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="transition-colors hover:text-text"
          >
            <GitHubIcon />
          </a>
        </div>
      </footer>

      <Analytics />
    </div>
  );
}
