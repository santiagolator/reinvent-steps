import { RANKS, formatNumber } from "../data.js";

export default function RankLegend({ current, t }) {
  const n = (v) => formatNumber(v, t.locale);
  return (
    <section className="rounded-2xl border border-line bg-surface/60 p-4">
      <h3 className="mb-3 text-sm font-semibold">{t.ranks}</h3>
      <ol className="grid grid-cols-2 gap-1.5">
        {RANKS.map((r) => {
          const active = r.name === current.name;
          return (
            <li
              key={r.name}
              className={`flex items-center gap-2 rounded-lg p-2 ${
                active ? "bg-raised" : "opacity-60"
              }`}
            >
              <span aria-hidden>{r.emoji}</span>
              <div className="min-w-0">
                <div className="truncate text-xs font-semibold" style={{ color: r.color }}>
                  {r.name}
                </div>
                <div className="text-[10px] text-muted tabular-nums">
                  {r.max === Infinity
                    ? `${n(r.min)}+`
                    : `${n(r.min)} ${t.rangeTo} ${n(r.max)}`}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
