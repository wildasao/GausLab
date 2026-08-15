"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import type { StrandTone } from "@/lib/assessment";

const TONE_STROKE: Record<StrandTone, string> = {
  excelling: "#10B981",
  solid: "#0EA5E9",
  developing: "#F59E0B",
  priority: "#F97316",
  "small-sample": "#94A3B8",
};

const TONE_TEXT: Record<StrandTone, string> = {
  excelling: "text-emerald-700",
  solid: "text-sky-700",
  developing: "text-amber-700",
  priority: "text-orange-700",
  "small-sample": "text-slate-600",
};

const TONE_CHIP: Record<StrandTone, string> = {
  excelling: "bg-emerald-50 ring-emerald-200",
  solid: "bg-sky-50 ring-sky-200",
  developing: "bg-amber-50 ring-amber-200",
  priority: "bg-orange-50 ring-orange-200",
  "small-sample": "bg-slate-100 ring-slate-200",
};

export function StrandRing({
  label,
  pct,
  correct,
  total,
  tone,
  headline,
}: {
  label: string;
  pct: number;
  correct: number;
  total: number;
  tone: StrandTone;
  headline: string;
}) {
  const R = 42;
  const C = 2 * Math.PI * R;
  const dash = (pct / 100) * C;
  const stroke = TONE_STROKE[tone];

  return (
    <div className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-navy-100">
      <div className="flex items-center gap-4">
        <div className="relative grid h-24 w-24 shrink-0 place-items-center">
          <svg viewBox="0 0 100 100" className="h-24 w-24 -rotate-90">
            <circle cx="50" cy="50" r={R} stroke="rgba(11,30,63,0.08)" strokeWidth="9" fill="none" />
            <motion.circle
              cx="50"
              cy="50"
              r={R}
              stroke={stroke}
              strokeWidth="9"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDasharray: `0 ${C}` }}
              animate={{ strokeDasharray: `${dash} ${C}` }}
              transition={{ duration: 1.1, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute flex flex-col items-center leading-none">
            <div className="font-display text-xl font-semibold text-navy-800">{pct}%</div>
            <div className="mt-0.5 text-[9px] uppercase tracking-widest text-slate-500">
              {correct}/{total}
            </div>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            {label}
          </div>
          <span
            className={cn(
              "mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset",
              TONE_CHIP[tone],
              TONE_TEXT[tone]
            )}
          >
            {headline}
          </span>
        </div>
      </div>
    </div>
  );
}
