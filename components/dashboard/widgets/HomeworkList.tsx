"use client";

import type { HomeworkTask } from "@/lib/dashboard";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

const tone: Record<string, string> = {
  sky: "bg-sky-500",
  orange: "bg-orange-500",
  navy: "bg-navy-700",
  emerald: "bg-emerald-500",
};

export function HomeworkList({ homework }: { homework: HomeworkTask[] }) {
  return (
    <section
      aria-labelledby="homework-title"
      className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-100"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Homework
          </div>
          <h2 id="homework-title" className="mt-1 font-display text-lg font-semibold text-navy-800">
            Tasks to complete
          </h2>
        </div>
        <span className="rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-semibold text-orange-700 ring-1 ring-inset ring-orange-200">
          {homework.length} open
        </span>
      </div>
      <ul className="mt-5 space-y-3">
        {homework.length === 0 && (
          <li className="rounded-2xl bg-mist p-6 text-center text-sm text-slate-500">All caught up!</li>
        )}
        {homework.map((h) => {
          const pct = Math.round((h.progress / h.totalQuestions) * 100);
          return (
            <li
              key={h.id}
              className="group rounded-2xl bg-mist p-4 ring-1 ring-inset ring-navy-100 transition-colors hover:bg-navy-50/60"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn("h-2 w-2 shrink-0 rounded-full", tone[h.strandColor])}
                      aria-hidden
                    />
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                      {h.strand}
                    </span>
                  </div>
                  <div className="mt-1 truncate text-sm font-semibold text-navy-800">
                    {h.title}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">
                    {h.dueIn} · {h.progress}/{h.totalQuestions} questions
                  </div>
                </div>
                <button className="inline-flex shrink-0 items-center gap-1 rounded-full bg-navy-700 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-navy-800">
                  {h.progress === 0 ? "Start" : "Resume"} <ArrowRight className="h-3 w-3" />
                </button>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white ring-1 ring-inset ring-navy-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-500 to-orange-400"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
