"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";

export function PlaceValueBlocks({ start = 342 }: { start?: number }) {
  const [n, setN] = useState(Math.max(0, Math.min(999, start)));
  const hundreds = Math.floor(n / 100);
  const tens = Math.floor((n % 100) / 10);
  const ones = n % 10;

  return (
    <section className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-100">
      <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
        Interactive place-value blocks
      </div>
      <h3 className="mt-1 font-display text-base font-semibold text-navy-800">
        Change the number — watch the blocks rearrange.
      </h3>

      {/* number display */}
      <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl bg-navy-800 p-5 text-white">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-widest text-sky-300">
            Number
          </div>
          <div className="mt-1 font-display text-4xl font-semibold tabular-nums">{n}</div>
          <div className="mt-1 text-xs text-navy-200">
            Expanded: <span className="font-semibold text-white">{hundreds * 100} + {tens * 10} + {ones}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StepButton onClick={() => setN((v) => Math.max(0, v - 100))} label="-100" />
          <StepButton onClick={() => setN((v) => Math.max(0, v - 10))} label="-10" />
          <StepButton onClick={() => setN((v) => Math.max(0, v - 1))} label="-1" />
          <StepButton onClick={() => setN((v) => Math.min(999, v + 1))} label="+1" />
          <StepButton onClick={() => setN((v) => Math.min(999, v + 10))} label="+10" />
          <StepButton onClick={() => setN((v) => Math.min(999, v + 100))} label="+100" />
        </div>
      </div>

      {/* blocks display */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Column label="Hundreds" count={hundreds} tone="emerald">
          {Array.from({ length: hundreds }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.02 }}
              className="grid h-20 w-20 grid-cols-10 grid-rows-10 gap-[1px] bg-emerald-600 p-0.5"
              aria-label="Hundred block"
            >
              {Array.from({ length: 100 }).map((_, k) => (
                <div key={k} className="bg-emerald-400" />
              ))}
            </motion.div>
          ))}
        </Column>
        <Column label="Tens" count={tens} tone="sky">
          {Array.from({ length: tens }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.02 }}
              className="grid h-20 w-4 grid-cols-1 grid-rows-10 gap-[1px] bg-sky-600 p-0.5"
              aria-label="Ten block"
            >
              {Array.from({ length: 10 }).map((_, k) => (
                <div key={k} className="bg-sky-400" />
              ))}
            </motion.div>
          ))}
        </Column>
        <Column label="Ones" count={ones} tone="orange">
          {Array.from({ length: ones }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.02 }}
              className="h-4 w-4 rounded-sm bg-orange-500 ring-1 ring-inset ring-orange-600"
              aria-label="One block"
            />
          ))}
        </Column>
      </div>
    </section>
  );
}

function StepButton({ onClick, label }: { onClick: () => void; label: string }) {
  const isPlus = label.startsWith("+");
  return (
    <button
      type="button"
      onClick={onClick}
      className={`grid h-9 min-w-[38px] place-items-center rounded-full px-2 text-[11px] font-semibold ring-1 ring-inset transition-colors ${
        isPlus
          ? "bg-orange-500 text-white ring-orange-500 hover:bg-orange-600"
          : "bg-white/10 text-white ring-white/20 hover:bg-white/20"
      }`}
    >
      {isPlus ? <Plus className="mr-0.5 h-3 w-3" /> : <Minus className="mr-0.5 h-3 w-3" />}
      {label.replace(/^[+-]/, "")}
    </button>
  );
}

function Column({
  label,
  count,
  tone,
  children,
}: {
  label: string;
  count: number;
  tone: "emerald" | "sky" | "orange";
  children: React.ReactNode;
}) {
  const chip =
    tone === "emerald"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : tone === "sky"
      ? "bg-sky-50 text-sky-700 ring-sky-200"
      : "bg-orange-50 text-orange-700 ring-orange-200";
  return (
    <div className="rounded-2xl bg-mist p-4 ring-1 ring-inset ring-navy-100">
      <div className="flex items-center justify-between">
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${chip}`}>
          {label}
        </span>
        <span className="font-display text-lg font-semibold text-navy-800 tabular-nums">{count}</span>
      </div>
      <div className="mt-3 flex min-h-[88px] flex-wrap items-end gap-2">
        {count === 0 ? (
          <div className="grid h-20 w-full place-items-center text-[11px] text-slate-400">
            — none —
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
