"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Eye, EyeOff } from "lucide-react";

export function Example({
  problem,
  steps,
  answer,
}: {
  problem: string;
  steps: string[];
  answer: string;
}) {
  const [revealed, setRevealed] = useState(0);
  const done = revealed >= steps.length;

  return (
    <section className="rounded-3xl bg-navy-800 p-6 text-white shadow-lift">
      <div className="text-[11px] font-semibold uppercase tracking-widest text-sky-300">
        Worked example
      </div>
      <p className="mt-2 text-base leading-relaxed">{problem}</p>

      <div className="mt-5 space-y-2">
        <AnimatePresence initial={false}>
          {steps.slice(0, revealed).map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="flex items-start gap-3 rounded-2xl bg-white/5 p-3 ring-1 ring-white/10"
            >
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sky-500 text-[11px] font-semibold">
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed text-navy-50">{s}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {done && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-center gap-2 rounded-2xl bg-emerald-500/15 p-3 ring-1 ring-inset ring-emerald-400/40"
        >
          <div className="text-[10px] font-semibold uppercase tracking-widest text-emerald-300">
            Answer
          </div>
          <div className="font-display text-lg font-semibold text-white">{answer}</div>
        </motion.div>
      )}

      <div className="mt-5 flex items-center justify-between">
        {!done ? (
          <button
            type="button"
            onClick={() => setRevealed((v) => v + 1)}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-navy-800 hover:bg-white/90"
          >
            <Eye className="h-3.5 w-3.5" />
            {revealed === 0 ? "Show first step" : "Next step"}
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setRevealed(0)}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white ring-1 ring-inset ring-white/15 hover:bg-white/20"
          >
            <EyeOff className="h-3.5 w-3.5" /> Hide solution
          </button>
        )}
        <div className="text-[11px] text-navy-300">
          {revealed} / {steps.length} steps revealed
        </div>
      </div>
    </section>
  );
}
