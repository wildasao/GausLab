"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import type { Student } from "@/lib/dashboard";

export function HeroBanner({
  student,
  days,
  parentName,
}: {
  student: Student;
  days: number;
  parentName?: string;
}) {
  const firstName = parentName?.split(" ")[0] || "there";
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-800 via-navy-700 to-sky-700 p-6 text-white shadow-lift sm:p-8"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(500px 220px at 15% 0%, rgba(14,165,233,0.35), transparent 60%), radial-gradient(500px 220px at 90% 100%, rgba(249,115,22,0.28), transparent 60%)",
        }}
      />
      <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-sky-100 ring-1 ring-inset ring-white/15">
            <Sparkles className="h-3.5 w-3.5 text-orange-300" /> Welcome back, {firstName}
          </div>
          <h1 className="mt-3 font-display text-2xl font-semibold text-white sm:text-3xl">
            {student.name} is on track for Band {student.targetBand} in NAPLAN Y{student.year}.
          </h1>
          <p className="mt-2 max-w-lg text-sm text-navy-100">
            Mastery has grown{" "}
            <span className="font-semibold text-emerald-300">+26 points</span> since the
            start of term. Keep the streak going — {student.name.split(" ")[0]} has been at it{" "}
            <span className="font-semibold text-white">{student.streakDays} days</span> in a row.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <MiniStat label="Days to NAPLAN" value={days} accent="text-orange-300" />
          <MiniStat label="Current band" value={student.currentBand} accent="text-sky-300" />
          <MiniStat label="Target band" value={student.targetBand} accent="text-emerald-300" />
        </div>
      </div>

      <div className="relative mt-6 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center">
        <div className="text-sm text-navy-100">
          Next lesson —{" "}
          <span className="font-semibold text-white">{student.nextLesson.topic}</span> ·{" "}
          {student.nextLesson.startsAt} with {student.nextLesson.tutor}
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600">
          Join lesson <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </motion.section>
  );
}

function MiniStat({ label, value, accent }: { label: string; value: number | string; accent: string }) {
  return (
    <div className="rounded-2xl bg-white/5 p-3 text-center ring-1 ring-white/10">
      <div className={`font-display text-2xl font-semibold ${accent} sm:text-3xl`}>
        {value}
      </div>
      <div className="mt-0.5 text-[10px] uppercase tracking-widest text-navy-200">
        {label}
      </div>
    </div>
  );
}
