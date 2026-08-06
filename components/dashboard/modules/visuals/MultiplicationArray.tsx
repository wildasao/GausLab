"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Apple, Star, Heart, Cookie, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/cn";

type Theme = "apples" | "stars" | "hearts" | "cookies";

const THEMES: Record<
  Theme,
  { icon: React.ComponentType<{ className?: string }>; label: string; color: string; bg: string }
> = {
  apples:  { icon: Apple,  label: "Apples",  color: "text-rose-500",    bg: "bg-rose-100" },
  stars:   { icon: Star,   label: "Stars",   color: "text-amber-500",   bg: "bg-amber-100" },
  hearts:  { icon: Heart,  label: "Hearts",  color: "text-fuchsia-500", bg: "bg-fuchsia-100" },
  cookies: { icon: Cookie, label: "Cookies", color: "text-orange-500",  bg: "bg-orange-100" },
};

export function MultiplicationArray({
  startRows = 3,
  startCols = 2,
  startTheme = "apples",
}: {
  startRows?: number;
  startCols?: number;
  startTheme?: Theme;
}) {
  const [rows, setRows] = useState(startRows);
  const [cols, setCols] = useState(startCols);
  const [theme, setTheme] = useState<Theme>(startTheme);
  const [highlight, setHighlight] = useState<"rows" | "cols" | "none">("none");
  const product = rows * cols;
  const T = THEMES[theme];
  const Icon = T.icon;

  return (
    <section className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-100">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
            Interactive multiplication array
          </div>
          <h3 className="mt-1 font-display text-base font-semibold text-navy-800">
            Rows × Columns — see multiplication as a rectangle.
          </h3>
        </div>

        {/* Theme picker */}
        <div className="hidden items-center gap-1 rounded-full bg-mist p-1 ring-1 ring-inset ring-navy-100 sm:flex">
          {(Object.keys(THEMES) as Theme[]).map((t) => {
            const TI = THEMES[t].icon;
            const active = t === theme;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTheme(t)}
                aria-pressed={active}
                aria-label={THEMES[t].label}
                className={cn(
                  "grid h-8 w-8 place-items-center rounded-full transition-colors",
                  active ? "bg-white shadow-soft" : "hover:bg-white/60"
                )}
              >
                <TI className={cn("h-4 w-4", active ? THEMES[t].color : "text-slate-400")} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="mt-6 flex justify-center">
        <div
          className={cn(
            "rounded-2xl p-3 ring-1 ring-inset ring-navy-100 transition-colors",
            highlight === "none" ? "bg-mist" : "bg-white"
          )}
        >
          <div className="inline-grid gap-1.5" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
            {Array.from({ length: rows * cols }).map((_, k) => {
              const rowIdx = Math.floor(k / cols);
              const colIdx = k % cols;
              const dim =
                highlight === "rows"
                  ? rowIdx % 2 === 0
                    ? "opacity-100"
                    : "opacity-40"
                  : highlight === "cols"
                  ? colIdx % 2 === 0
                    ? "opacity-100"
                    : "opacity-40"
                  : "opacity-100";
              return (
                <motion.div
                  key={k}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: (rowIdx * cols + colIdx) * 0.015, type: "spring", stiffness: 220, damping: 18 }}
                  className={cn(
                    "grid h-11 w-11 place-items-center rounded-xl ring-1 ring-inset ring-navy-100 transition-opacity",
                    T.bg,
                    dim
                  )}
                >
                  <Icon className={cn("h-6 w-6", T.color)} />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Read-out */}
      <div className="mt-6 rounded-2xl bg-navy-800 p-5 text-white">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-sky-300">
              What we made
            </div>
            <div className="mt-1 font-display text-3xl font-semibold sm:text-4xl">
              <span className="text-emerald-300">{rows}</span> rows{" "}
              <span className="mx-1 text-white/60">×</span>{" "}
              <span className="text-sky-300">{cols}</span> columns{" "}
              <span className="mx-1 text-white/60">=</span>{" "}
              <span className="text-orange-300">{product}</span>
            </div>
            <div className="mt-1 text-xs text-navy-200">
              {rows} × {cols} = <span className="font-semibold text-white">{product}</span>{" "}
              {THEMES[theme].label.toLowerCase()}
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px]">
            <button
              type="button"
              onMouseEnter={() => setHighlight("rows")}
              onMouseLeave={() => setHighlight("none")}
              onFocus={() => setHighlight("rows")}
              onBlur={() => setHighlight("none")}
              className="rounded-full bg-white/10 px-3 py-1 font-semibold text-emerald-300 ring-1 ring-inset ring-white/15 hover:bg-white/15"
            >
              Highlight rows
            </button>
            <button
              type="button"
              onMouseEnter={() => setHighlight("cols")}
              onMouseLeave={() => setHighlight("none")}
              onFocus={() => setHighlight("cols")}
              onBlur={() => setHighlight("none")}
              className="rounded-full bg-white/10 px-3 py-1 font-semibold text-sky-300 ring-1 ring-inset ring-white/15 hover:bg-white/15"
            >
              Highlight columns
            </button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Stepper label="Rows" value={rows} onChange={setRows} min={1} max={10} tone="emerald" />
        <Stepper label="Columns" value={cols} onChange={setCols} min={1} max={10} tone="sky" />
      </div>

      {/* Mobile theme picker */}
      <div className="mt-4 flex items-center justify-center gap-1 rounded-full bg-mist p-1 ring-1 ring-inset ring-navy-100 sm:hidden">
        {(Object.keys(THEMES) as Theme[]).map((t) => {
          const TI = THEMES[t].icon;
          const active = t === theme;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTheme(t)}
              aria-pressed={active}
              className={cn(
                "grid h-8 flex-1 place-items-center rounded-full transition-colors",
                active ? "bg-white shadow-soft" : "hover:bg-white/60"
              )}
            >
              <TI className={cn("h-4 w-4", active ? THEMES[t].color : "text-slate-400")} />
            </button>
          );
        })}
      </div>
    </section>
  );
}

function Stepper({
  label,
  value,
  onChange,
  min,
  max,
  tone,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  tone: "emerald" | "sky";
}) {
  const chip =
    tone === "emerald" ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-sky-50 text-sky-700 ring-sky-200";
  return (
    <div>
      <div className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${chip}`}>
        {label}
      </div>
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`Decrease ${label}`}
          className="grid h-10 w-10 place-items-center rounded-full bg-navy-50 text-navy-700 hover:bg-navy-100 disabled:opacity-40"
        >
          <Minus className="h-4 w-4" />
        </button>
        <div className="w-14 text-center font-display text-3xl font-semibold text-navy-800 tabular-nums">
          {value}
        </div>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`Increase ${label}`}
          className="grid h-10 w-10 place-items-center rounded-full bg-navy-50 text-navy-700 hover:bg-navy-100 disabled:opacity-40"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
