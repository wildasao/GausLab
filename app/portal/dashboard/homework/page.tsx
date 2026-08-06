"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useDashboard } from "@/lib/dashboard-context";
import { ArrowRight, Clock, CheckCircle2, Filter, Star } from "lucide-react";
import type { HomeworkTask } from "@/lib/dashboard";
import { cn } from "@/lib/cn";

const dot: Record<string, string> = {
  sky: "bg-sky-500",
  orange: "bg-orange-500",
  navy: "bg-navy-700",
  emerald: "bg-emerald-500",
};

type Filter = "open" | "completed" | "all";

// Enrich real homework rows with UI-only extras
function enrich(h: HomeworkTask) {
  const pct = Math.round((h.progress / h.totalQuestions) * 100);
  const status: "not-started" | "in-progress" | "completed" =
    pct >= 100 ? "completed" : pct > 0 ? "in-progress" : "not-started";
  const estMinutes = h.totalQuestions * 3;
  return { ...h, pct, status, estMinutes };
}

const COMPLETED: HomeworkTask[] = [
  { id: "c-1", title: "Equivalent fractions drill",   dueIn: "Completed 4 Aug", progress: 10, totalQuestions: 10, strand: "Fractions", strandColor: "sky" },
  { id: "c-2", title: "Decimal operations quiz",       dueIn: "Completed 2 Aug", progress: 8,  totalQuestions: 8,  strand: "Number",    strandColor: "sky" },
  { id: "c-3", title: "Percentages of amounts",        dueIn: "Completed 30 Jul", progress: 12, totalQuestions: 12, strand: "Number",   strandColor: "sky" },
  { id: "c-4", title: "Angles on parallel lines",      dueIn: "Completed 27 Jul", progress: 6,  totalQuestions: 6,  strand: "Geometry", strandColor: "orange" },
];

export default function HomeworkPage() {
  const { homework, activeStudent } = useDashboard();
  const firstName = activeStudent.name.split(" ")[0];
  const [filter, setFilter] = useState<Filter>("open");

  const rows = useMemo(() => {
    const source = filter === "completed" ? COMPLETED : filter === "all" ? [...homework, ...COMPLETED] : homework;
    return source.map(enrich);
  }, [filter, homework]);

  const openCount = homework.length;
  const completedCount = COMPLETED.length;
  const streak = activeStudent.streakDays;
  const avgScore = 91;

  return (
    <>
      <PageHeader
        eyebrow="Homework"
        title={`${firstName}'s practice queue`}
        description="Every task is scoped to a strand your tutor is targeting this term."
        actions={
          <button className="inline-flex items-center gap-1.5 rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600">
            Ask AI Tutor for a hint
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <Stat label="Open tasks" value={openCount} tone="text-orange-600" />
        <Stat label="Completed this term" value={completedCount} tone="text-emerald-600" />
        <Stat label="Average score" value={`${avgScore}%`} tone="text-sky-600" />
        <Stat label="Practice streak" value={`${streak} days`} tone="text-navy-700" />
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-1 rounded-full bg-white p-1 ring-1 ring-navy-100 shadow-soft">
          {(["open", "completed", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition-colors",
                filter === f ? "bg-navy-700 text-white" : "text-navy-700/70 hover:bg-navy-50"
              )}
            >
              {f} {f === "open" ? `· ${openCount}` : f === "completed" ? `· ${completedCount}` : ""}
            </button>
          ))}
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-navy-700/70 ring-1 ring-navy-100">
          <Filter className="h-3.5 w-3.5" /> All strands · This term
        </div>
      </div>

      {/* Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {rows.map((h) => (
          <article
            key={h.id}
            className="group flex h-full flex-col rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-100 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={cn("h-2 w-2 rounded-full", dot[h.strandColor])} />
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                    {h.strand}
                  </span>
                </div>
                <h3 className="mt-1 font-display text-base font-semibold text-navy-800">
                  {h.title}
                </h3>
              </div>
              <StatusBadge status={h.status} />
            </div>

            <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500">
              <div className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {h.status === "completed" ? h.dueIn : `${h.dueIn} · ~${h.estMinutes} min`}
              </div>
              <div>
                <span className="font-semibold text-navy-800">
                  {h.progress}/{h.totalQuestions}
                </span>{" "}
                questions
              </div>
            </div>

            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-mist ring-1 ring-inset ring-navy-100">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  h.status === "completed"
                    ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                    : "bg-gradient-to-r from-sky-500 to-orange-400"
                )}
                style={{ width: `${h.pct}%` }}
              />
            </div>

            <div className="mt-5 flex items-center justify-between">
              <div className="flex items-center gap-1 text-[11px] font-semibold text-navy-700/70">
                {h.status === "completed" ? (
                  <>
                    <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" /> Score 96%
                  </>
                ) : (
                  <>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> On track
                  </>
                )}
              </div>
              {h.status !== "completed" ? (
                <button className="inline-flex items-center gap-1 rounded-full bg-navy-700 px-4 py-2 text-xs font-semibold text-white hover:bg-navy-800">
                  {h.status === "not-started" ? "Start now" : "Resume"} <ArrowRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                <button className="inline-flex items-center gap-1 rounded-full bg-navy-50 px-4 py-2 text-xs font-semibold text-navy-700 hover:bg-navy-100">
                  Review answers
                </button>
              )}
            </div>
          </article>
        ))}
        {rows.length === 0 && (
          <div className="col-span-full rounded-3xl bg-white p-12 text-center text-slate-500 ring-1 ring-navy-100">
            No homework in this view.
          </div>
        )}
      </div>
    </>
  );
}

function Stat({ label, value, tone }: { label: string; value: number | string; tone: string }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-navy-100">
      <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">{label}</div>
      <div className={`mt-2 font-display text-3xl font-semibold ${tone}`}>{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: "not-started" | "in-progress" | "completed" }) {
  const map = {
    "not-started": { label: "Not started", tone: "bg-slate-100 text-slate-600 ring-slate-200" },
    "in-progress": { label: "In progress", tone: "bg-orange-50 text-orange-700 ring-orange-200" },
    completed: { label: "Completed", tone: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  } as const;
  const { label, tone } = map[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1 ring-inset ${tone}`}>
      {status === "completed" && <CheckCircle2 className="h-3 w-3" />}
      {label}
    </span>
  );
}
