"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

const WIDTH = 640;
const HEIGHT = 220;
const PAD = { l: 32, r: 16, t: 20, b: 28 };

export function ProgressChart({
  weekly,
  studentFirstName = "Student",
}: {
  weekly: { week: string; value: number }[];
  studentFirstName?: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const data = weekly;

  const { linePath, areaPath, points, ticks } = useMemo(() => {
    const min = 40;
    const max = 100;
    const innerW = WIDTH - PAD.l - PAD.r;
    const innerH = HEIGHT - PAD.t - PAD.b;
    const step = innerW / (data.length - 1);
    const points = data.map((d, i) => {
      const x = PAD.l + i * step;
      const y = PAD.t + innerH - ((d.value - min) / (max - min)) * innerH;
      return { x, y, ...d };
    });
    const linePath = points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
      .join(" ");
    const areaPath =
      `${linePath} L ${points[points.length - 1].x} ${HEIGHT - PAD.b} L ${points[0].x} ${
        HEIGHT - PAD.b
      } Z`;
    const ticks = [50, 60, 70, 80, 90, 100].map((v) => ({
      v,
      y: PAD.t + innerH - ((v - min) / (max - min)) * innerH,
    }));
    return { linePath, areaPath, points, ticks };
  }, [data]);

  const active = hover !== null ? points[hover] : null;

  return (
    <section
      aria-labelledby="progress-chart-title"
      className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-100"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Progress this term
          </div>
          <h2 id="progress-chart-title" className="mt-1 font-display text-lg font-semibold text-navy-800">
            Weekly mastery score
          </h2>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <Legend color="bg-orange-500" label={studentFirstName} />
          <Legend color="bg-navy-300" label="Year average" dashed />
          <div className="hidden rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200 sm:inline">
            +26 pts vs W1
          </div>
        </div>
      </div>

      <div className="relative mt-4">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-56 w-full"
          role="img"
          aria-label="Line chart showing weekly mastery increasing from 58 to 84"
        >
          <defs>
            <linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#F97316" stopOpacity="0.28" />
              <stop offset="1" stopColor="#F97316" stopOpacity="0" />
            </linearGradient>
          </defs>

          {ticks.map((t) => (
            <g key={t.v}>
              <line
                x1={PAD.l}
                x2={WIDTH - PAD.r}
                y1={t.y}
                y2={t.y}
                stroke="rgba(11,30,63,0.08)"
                strokeDasharray="3 4"
              />
              <text x={PAD.l - 8} y={t.y + 3} textAnchor="end" fontSize="10" fill="#64748b">
                {t.v}
              </text>
            </g>
          ))}

          {/* Y5 average dashed reference */}
          <line
            x1={PAD.l}
            x2={WIDTH - PAD.r}
            y1={PAD.t + (HEIGHT - PAD.t - PAD.b) * 0.55}
            y2={PAD.t + (HEIGHT - PAD.t - PAD.b) * 0.55}
            stroke="#94a3b8"
            strokeDasharray="6 6"
            strokeWidth="1.5"
          />

          <motion.path
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            d={areaPath}
            fill="url(#chart-fill)"
          />
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            d={linePath}
            stroke="#F97316"
            strokeWidth="2.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {points.map((p, i) => (
            <g key={p.week}>
              <circle cx={p.x} cy={p.y} r="4" fill="#fff" stroke="#F97316" strokeWidth="2" />
              <rect
                x={p.x - 20}
                y={PAD.t}
                width="40"
                height={HEIGHT - PAD.t - PAD.b}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                tabIndex={0}
                aria-label={`Week ${p.week}: ${p.value}% mastery`}
              />
              <text
                x={p.x}
                y={HEIGHT - 8}
                textAnchor="middle"
                fontSize="10"
                fill="#64748b"
              >
                {p.week}
              </text>
            </g>
          ))}
          {active && (
            <g>
              <line
                x1={active.x}
                x2={active.x}
                y1={PAD.t}
                y2={HEIGHT - PAD.b}
                stroke="#0F172A"
                strokeOpacity="0.15"
                strokeDasharray="3 3"
              />
              <circle cx={active.x} cy={active.y} r="6" fill="#F97316" stroke="#fff" strokeWidth="2" />
            </g>
          )}
        </svg>
        {active && (
          <div
            className="pointer-events-none absolute rounded-xl bg-navy-800 px-3 py-2 text-xs text-white shadow-lift ring-1 ring-white/10"
            style={{
              left: `calc(${(active.x / WIDTH) * 100}% - 40px)`,
              top: `calc(${(active.y / HEIGHT) * 100}% - 44px)`,
            }}
          >
            <div className="text-[10px] uppercase tracking-widest text-sky-200">{active.week}</div>
            <div className="font-display text-sm font-semibold">{active.value}% mastery</div>
          </div>
        )}
      </div>
    </section>
  );
}

function Legend({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <div className="inline-flex items-center gap-1.5">
      <span
        className={`h-1.5 w-4 rounded-full ${color}`}
        style={dashed ? { backgroundImage: "repeating-linear-gradient(90deg, #94a3b8 0 4px, transparent 4px 8px)" } : undefined}
      />
      {label}
    </div>
  );
}
