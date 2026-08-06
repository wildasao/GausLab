"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Apple, Star, Heart, Cookie, Minus, Plus } from "lucide-react";
import { LabShell } from "./LabShell";
import { cn } from "@/lib/cn";

type Theme = "apples" | "stars" | "hearts" | "cookies";

const THEMES: Record<
  Theme,
  { icon: React.ComponentType<{ className?: string }>; label: string; color: string; bg: string; noun: string }
> = {
  apples: { icon: Apple, label: "Apples", color: "text-rose-500", bg: "bg-rose-100", noun: "apples" },
  stars: { icon: Star, label: "Stars", color: "text-amber-500", bg: "bg-amber-100", noun: "stars" },
  hearts: { icon: Heart, label: "Hearts", color: "text-fuchsia-500", bg: "bg-fuchsia-100", noun: "hearts" },
  cookies: { icon: Cookie, label: "Cookies", color: "text-orange-500", bg: "bg-orange-100", noun: "cookies" },
};

export function MultiplicationLab() {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(2);
  const [theme, setTheme] = useState<Theme>("apples");
  const product = rows * cols;
  const T = THEMES[theme];
  const Icon = T.icon;

  return (
    <LabShell
      kind="multiplication"
      title="Design a multiplication problem"
      subtitle="Choose rows, columns and a theme. Write a story. Save it."
      config={{ rows, cols, theme }}
      computedAnswer={`${product} ${T.noun}`}
      storyPlaceholder={`e.g. "Mia has ${rows} boxes with ${cols} ${T.noun} in each. How many ${T.noun} altogether?"`}
      visual={
        <div className="grid gap-4 rounded-2xl bg-mist p-4 ring-1 ring-inset ring-navy-100 sm:grid-cols-[auto,1fr]">
          {/* array preview */}
          <div className="rounded-2xl bg-white p-3 ring-1 ring-inset ring-navy-100">
            <div
              className="inline-grid gap-1.5"
              style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: rows * cols }).map((_, k) => (
                <motion.div
                  key={k}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: k * 0.01, type: "spring", stiffness: 220, damping: 18 }}
                  className={cn("grid h-9 w-9 place-items-center rounded-xl ring-1 ring-inset ring-navy-100", T.bg)}
                >
                  <Icon className={cn("h-5 w-5", T.color)} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* controls */}
          <div className="flex flex-col justify-between gap-4">
            <Stepper label="Rows" value={rows} onChange={setRows} min={1} max={10} tone="emerald" />
            <Stepper label="Columns" value={cols} onChange={setCols} min={1} max={10} tone="sky" />
            <div className="rounded-2xl bg-navy-800 p-3 text-white">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-sky-300">
                My equation
              </div>
              <div className="mt-1 font-display text-xl font-semibold">
                {rows} × {cols} = <span className="text-orange-300">{product}</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-1 rounded-full bg-white p-1 ring-1 ring-inset ring-navy-100">
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
                      active ? "bg-mist shadow-soft" : "hover:bg-mist"
                    )}
                  >
                    <TI className={cn("h-4 w-4", active ? THEMES[t].color : "text-slate-400")} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      }
    />
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
      <div className="mt-1 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="grid h-8 w-8 place-items-center rounded-full bg-white text-navy-700 ring-1 ring-inset ring-navy-100 hover:bg-navy-50 disabled:opacity-40"
          aria-label={`Decrease ${label}`}
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <div className="w-10 text-center font-display text-xl font-semibold text-navy-800 tabular-nums">
          {value}
        </div>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="grid h-8 w-8 place-items-center rounded-full bg-white text-navy-700 ring-1 ring-inset ring-navy-100 hover:bg-navy-50 disabled:opacity-40"
          aria-label={`Increase ${label}`}
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
