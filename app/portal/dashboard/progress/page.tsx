"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ProgressChart } from "@/components/dashboard/widgets/ProgressChart";
import { useDashboard } from "@/lib/dashboard-context";
import { useProgressData, type Strand } from "@/lib/progress-data";
import {
  Download,
  TrendingUp,
  Flame,
  CheckCircle2,
  Clock3,
  Sparkles,
  ArrowRight,
  BookOpen,
  Beaker,
  Filter,
  Info,
} from "lucide-react";
import { cn } from "@/lib/cn";

const STRANDS: Strand[] = ["Number & Algebra", "Measurement & Geometry", "Statistics & Probability"];

const STRAND_TONE: Record<Strand, { chip: string; bar: string; dot: string }> = {
  "Number & Algebra": {
    chip: "bg-sky-50 text-sky-700 ring-sky-200",
    bar: "bg-gradient-to-r from-sky-500 to-sky-700",
    dot: "bg-sky-500",
  },
  "Measurement & Geometry": {
    chip: "bg-orange-50 text-orange-700 ring-orange-200",
    bar: "bg-gradient-to-r from-orange-500 to-orange-600",
    dot: "bg-orange-500",
  },
  "Statistics & Probability": {
    chip: "bg-navy-50 text-navy-700 ring-navy-200",
    bar: "bg-gradient-to-r from-navy-600 to-navy-800",
    dot: "bg-navy-700",
  },
};

export default function ProgressPage() {
  const { activeStudent } = useDashboard();
  const data = useProgressData(activeStudent?.id);
  const firstName = activeStudent?.name.split(" ")[0] ?? "Student";
  const [strandFilter, setStrandFilter] = useState<Strand | "All">("All");

  // All hooks MUST run in the same order every render — early returns after
  // a useMemo cause React's hook state to corrupt (surfaces as 'Cannot read
  // properties of undefined' errors in production).
  const filteredModules = useMemo(
    () => (strandFilter === "All" ? data.modules : data.modules.filter((m) => m.strand === strandFilter)),
    [data.modules, strandFilter]
  );

  if (data.loading) {
    return (
      <div className="grid min-h-[40vh] place-items-center">
        <div className="text-sm text-slate-500">Loading progress…</div>
      </div>
    );
  }

  const activeModules = filteredModules.filter((m) => m.attemptedQuestions > 0);
  const untouchedModules = filteredModules.filter((m) => m.attemptedQuestions === 0);
  const hasActivity = data.kpis.totalAttempts > 0;

  return (
    <>
      <PageHeader
        eyebrow="Progress"
        title={`${firstName}'s learning journey`}
        description={
          hasActivity
            ? "Real-time from the work you've done — every question, every lab, every session."
            : "Play a module or create a lab problem — this page fills up automatically as you go."
        }
        actions={
          <button
            className="inline-flex items-center gap-1.5 rounded-full bg-navy-700 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800"
            onClick={() => window.print()}
          >
            <Download className="h-4 w-4" /> Export PDF report
          </button>
        }
      />

      {/* Empty state hero — only when the student has zero attempts */}
      {!hasActivity && !data.loading && (
        <section className="rounded-3xl bg-gradient-to-br from-orange-50 via-white to-sky-50 p-6 ring-1 ring-navy-100 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-orange-700 ring-1 ring-inset ring-orange-200">
                <Sparkles className="h-3 w-3" /> Get started
              </div>
              <h2 className="mt-3 font-display text-xl font-semibold text-navy-800 sm:text-2xl">
                Play a module — this page will light up.
              </h2>
              <p className="mt-1 max-w-md text-sm text-slate-600">
                Every question answered, every problem you invent, every streak you build is tracked
                here in real time.
              </p>
            </div>
            <Link
              href="/portal/dashboard/modules"
              className="inline-flex items-center gap-1.5 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
            >
              Start a module <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      )}

      {/* KPI strip */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi
          label="Questions answered"
          value={data.kpis.totalAttempts}
          sub={`${data.kpis.correct} correct`}
          icon={CheckCircle2}
          tone="text-sky-600"
          chip="bg-sky-50 ring-sky-200"
        />
        <Kpi
          label="Accuracy"
          value={`${data.kpis.accuracyPct}%`}
          sub={data.kpis.accuracyPct >= 80 ? "Excelling" : data.kpis.accuracyPct >= 60 ? "On track" : "Room to grow"}
          icon={TrendingUp}
          tone="text-emerald-600"
          chip="bg-emerald-50 ring-emerald-200"
        />
        <Kpi
          label="Days active (12 wks)"
          value={data.kpis.daysActive}
          sub={`Streak ${data.kpis.currentStreakDays} day${data.kpis.currentStreakDays === 1 ? "" : "s"}`}
          icon={Flame}
          tone="text-orange-600"
          chip="bg-orange-50 ring-orange-200"
        />
        <Kpi
          label="Problems created"
          value={data.kpis.problemsCreated}
          sub={data.kpis.problemsCreated > 0 ? "Author mode ✓" : "Try a lab"}
          icon={Beaker}
          tone="text-fuchsia-600"
          chip="bg-fuchsia-50 ring-fuchsia-200"
        />
      </div>

      {/* Chart + Activity heatmap side-by-side */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <ProgressChart weekly={data.weekly} studentFirstName={firstName} />
        </div>
        <div className="lg:col-span-5">
          <ActivityHeatmap activity={data.activity} />
        </div>
      </div>

      {/* Strand filter */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              By curriculum strand
            </div>
            <h2 className="mt-1 font-display text-lg font-semibold text-navy-800">
              Strand accuracy from real attempts
            </h2>
          </div>
          <div className="inline-flex flex-wrap items-center gap-1 rounded-full bg-white p-1 ring-1 ring-navy-100 shadow-soft">
            <FilterChip label="All" active={strandFilter === "All"} onClick={() => setStrandFilter("All")} />
            {STRANDS.map((s) => (
              <FilterChip
                key={s}
                label={s.split(" ")[0]}
                active={strandFilter === s}
                onClick={() => setStrandFilter(s)}
                dotClass={STRAND_TONE[s].dot}
              />
            ))}
          </div>
        </div>

        {/* Strand bars */}
        <div className="grid gap-4 sm:grid-cols-3">
          {STRANDS.map((s) => {
            const row = data.strands.find((x) => x.strand === s);
            const attempts = row?.attempts ?? 0;
            const acc = row?.accuracyPct ?? 0;
            return (
              <div
                key={s}
                className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-navy-100"
              >
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${STRAND_TONE[s].chip}`}>
                  {s}
                </span>
                <div className="mt-3 flex items-baseline justify-between">
                  <div>
                    <div className="font-display text-3xl font-semibold text-navy-800">{acc}%</div>
                    <div className="text-xs text-slate-500">{attempts} attempts</div>
                  </div>
                  {attempts === 0 && (
                    <Link
                      href="/portal/dashboard/modules"
                      className="text-[11px] font-semibold text-sky-700 hover:text-sky-800"
                    >
                      Try a module →
                    </Link>
                  )}
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-navy-50">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${acc}%` }}
                    transition={{ duration: 0.7 }}
                    className={cn("h-full rounded-full", STRAND_TONE[s].bar)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Modules progress */}
      <section className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-100">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Modules
            </div>
            <h2 className="mt-1 font-display text-lg font-semibold text-navy-800">
              {strandFilter === "All" ? "All modules" : strandFilter}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {activeModules.length} in progress · {untouchedModules.length} not started
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-mist px-3 py-1 text-[11px] font-semibold text-slate-500 ring-1 ring-inset ring-navy-100">
            <Filter className="h-3.5 w-3.5" />
            {filteredModules.length} modules
          </div>
        </div>

        {activeModules.length === 0 && (
          <div className="mt-5 rounded-2xl bg-mist p-6 text-center text-sm text-slate-500 ring-1 ring-inset ring-navy-100">
            Nothing in progress for this filter. Pick a module below to begin.
          </div>
        )}

        {activeModules.length > 0 && (
          <div className="mt-5 space-y-2">
            {activeModules.map((m) => (
              <ModuleRow key={m.slug} m={m} />
            ))}
          </div>
        )}

        {untouchedModules.length > 0 && (
          <>
            <div className="mt-6 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
              Not started
            </div>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {untouchedModules.map((m) => (
                <Link
                  key={m.slug}
                  href={`/portal/dashboard/modules/${m.slug}`}
                  className="group flex items-center justify-between gap-3 rounded-2xl bg-mist p-3 ring-1 ring-inset ring-navy-100 hover:bg-white"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-navy-800">{m.title}</div>
                    <div className="text-[11px] text-slate-500">
                      Year {m.year} · {m.totalLessons} lessons · {m.totalQuestions} questions
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 group-hover:text-sky-800">
                    Start <ArrowRight className="h-3 w-3" />
                  </span>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Recent activity + tutor commentary */}
      <div className="grid gap-6 lg:grid-cols-12">
        <section className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-100 lg:col-span-7">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Recent activity
          </div>
          <h2 className="mt-1 font-display text-lg font-semibold text-navy-800">
            Live feed of every answer & creation
          </h2>
          {data.recent.length === 0 ? (
            <div className="mt-4 rounded-2xl bg-mist p-6 text-center text-sm text-slate-500 ring-1 ring-inset ring-navy-100">
              No activity yet — try a module or a lab.
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-navy-100">
              <AnimatePresence initial={false}>
                {data.recent.map((e, i) => (
                  <motion.li
                    key={`${e.kind}-${e.moduleSlug}-${e.when}-${i}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div
                      className={cn(
                        "grid h-9 w-9 shrink-0 place-items-center rounded-xl ring-1 ring-inset",
                        e.kind === "problem"
                          ? "bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200"
                          : e.correct
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                          : "bg-rose-50 text-rose-700 ring-rose-200"
                      )}
                    >
                      {e.kind === "problem" ? (
                        <Beaker className="h-4 w-4" />
                      ) : e.correct ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Clock3 className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-navy-800">
                        {e.kind === "problem" ? "Created a lab problem" : e.correct ? "Correct answer" : "Missed a question"}
                        {e.moduleTitle && (
                          <>
                            <span className="text-slate-400"> · </span>
                            <Link
                              href={`/portal/dashboard/modules/${e.moduleSlug}`}
                              className="text-slate-600 hover:text-sky-700"
                            >
                              {e.moduleTitle}
                            </Link>
                          </>
                        )}
                      </div>
                      {e.story && (
                        <div className="mt-0.5 line-clamp-2 text-xs text-slate-500">&ldquo;{e.story}&rdquo;</div>
                      )}
                    </div>
                    <div className="shrink-0 text-[11px] text-slate-400">{relative(e.when)}</div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </section>

        <section className="rounded-3xl bg-gradient-to-br from-navy-800 via-navy-700 to-sky-700 p-6 text-white shadow-lift lg:col-span-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-sky-200">
            <TrendingUp className="h-3.5 w-3.5" /> Tutor commentary
          </div>
          <p className="mt-3 text-sm leading-relaxed text-navy-100">
            {hasActivity
              ? `${firstName} has answered ${data.kpis.totalAttempts} questions across ${activeModules.length} module${activeModules.length === 1 ? "" : "s"} — that's real practice, not passive reading. Keep the daily streak alive; the brain builds durable memory during small, spaced sessions.`
              : `Once ${firstName} has played their first module, this box updates with a personalised note from the tutor. Every attempt teaches us more.`}
          </p>
          <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-sky-400 to-sky-600 font-semibold">
              PR
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Ms Priya Rao</div>
              <div className="text-[11px] text-navy-200">Senior tutor · Y3–Y7 specialist</div>
            </div>
          </div>
          <Link
            href="/portal/dashboard/messages"
            className="mt-4 inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-inset ring-white/15 hover:bg-white/15"
          >
            Message tutor <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </section>
      </div>

      {data.source === "demo" && (
        <div className="rounded-2xl bg-slate-50 p-3 text-[11px] text-slate-600 ring-1 ring-inset ring-slate-200">
          <div className="inline-flex items-center gap-1">
            <Info className="h-3.5 w-3.5" /> Live data unavailable — showing a scaffolded view. Sign in and play a module to populate.
          </div>
        </div>
      )}
    </>
  );
}

function Kpi({
  label,
  value,
  sub,
  icon: Icon,
  tone,
  chip,
}: {
  label: string;
  value: number | string;
  sub: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
  chip: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-navy-100">
      <div className="flex items-start justify-between">
        <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-inset ${chip} ${tone}`}>
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">{label}</span>
      </div>
      <div className={`mt-4 font-display text-3xl font-semibold text-navy-800`}>{value}</div>
      <div className="mt-1 text-xs text-slate-500">{sub}</div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
  dotClass,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  dotClass?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
        active ? "bg-navy-700 text-white shadow-soft" : "text-navy-700/70 hover:bg-navy-50"
      )}
    >
      {dotClass && <span className={cn("h-1.5 w-1.5 rounded-full", dotClass)} />}
      {label}
    </button>
  );
}

function ModuleRow({ m }: { m: ReturnType<typeof useProgressData>["modules"][number] }) {
  const [expanded, setExpanded] = useState(false);
  const strand = m.strand;
  const tone = STRAND_TONE[strand];
  return (
    <div className="rounded-2xl bg-mist p-4 ring-1 ring-inset ring-navy-100">
      <button
        type="button"
        onClick={() => setExpanded((x) => !x)}
        className="flex w-full items-center gap-3"
      >
        <div className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-white", m.color)}>
          <BookOpen className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1 text-left">
          <div className="flex flex-wrap items-center gap-2">
            <span className="truncate text-sm font-semibold text-navy-800">{m.title}</span>
            <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${tone.chip}`}>
              Year {m.year}
            </span>
          </div>
          <div className="mt-0.5 text-[11px] text-slate-500">
            {m.attemptedQuestions}/{m.totalQuestions} questions · {m.accuracyPct}% accuracy · last played {relative(m.lastPlayedAt)}
          </div>
        </div>
        <div className="text-right">
          <div className="font-display text-lg font-semibold text-navy-800 tabular-nums">
            {m.coveragePct}%
          </div>
          <div className="text-[10px] uppercase tracking-widest text-slate-400">covered</div>
        </div>
      </button>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="h-1.5 overflow-hidden rounded-full bg-white ring-1 ring-inset ring-navy-100">
          <div className={cn("h-full rounded-full", tone.bar)} style={{ width: `${m.coveragePct}%` }} />
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white ring-1 ring-inset ring-navy-100">
          <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500" style={{ width: `${m.accuracyPct}%` }} />
        </div>
      </div>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-navy-100 pt-3">
              <div className="text-[11px] text-slate-500">
                <span className="mr-3 inline-flex items-center gap-1">
                  <span className={cn("h-2 w-2 rounded-full", tone.dot)} /> Coverage bar
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> Accuracy bar
                </span>
              </div>
              <Link
                href={`/portal/dashboard/modules/${m.slug}`}
                className="inline-flex items-center gap-1 rounded-full bg-navy-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-navy-800"
              >
                {m.coveragePct >= 100 ? "Review" : "Continue"} <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ActivityHeatmap({
  activity,
}: {
  activity: ReturnType<typeof useProgressData>["activity"];
}) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...activity.map((c) => c.count));

  // Arrange into 12 columns (weeks) × 7 rows (days). Cells[weekIdx][dayIdx]
  const weeks = Array.from({ length: 12 }, (_, w) => activity.slice(w * 7, w * 7 + 7));
  const active = hover !== null ? activity[hover] : null;

  return (
    <section className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-100">
      <div className="flex items-baseline justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Activity · last 12 weeks
          </div>
          <h3 className="mt-1 font-display text-base font-semibold text-navy-800">
            When and how much you practise
          </h3>
        </div>
      </div>

      <div className="mt-4 flex gap-1">
        {weeks.map((week, w) => (
          <div key={w} className="flex flex-1 flex-col gap-1">
            {week.map((cell, d) => {
              const idx = w * 7 + d;
              const intensity = cell.count === 0 ? 0 : Math.min(1, cell.count / max);
              const bg =
                cell.count === 0
                  ? "bg-navy-50"
                  : intensity > 0.75
                  ? "bg-emerald-500"
                  : intensity > 0.5
                  ? "bg-emerald-400"
                  : intensity > 0.25
                  ? "bg-sky-400"
                  : "bg-sky-200";
              return (
                <button
                  key={cell.date}
                  type="button"
                  onMouseEnter={() => setHover(idx)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(idx)}
                  onBlur={() => setHover(null)}
                  aria-label={`${cell.date}: ${cell.count} attempts, ${cell.correct} correct`}
                  className={cn("aspect-square rounded-[3px] transition-transform hover:scale-125", bg)}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500">
        <span>Less</span>
        <div className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-[3px] bg-navy-50" />
          <span className="h-3 w-3 rounded-[3px] bg-sky-200" />
          <span className="h-3 w-3 rounded-[3px] bg-sky-400" />
          <span className="h-3 w-3 rounded-[3px] bg-emerald-400" />
          <span className="h-3 w-3 rounded-[3px] bg-emerald-500" />
        </div>
        <span>More</span>
      </div>

      {active && (
        <div className="mt-3 rounded-xl bg-navy-800 px-3 py-2 text-xs text-white">
          <div className="font-semibold">
            {new Date(active.date).toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "short" })}
          </div>
          <div className="text-navy-200">
            {active.count === 0 ? "No activity" : `${active.count} attempts · ${active.correct} correct`}
          </div>
        </div>
      )}
    </section>
  );
}

function relative(iso: string | null | undefined): string {
  if (!iso) return "never";
  const t = new Date(iso).getTime();
  const s = (Date.now() - t) / 1000;
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.round(s / 60)}m ago`;
  if (s < 86400) return `${Math.round(s / 3600)}h ago`;
  if (s < 604800) return `${Math.round(s / 86400)}d ago`;
  return new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "short" });
}
