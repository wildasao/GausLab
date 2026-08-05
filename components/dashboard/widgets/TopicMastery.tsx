"use client";

import { motion } from "framer-motion";
import { type MasteryRow } from "@/lib/dashboard";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const bandTone: Record<MasteryRow["band"], string> = {
  "Well below": "bg-rose-50 text-rose-700 ring-rose-200",
  Developing: "bg-amber-50 text-amber-700 ring-amber-200",
  Meeting: "bg-sky-50 text-sky-700 ring-sky-200",
  Exceeding: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

const barColor = (m: number) =>
  m >= 90
    ? "from-emerald-400 to-emerald-500"
    : m >= 75
    ? "from-sky-500 to-sky-600"
    : m >= 65
    ? "from-amber-400 to-orange-400"
    : "from-rose-400 to-rose-500";

export function TopicMastery({
  topics,
  studentFirstName = "Student",
}: {
  topics: MasteryRow[];
  studentFirstName?: string;
}) {
  return (
    <section
      aria-labelledby="topic-mastery-title"
      className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-100"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Topic mastery
          </div>
          <h2 id="topic-mastery-title" className="mt-1 font-display text-lg font-semibold text-navy-800">
            Where {studentFirstName} is strongest — and where to focus next.
          </h2>
        </div>
        <button className="text-xs font-semibold text-sky-700 hover:text-sky-800">View all topics →</button>
      </div>
      <ul className="mt-5 space-y-3">
        {topics.map((r, i) => {
          const up = r.delta >= 0;
          return (
            <motion.li
              key={r.topic}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.02 }}
              className="rounded-2xl p-3 ring-1 ring-inset ring-navy-100 hover:bg-mist"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-navy-800">{r.topic}</div>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${bandTone[r.band]}`}
                >
                  {r.band}
                </span>
                <span
                  className={`inline-flex min-w-[52px] items-center justify-end gap-0.5 text-[11px] font-semibold ${
                    up ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                  {up ? "+" : ""}
                  {r.delta}%
                </span>
                <span className="min-w-[42px] text-right font-display text-sm font-semibold text-navy-800">
                  {r.mastery}%
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-navy-50">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${r.mastery}%` }}
                  transition={{ duration: 0.9, delay: i * 0.03, ease: "easeOut" }}
                  className={`h-full rounded-full bg-gradient-to-r ${barColor(r.mastery)}`}
                />
              </div>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
