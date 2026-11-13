import { RANKS, formatNumber } from "../data.js";

export default function RankLegend({ current }) {
  return (
    <section className="rounded-2xl border border-line bg-surface/60 p-4">
      <h3 className="mb-3 text-sm font-semibold">Rangos</h3>
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
                    ? `${formatNumber(r.min)}+`
                    : `${formatNumber(r.min)} a ${formatNumber(r.max)}`}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
