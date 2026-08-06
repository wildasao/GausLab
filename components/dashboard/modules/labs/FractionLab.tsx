"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { LabShell } from "./LabShell";
import { cn } from "@/lib/cn";

export function FractionLab() {
  const [num, setNum] = useState(3);
  const [den, setDen] = useState(4);
  const clampedN = Math.min(num, den);
  const decimal = clampedN / den;
  const answer = `${clampedN}/${den}  (${decimal.toFixed(2)}, ${Math.round(decimal * 100)}%)`;

  return (
    <LabShell
      kind="fraction"
      title="Design a fraction problem"
      subtitle="Set the numerator and denominator. Write a story about it."
      config={{ num: clampedN, den }}
      computedAnswer={answer}
      storyPlaceholder={`e.g. "A pizza is cut into ${den} equal slices. Sam eats ${clampedN} of them. What fraction did he eat?"`}
      visual={
        <div className="grid gap-4 rounded-2xl bg-mist p-4 ring-1 ring-inset ring-navy-100 sm:grid-cols-[1fr,auto]">
          {/* fraction bar */}
          <div className="flex flex-col justify-center gap-3">
            <div className="flex overflow-hidden rounded-2xl ring-1 ring-inset ring-navy-100">
              {Array.from({ length: den }).map((_, i) => {
                const filled = i < clampedN;
                return (
                  <button
                    key={i}
                    onClick={() => setNum(i + 1)}
                    aria-label={`Set numerator to ${i + 1}`}
                    className="group relative flex-1 border-r border-navy-100/60 last:border-r-0"
                    style={{ height: 72 }}
                  >
                    <motion.div
                      animate={{ opacity: filled ? 1 : 0 }}
                      transition={{ duration: 0.15 }}
                      className="absolute inset-0 bg-gradient-to-b from-orange-400 to-orange-500"
                    />
                    {!filled && <div className="absolute inset-0 bg-white group-hover:bg-orange-50" />}
                    <div className="pointer-events-none relative flex h-full items-center justify-center">
                      <span className={filled ? "font-semibold text-white" : "text-slate-400"}>{i + 1}</span>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="rounded-2xl bg-navy-800 p-3 text-white">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-sky-300">
                My fraction
              </div>
              <div className="mt-1 font-display text-2xl font-semibold">
                <span className="text-orange-300">{clampedN}</span>
                <span className="mx-1 text-white/50">/</span>
                <span className="text-sky-300">{den}</span>
                <span className="ml-3 text-sm text-navy-200">
                  = {decimal.toFixed(2)} ({Math.round(decimal * 100)}%)
                </span>
              </div>
            </div>
          </div>
          {/* controls */}
          <div className="flex flex-col gap-4">
            <Stepper label="Numerator" value={clampedN} onChange={setNum} min={0} max={den} tone="orange" />
            <Stepper label="Denominator" value={den} onChange={setDen} min={1} max={12} tone="sky" />
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
  tone: "orange" | "sky";
}) {
  const chip =
    tone === "orange" ? "bg-orange-50 text-orange-700 ring-orange-200" : "bg-sky-50 text-sky-700 ring-sky-200";
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
        <div className={cn("w-10 text-center font-display text-xl font-semibold text-navy-800 tabular-nums")}>
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
