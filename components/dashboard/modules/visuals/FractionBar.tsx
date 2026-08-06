"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";

export function FractionBar({ start = [3, 4] as [number, number] }) {
  const [numerator, setNumerator] = useState(start[0]);
  const [denominator, setDenominator] = useState(start[1]);

  const clampedN = Math.min(numerator, denominator);
  const parts = Array.from({ length: denominator }, (_, i) => i);
  const value = clampedN / denominator;

  return (
    <section className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-100">
      <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
        Interactive fraction bar
      </div>
      <h3 className="mt-1 font-display text-base font-semibold text-navy-800">
        Change the numerator and denominator — see how the fraction shifts.
      </h3>

      {/* Bar */}
      <div className="mt-6 flex overflow-hidden rounded-2xl ring-1 ring-inset ring-navy-100">
        {parts.map((i) => {
          const filled = i < clampedN;
          return (
            <button
              key={i}
              onClick={() => setNumerator(i + 1)}
              aria-label={`Set numerator to ${i + 1}`}
              className="group relative flex-1 border-r border-navy-100/60 last:border-r-0"
              style={{ height: 96 }}
            >
              <motion.div
                animate={{ opacity: filled ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-gradient-to-b from-orange-400 to-orange-500"
              />
              {!filled && <div className="absolute inset-0 bg-mist group-hover:bg-orange-50" />}
              <div className="pointer-events-none relative flex h-full items-center justify-center">
                <span className={filled ? "font-semibold text-white" : "text-slate-400"}>
                  {i + 1}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Controls */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Control label="Numerator (shaded)" value={clampedN} onChange={setNumerator} min={0} max={denominator} tone="orange" />
        <Control label="Denominator (total)" value={denominator} onChange={setDenominator} min={1} max={12} tone="sky" />
      </div>

      {/* Read-out */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-navy-800 p-4 text-white">
        <div className="flex items-baseline gap-4">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-sky-300">
            Fraction
          </div>
          <div className="font-display text-3xl font-semibold">
            <span className="text-orange-300">{clampedN}</span>
            <span className="mx-1 text-white/50">/</span>
            <span className="text-sky-300">{denominator}</span>
          </div>
        </div>
        <div className="text-sm text-navy-200">
          Decimal: <span className="font-semibold text-white">{value.toFixed(2)}</span> ·{" "}
          Percent: <span className="font-semibold text-white">{Math.round(value * 100)}%</span>
        </div>
      </div>
    </section>
  );
}

function Control({
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
  tone: "sky" | "orange";
}) {
  const chipTone =
    tone === "sky"
      ? "bg-sky-50 text-sky-700 ring-sky-200"
      : "bg-orange-50 text-orange-700 ring-orange-200";
  return (
    <div>
      <div className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${chipTone}`}>
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
        <div className="font-display text-3xl font-semibold text-navy-800 tabular-nums w-14 text-center">
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
