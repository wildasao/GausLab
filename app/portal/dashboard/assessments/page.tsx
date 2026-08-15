"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useAssessmentHistory, type PastResult } from "@/lib/assessment-history";
import { StrandRing } from "@/components/assessment/StrandRing";
import { buildFeedback, type AssessmentYear, type ScoreBreakdown, type Strand } from "@/lib/assessment";
import {
  Gauge,
  ArrowRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Calendar,
  Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/cn";

const YEAR_TONE: Record<AssessmentYear, string> = {
  3: "from-emerald-500 to-emerald-600",
  5: "from-sky-500 to-sky-700",
  7: "from-orange-500 to-orange-600",
  9: "from-navy-700 to-navy-900",
};

// Turn stored per-strand JSON back into a proper ScoreBreakdown shape
function toBreakdown(r: PastResult): ScoreBreakdown {
  const perStrand: ScoreBreakdown["perStrand"] = r.perStrand ?? {
    "Number & Algebra": { total: 0, correct: 0, pct: 0 },
    "Measurement & Geometry": { total: 0, correct: 0, pct: 0 },
    "Statistics & Probability": { total: 0, correct: 0, pct: 0 },
  };
  return {
    total: r.scoreTotal,
    correct: r.scoreCorrect,
    pct: r.scorePct,
    perStrand,
    bandEstimate: { low: 0, high: 0, label: r.bandEstimate ?? "" },
  };
}

export default function AssessmentsHistoryPage() {
  const { rows, loading, error, refresh } = useAssessmentHistory();
  const [openId, setOpenId] = useState<string | null>(null);

  // Group by year and sort ascending for the trend chart
  const byYear = useMemo(() => {
    const m = new Map<AssessmentYear, PastResult[]>();
    rows.forEach((r) => {
      const arr = m.get(r.year) ?? [];
      arr.push(r);
      m.set(r.year, arr);
    });
    // Sort ascending by createdAt within each year
    m.forEach((arr) => arr.sort((a, b) => a.createdAt.localeCompare(b.createdAt)));
    return m;
  }, [rows]);

  const kpis = useMemo(() => {
    if (rows.length === 0) return { taken: 0, best: 0, latest: 0 };
    const best = Math.max(...rows.map((r) => r.scorePct));
    const latest = rows[0].scorePct;
    return { taken: rows.length, best, latest };
  }, [rows]);

  return (
    <>
      <PageHeader
        eyebrow="Diagnostic history"
        title="Every assessment, every time"
        description="Your child's full diagnostic history — with per-strand breakdowns, band estimates and personalised feedback. Nothing is ever lost."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={refresh}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-navy-700 ring-1 ring-navy-100 hover:bg-navy-50"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </button>
            <Link
              href="/assessment"
              className="inline-flex items-center gap-1.5 rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
            >
              <Sparkles className="h-4 w-4" /> Take new diagnostic
            </Link>
          </div>
        }
      />

      {/* KPI strip */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Kpi label="Diagnostics taken" value={kpis.taken} tone="text-navy-700" />
        <Kpi label="Best result" value={`${kpis.best}%`} tone="text-emerald-600" />
        <Kpi label="Latest result" value={`${kpis.latest}%`} tone="text-sky-600" />
      </div>

      {error && (
        <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-inset ring-rose-200">
          {error}
        </div>
      )}

      {/* Trend charts (one per year with 2+ attempts) */}
      {Array.from(byYear.entries())
        .filter(([, arr]) => arr.length >= 2)
        .map(([year, arr]) => (
          <TrendCard key={year} year={year} attempts={arr} />
        ))}

      {/* List */}
      {loading ? (
        <div className="rounded-3xl bg-white p-12 text-center text-sm text-slate-500 ring-1 ring-navy-100">
          Loading your history…
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-3xl bg-white p-12 text-center ring-1 ring-navy-100">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-navy-50 text-navy-700">
            <Gauge className="h-6 w-6" />
          </div>
          <h3 className="mt-4 font-display text-lg font-semibold text-navy-800">
            No diagnostics taken yet
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Take your first 5-minute assessment — your result and personalised feedback will
            appear here forever.
          </p>
          <Link
            href="/assessment"
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
          >
            Take diagnostic <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => (
            <HistoryCard key={r.id} row={r} open={openId === r.id} onToggle={() => setOpenId(openId === r.id ? null : r.id)} />
          ))}
        </ul>
      )}
    </>
  );
}

function Kpi({ label, value, tone }: { label: string; value: number | string; tone: string }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-navy-100">
      <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
        {label}
      </div>
      <div className={`mt-2 font-display text-3xl font-semibold ${tone}`}>{value}</div>
    </div>
  );
}

function HistoryCard({
  row,
  open,
  onToggle,
}: {
  row: PastResult;
  open: boolean;
  onToggle: () => void;
}) {
  const feedback = useMemo(() => buildFeedback(row.year, toBreakdown(row)), [row]);
  const dateStr = new Date(row.createdAt).toLocaleString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <article className="overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-navy-100">
      {/* Row header (clickable) */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-mist"
      >
        <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${YEAR_TONE[row.year]} text-white shadow-soft`}>
          <span className="font-display text-lg font-semibold">Y{row.year}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="font-display text-base font-semibold text-navy-800">
              Year {row.year} Diagnostic
            </span>
            <span className="text-xs text-slate-500">
              {row.bandEstimate ?? "—"}
            </span>
          </div>
          <div className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-slate-500">
            <Calendar className="h-3 w-3" /> {dateStr}
          </div>
        </div>
        <div className="text-right">
          <div className="font-display text-2xl font-semibold text-navy-800">{row.scorePct}%</div>
          <div className="text-[11px] text-slate-500">
            {row.scoreCorrect}/{row.scoreTotal} correct
          </div>
        </div>
        <div className="ml-2">
          {open ? (
            <ChevronUp className="h-4 w-4 text-navy-700" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          )}
        </div>
      </button>

      {/* Expanded detail */}
      {open && (
        <div className="border-t border-navy-100 p-5 sm:p-6">
          <div className="rounded-2xl bg-orange-50 p-4 ring-1 ring-inset ring-orange-200">
            <div className="flex items-start gap-2">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" />
              <p className="text-sm leading-relaxed text-navy-800">{feedback.overall}</p>
            </div>
          </div>
          {row.perStrand && (
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {feedback.strands.map((s) => {
                const stats = row.perStrand![s.strand as Strand];
                return (
                  <StrandRing
                    key={s.strand}
                    label={s.strand}
                    pct={stats.pct}
                    correct={stats.correct}
                    total={stats.total}
                    tone={s.tone}
                    headline={s.headline}
                  />
                );
              })}
            </div>
          )}
          {row.perStrand && (
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {feedback.strands.map((s) => (
                <div key={"body-" + s.strand} className="rounded-2xl bg-mist p-3 text-[12px] leading-relaxed text-slate-700 ring-1 ring-inset ring-navy-100">
                  <div className="font-semibold text-navy-800">{s.strand}</div>
                  <div className="mt-1">{s.body}</div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
              Next steps
            </div>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
              {feedback.nextSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                  <span
                    dangerouslySetInnerHTML={{
                      __html: step.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>"),
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </article>
  );
}

function TrendCard({ year, attempts }: { year: AssessmentYear; attempts: PastResult[] }) {
  const W = 640;
  const H = 180;
  const PAD = { l: 32, r: 16, t: 20, b: 28 };
  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;
  const points = attempts.map((a, i) => {
    const x = attempts.length === 1 ? PAD.l : PAD.l + (i / (attempts.length - 1)) * innerW;
    const y = PAD.t + innerH - (a.scorePct / 100) * innerH;
    return { x, y, pct: a.scorePct, date: a.createdAt };
  });
  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const first = attempts[0].scorePct;
  const latest = attempts[attempts.length - 1].scorePct;
  const delta = latest - first;

  return (
    <section className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-100">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
            Year {year} · progress across attempts
          </div>
          <h3 className="mt-1 font-display text-base font-semibold text-navy-800">
            {attempts.length} diagnostics taken · first {first}% → latest {latest}%
          </h3>
        </div>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset",
            delta > 0
              ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
              : delta < 0
              ? "bg-rose-50 text-rose-700 ring-rose-200"
              : "bg-slate-100 text-slate-600 ring-slate-200"
          )}
        >
          {delta > 0 ? `+${delta}` : delta}
          {" pts"}
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 h-44 w-full">
        {[0, 25, 50, 75, 100].map((v) => {
          const y = PAD.t + innerH - (v / 100) * innerH;
          return (
            <g key={v}>
              <line x1={PAD.l} x2={W - PAD.r} y1={y} y2={y} stroke="rgba(11,30,63,0.06)" strokeDasharray="3 4" />
              <text x={PAD.l - 8} y={y + 3} fontSize="10" fill="#94a3b8" textAnchor="end">
                {v}
              </text>
            </g>
          );
        })}
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.1 }}
          d={linePath}
          stroke="#F97316"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="5" fill="#fff" stroke="#F97316" strokeWidth="2" />
            <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="10" fontWeight="700" fill="#0F172A">
              {p.pct}%
            </text>
            <text x={p.x} y={H - 8} textAnchor="middle" fontSize="9" fill="#64748b">
              {new Date(p.date).toLocaleDateString("en-AU", { day: "numeric", month: "short" })}
            </text>
          </g>
        ))}
      </svg>
    </section>
  );
}
