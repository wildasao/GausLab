"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";

const stats = [
  { value: 2400, suffix: "+", label: "Students tutored across Australia" },
  { value: 92, suffix: "%", label: "Improve at least one NAPLAN band" },
  { value: 4.9, suffix: "/5", label: "Average parent rating", decimals: 1 },
  { value: 12, suffix: " yrs", label: "Combined tutoring experience per tutor" },
];

function useCountUp(target: number, duration = 1400, start = false, decimals = 0) {
  const [value, setValue] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!start) return;
    if (reduce) {
      setValue(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(parseFloat((target * eased).toFixed(decimals)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start, reduce, decimals]);
  return value;
}

function Stat({ v, i, inView }: { v: (typeof stats)[number]; i: number; inView: boolean }) {
  const val = useCountUp(v.value, 1400 + i * 100, inView, v.decimals ?? 0);
  return (
    <div className="relative overflow-hidden rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur">
      <div className="font-display text-4xl font-semibold text-white sm:text-5xl">
        {val.toLocaleString(undefined, {
          minimumFractionDigits: v.decimals ?? 0,
          maximumFractionDigits: v.decimals ?? 0,
        })}
        <span className="text-orange-400">{v.suffix}</span>
      </div>
      <div className="mt-2 max-w-xs text-sm text-navy-200">{v.label}</div>
    </div>
  );
}

export function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-navy-800 py-20 text-white sm:py-24"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(600px 240px at 20% 0%, rgba(14,165,233,0.28), transparent 60%), radial-gradient(500px 220px at 80% 100%, rgba(249,115,22,0.22), transparent 60%)",
        }}
      />
      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-sky-200 ring-1 ring-inset ring-white/15">
            Real results
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-4 font-display text-3xl font-semibold text-white sm:text-4xl"
          >
            Data-backed progress, term after term.
          </motion.h2>
          <p className="mt-3 text-navy-200">
            We track every student&rsquo;s mastery so you can see improvement clearly — in
            reports, in NAPLAN bands, and in your child&rsquo;s attitude toward maths.
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((v, i) => (
            <Stat key={v.label} v={v} i={i} inView={inView} />
          ))}
        </div>
      </Container>
    </section>
  );
}
