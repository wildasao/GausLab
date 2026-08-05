"use client";

import { motion } from "framer-motion";
import { Flame, Clock3, TrendingUp, Trophy } from "lucide-react";
import type { Student } from "@/lib/dashboard";

export function KpiCards({ student }: { student: Student }) {
  const cards = [
    {
      icon: TrendingUp,
      label: "Mastery",
      value: `${student.mastery}%`,
      trend: "+6% vs last month",
      tone: "text-sky-600",
      chip: "bg-sky-50 ring-sky-200",
    },
    {
      icon: Flame,
      label: "Practice streak",
      value: `${student.streakDays} days`,
      trend: "Personal best!",
      tone: "text-orange-600",
      chip: "bg-orange-50 ring-orange-200",
    },
    {
      icon: Clock3,
      label: "Hours this term",
      value: `${student.hoursThisTerm}h`,
      trend: "+4h vs plan",
      tone: "text-emerald-600",
      chip: "bg-emerald-50 ring-emerald-200",
    },
    {
      icon: Trophy,
      label: "Badges earned",
      value: "17",
      trend: "3 new this week",
      tone: "text-navy-700",
      chip: "bg-navy-50 ring-navy-200",
    },
  ];
  return (
    <section aria-label="Key metrics" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c, i) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.04 }}
          className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-navy-100"
        >
          <div className="flex items-start justify-between">
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-inset ${c.chip} ${c.tone}`}>
              <c.icon className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              {c.label}
            </span>
          </div>
          <div className={`mt-4 font-display text-3xl font-semibold text-navy-800`}>{c.value}</div>
          <div className="mt-1 text-xs text-slate-500">{c.trend}</div>
        </motion.div>
      ))}
    </section>
  );
}
