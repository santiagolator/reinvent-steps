import { EVENT_YEAR, formatNumber, num, stepsToKm } from "../data.js";
import { AwsLogo, LinkedInIcon } from "./Icons.jsx";

export default function StepsCard({
  ref,
  days,
  venues,
  linkedinUser,
  totalSteps,
  avgSteps,
  rank,
  t,
}) {
  const n = (v) => formatNumber(v, t.locale);
  const km = (v) => stepsToKm(v, t.locale);
  const active = days.map((d, i) => ({ ...d, label: t.days[i] })).filter((d) => d.active);
  const maxSteps = Math.max(0, ...active.map(num));
  const walkedDays = active.filter((d) => num(d) > 0).length || active.length;

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-3xl bg-surface text-text"
      style={{
        // ponytail: inline because html-to-image needs a resolved color behind blur
        backgroundImage: `radial-gradient(420px 260px at 50% -10%, ${rank.color}2e, transparent 70%)`,
        boxShadow: "0 30px 60px -20px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.06)",
      }}
    >
      <div className="flex items-center justify-between px-6 pt-6">
        <div className="flex items-center gap-3">
          <AwsLogo width={44} />
          <div className="leading-tight">
            <div className="font-display text-base font-bold">
              re:Invent {EVENT_YEAR}
            </div>
            <div className="text-xs text-muted">Las Vegas</div>
          </div>
        </div>
        <div
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
          style={{ color: rank.color, background: `${rank.color}1f` }}
        >
          <span className="leading-none">{rank.emoji}</span>
          <span className="font-display leading-none">{rank.name}</span>
        </div>
      </div>

      <div className="px-6 pt-8 pb-2 text-center">
        <div
          className="font-display text-[4.25rem] leading-none font-bold tracking-tight tabular-nums"
          style={{ color: rank.color, textShadow: `0 0 48px ${rank.color}66` }}
        >
          {n(totalSteps)}
        </div>
        <p className="mt-3 text-sm text-muted">
          {t.cardSteps(walkedDays)}{" "}
          <span className="text-text">{km(totalSteps)} km</span> {t.cardWalked}
        </p>
      </div>

      <div className="px-6 pt-6">
        <div className="flex h-28 items-end justify-between gap-2 pt-6">
          {active.map((day, i) => {
            const steps = num(day);
            const pct = maxSteps > 0 ? (steps / maxSteps) * 100 : 0;
            const isMax = steps === maxSteps && maxSteps > 0;
            return (
              <div key={i} className="flex h-full flex-1 flex-col items-center justify-end">
                <div className="relative flex h-full w-full items-end">
                  {isMax && (
                    <div
                      className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-md px-2 py-1 text-[10px] leading-none font-bold whitespace-nowrap tabular-nums"
                      style={{ color: rank.color, background: `${rank.color}22` }}
                    >
                      {n(maxSteps)}
                    </div>
                  )}
                  <div
                    className="w-full rounded-t-md"
                    style={{
                      height: `${Math.max(pct, 4)}%`,
                      background: isMax
                        ? `linear-gradient(180deg, ${rank.color}, ${rank.color}99)`
                        : "rgba(255,255,255,.12)",
                    }}
                  />
                </div>
                <div className="mt-2 text-[10px] font-semibold text-muted">
                  {day.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {venues.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-1.5 px-6">
          {venues.map((v) => (
            <span
              key={v}
              className="rounded-full border border-line px-2.5 py-1 text-[11px] text-muted"
            >
              {v}
            </span>
          ))}
        </div>
      )}

      <div className="mx-6 mt-6 flex items-end justify-between border-t border-line py-5">
        <div>
          <div className="font-display text-2xl leading-none font-bold tabular-nums">
            {n(avgSteps)}
          </div>
          <div className="mt-1 text-xs text-muted">{t.cardAvg(km(avgSteps))}</div>
        </div>
        <div className="text-right">
          <div className="text-xs font-semibold text-orange">#AWSreInvent</div>
          <div className="mt-1 flex items-center justify-end gap-1 text-xs text-muted">
            <LinkedInIcon size={12} />
            in/{linkedinUser || t.handlePlaceholder}
          </div>
        </div>
      </div>
    </div>
  );
}
