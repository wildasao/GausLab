"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { LabShell } from "./LabShell";

export function PlaceValueLab() {
  const [n, setN] = useState(342);
  const hundreds = Math.floor(n / 100);
  const tens = Math.floor((n % 100) / 10);
  const ones = n % 10;

  const answer = `${n} = ${hundreds * 100} + ${tens * 10} + ${ones}`;

  return (
    <LabShell
      kind="place-value"
      title="Design a place-value problem"
      subtitle="Build a number with the blocks. Write a question about it (e.g. 'What is the value of the 3?')."
      config={{ n, hundreds, tens, ones }}
      computedAnswer={answer}
      storyPlaceholder={`e.g. "What is the value of the digit ${Math.floor(n / 100) || 3} in ${n}?"`}
      visual={
        <div className="grid gap-4 rounded-2xl bg-mist p-4 ring-1 ring-inset ring-navy-100">
          {/* number + steppers */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                Number
              </div>
              <div className="mt-1 font-display text-3xl font-semibold text-navy-800 tabular-nums">
                {n}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Step label="-100" onClick={() => setN((v) => Math.max(0, v - 100))} />
              <Step label="-10" onClick={() => setN((v) => Math.max(0, v - 10))} />
              <Step label="-1" onClick={() => setN((v) => Math.max(0, v - 1))} />
              <Step label="+1" onClick={() => setN((v) => Math.min(999, v + 1))} tone="orange" />
              <Step label="+10" onClick={() => setN((v) => Math.min(999, v + 10))} tone="orange" />
              <Step label="+100" onClick={() => setN((v) => Math.min(999, v + 100))} tone="orange" />
            </div>
          </div>

          {/* blocks */}
          <div className="grid gap-3 sm:grid-cols-3">
            <Column label={`Hundreds (${hundreds})`} tone="emerald">
              {Array.from({ length: hundreds }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="grid h-12 w-12 grid-cols-10 grid-rows-10 gap-[1px] bg-emerald-600 p-0.5"
                >
                  {Array.from({ length: 100 }).map((_, k) => (
                    <div key={k} className="bg-emerald-400" />
                  ))}
                </motion.div>
              ))}
            </Column>
            <Column label={`Tens (${tens})`} tone="sky">
              {Array.from({ length: tens }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="grid h-12 w-3 grid-cols-1 grid-rows-10 gap-[1px] bg-sky-600 p-0.5"
                >
                  {Array.from({ length: 10 }).map((_, k) => (
                    <div key={k} className="bg-sky-400" />
                  ))}
                </motion.div>
              ))}
            </Column>
            <Column label={`Ones (${ones})`} tone="orange">
              {Array.from({ length: ones }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="h-3 w-3 rounded-sm bg-orange-500 ring-1 ring-inset ring-orange-600"
                />
              ))}
            </Column>
          </div>

          <div className="rounded-2xl bg-navy-800 p-3 text-center text-white">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-sky-300">
              Expanded form
            </div>
            <div className="mt-1 font-display text-lg font-semibold">
              {hundreds * 100} + {tens * 10} + {ones} = <span className="text-orange-300">{n}</span>
            </div>
          </div>
        </div>
      }
    />
  );
}

function Step({ label, onClick, tone }: { label: string; onClick: () => void; tone?: "orange" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-0.5 rounded-full px-3 py-1 text-[11px] font-semibold ring-1 ring-inset ${
        tone === "orange"
          ? "bg-orange-500 text-white ring-orange-500 hover:bg-orange-600"
          : "bg-white text-navy-700 ring-navy-100 hover:bg-navy-50"
      }`}
    >
      {label.startsWith("+") ? <Plus className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
      {label.replace(/^[+-]/, "")}
    </button>
  );
}

function Column({
  label,
  tone,
  children,
}: {
  label: string;
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
    <div className="rounded-2xl bg-white p-3 ring-1 ring-inset ring-navy-100">
      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${chip}`}>
        {label}
      </span>
      <div className="mt-2 flex min-h-[56px] flex-wrap items-end gap-1.5">{children}</div>
    </div>
  );
}
