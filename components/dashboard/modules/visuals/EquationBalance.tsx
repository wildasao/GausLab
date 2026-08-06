"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Scale, ArrowDown } from "lucide-react";

/**
 * Interactive balance for "x + b = c" style equations.
 * Users press "Do the same to both sides" to see the equation simplify.
 */
export function EquationBalance({ equation = "x + 3 = 7" }: { equation?: string }) {
  // Parse "x + b = c" or "x - b = c"
  const parsed = useMemo(() => {
    const m = equation.replace(/\s/g, "").match(/^x([+-])(\d+)=(-?\d+)$/);
    if (!m) return null;
    const sign = m[1] as "+" | "-";
    const b = parseInt(m[2], 10);
    const c = parseInt(m[3], 10);
    return { sign, b, c, solution: sign === "+" ? c - b : c + b };
  }, [equation]);

  const [step, setStep] = useState(0);

  if (!parsed) {
    return (
      <section className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-100">
        <div className="text-sm text-slate-500">Equation: {equation}</div>
      </section>
    );
  }

  const { sign, b, c, solution } = parsed;
  const opposite = sign === "+" ? "−" : "+";
  const stepAfterC = sign === "+" ? c - b : c + b;

  return (
    <section className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-100">
      <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
        Interactive balance
      </div>
      <h3 className="mt-1 font-display text-base font-semibold text-navy-800">
        Do the same thing to both sides — watch it balance.
      </h3>

      {/* Scale visual */}
      <div className="mt-6 grid grid-cols-2 gap-6">
        <Side label="Left side" value={step === 0 ? `x ${sign} ${b}` : "x"} />
        <Side label="Right side" value={step === 0 ? String(c) : String(stepAfterC)} />
      </div>

      <div className="mt-4 flex flex-col items-center gap-2">
        <Scale className="h-6 w-6 text-navy-400" />
        <div className="text-[11px] text-slate-500">
          {step === 0 ? "The scale is balanced — both sides are equal." : "Still balanced — same change on both sides."}
        </div>
      </div>

      {/* Action */}
      {step === 0 ? (
        <button
          type="button"
          onClick={() => setStep(1)}
          className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
        >
          <ArrowDown className="h-4 w-4" />
          Do {opposite}{b} on both sides
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-2xl bg-emerald-50 p-4 ring-1 ring-inset ring-emerald-200"
        >
          <div className="text-[10px] font-semibold uppercase tracking-widest text-emerald-700">
            Solved
          </div>
          <div className="mt-1 font-display text-2xl font-semibold text-emerald-900">
            x = {solution}
          </div>
          <button
            type="button"
            onClick={() => setStep(0)}
            className="mt-3 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
          >
            Reset ↻
          </button>
        </motion.div>
      )}
    </section>
  );
}

function Side({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-navy-800 p-6 text-center text-white shadow-soft">
      <div className="text-[10px] font-semibold uppercase tracking-widest text-sky-300">
        {label}
      </div>
      <motion.div
        key={value}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-2 font-display text-3xl font-semibold"
      >
        {value}
      </motion.div>
    </div>
  );
}
