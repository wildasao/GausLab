"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ProgressChart } from "@/components/dashboard/widgets/ProgressChart";
import { useDashboard } from "@/lib/dashboard-context";
import { Download, ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";
import type { MasteryRow } from "@/lib/dashboard";
import { cn } from "@/lib/cn";

type SortKey = "topic" | "mastery" | "delta";

const bandTone: Record<MasteryRow["band"], string> = {
  "Well below": "bg-rose-50 text-rose-700 ring-rose-200",
  Developing: "bg-amber-50 text-amber-700 ring-amber-200",
  Meeting: "bg-sky-50 text-sky-700 ring-sky-200",
  Exceeding: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

// Rough topic → strand mapper for the donut summary
function strandOf(topic: string): "Number & Algebra" | "Measurement & Geometry" | "Statistics & Probability" {
  const t = topic.toLowerCase();
  if (/(area|perimeter|volume|shape|geom|angle|composite)/.test(t)) return "Measurement & Geometry";
  if (/(data|statis|prob|graph)/.test(t)) return "Statistics & Probability";
  return "Number & Algebra";
}

export default function ProgressPage() {
  const { weekly, topics, activeStudent } = useDashboard();
  const firstName = activeStudent.name.split(" ")[0];
  const [sort, setSort] = useState<SortKey>("mastery");
  const [strandFilter, setStrandFilter] = useState<string>("All");

  const strandStats = useMemo(() => {
    const buckets = new Map<string, { total: number; sum: number }>();
    topics.forEach((t) => {
      const s = strandOf(t.topic);
      const b = buckets.get(s) ?? { total: 0, sum: 0 };
      b.total += 1;
      b.sum += t.mastery;
      buckets.set(s, b);
    });
    return Array.from(buckets.entries()).map(([name, b]) => ({
      name,
      avg: Math.round(b.sum / b.total),
      count: b.total,
    }));
  }, [topics]);

  const filtered = useMemo(() => {
    const rows =
      strandFilter === "All" ? topics : topics.filter((t) => strandOf(t.topic) === strandFilter);
    const sorted = [...rows].sort((a, b) => {
      if (sort === "topic") return a.topic.localeCompare(b.topic);
      if (sort === "delta") return b.delta - a.delta;
      return b.mastery - a.mastery;
    });
    return sorted;
  }, [topics, sort, strandFilter]);

  const avgMastery = Math.round(topics.reduce((a, t) => a + t.mastery, 0) / topics.length);
  const improved = topics.filter((t) => t.delta > 0).length;
  const latest = weekly[weekly.length - 1]?.value ?? 0;
  const first = weekly[0]?.value ?? 0;
  const growth = latest - first;

  return (
    <>
      <PageHeader
        eyebrow="Progress"
        title={`${firstName}'s learning journey`}
        description="Term-over-term mastery, topic breakdowns and strand coverage — everything tracked, nothing hidden."
        actions={
          <button className="inline-flex items-center gap-1.5 rounded-full bg-navy-700 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800">
            <Download className="h-4 w-4" /> Export PDF report
          </button>
        }
      />

      {/* KPI strip */}
      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Average mastery" value={`${avgMastery}%`} sub={`Across ${topics.length} topics`} tone="text-sky-600" />
        <StatCard label="Term-to-date growth" value={`+${growth} pts`} sub={`W1 ${first}% → W${weekly.length} ${latest}%`} tone="text-emerald-600" />
        <StatCard label="Topics improved" value={`${improved}/${topics.length}`} sub="Positive delta this term" tone="text-orange-600" />
        <StatCard label="NAPLAN projection" value={`Band ${activeStudent.currentBand} → ${activeStudent.targetBand}`} sub="Based on last 4 weeks" tone="text-navy-700" />
      </div>

      <ProgressChart weekly={weekly} studentFirstName={firstName} />

      {/* Strand summary */}
      <section className="grid gap-6 lg:grid-cols-12">
        <div className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-100 lg:col-span-5">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Coverage by strand
          </div>
          <h2 className="mt-1 font-display text-lg font-semibold text-navy-800">
            Average mastery per curriculum strand
          </h2>
          <ul className="mt-5 space-y-4">
            {strandStats.map((s, i) => {
              const color = ["from-sky-500 to-sky-700", "from-orange-500 to-orange-600", "from-navy-600 to-navy-800"][i % 3];
              return (
                <li key={s.name}>
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="font-semibold text-navy-800">{s.name}</span>
                    <span className="text-slate-500">
                      {s.count} topics · <span className="font-semibold text-navy-800">{s.avg}%</span>
                    </span>
                  </div>
                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-navy-50">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${s.avg}%` }}
                      transition={{ duration: 0.9, delay: i * 0.06 }}
                      className={`h-full rounded-full bg-gradient-to-r ${color}`}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-navy-800 via-navy-700 to-sky-700 p-6 text-white shadow-lift lg:col-span-7">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-sky-200">
            <TrendingUp className="h-3.5 w-3.5" /> Tutor commentary · updated this week
          </div>
          <p className="mt-3 text-sm leading-relaxed text-navy-100">
            &ldquo;{firstName}&rsquo;s confidence with fractions is now excellent — she&rsquo;s
            ready for percentage problems. The biggest lift this term is in multi-step word
            problems (+12 points), which was our main focus. Next 3 weeks we&rsquo;ll strengthen
            composite areas using the decompose-and-add strategy.&rdquo;
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
        </div>
      </section>

      {/* Topic table */}
      <section className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              All topics
            </div>
            <h2 className="mt-1 font-display text-lg font-semibold text-navy-800">
              Detailed topic mastery
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-full bg-navy-50 p-1 ring-1 ring-navy-100 text-xs">
              {(["All", "Number & Algebra", "Measurement & Geometry", "Statistics & Probability"] as const).map(
                (s) => (
                  <button
                    key={s}
                    onClick={() => setStrandFilter(s)}
                    aria-pressed={strandFilter === s}
                    className={cn(
                      "rounded-full px-3 py-1.5 font-semibold transition-colors",
                      strandFilter === s ? "bg-white text-navy-800 shadow-soft" : "text-navy-700/60 hover:bg-navy-100"
                    )}
                  >
                    {s === "All" ? "All strands" : s.split(" ")[0]}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="text-left text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                <Th onClick={() => setSort("topic")} active={sort === "topic"}>Topic</Th>
                <Th onClick={() => setSort("mastery")} active={sort === "mastery"} align="right">Mastery</Th>
                <Th onClick={() => setSort("delta")} active={sort === "delta"} align="right">Δ Term</Th>
                <th className="py-2 pl-4 text-right">Band</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const up = r.delta >= 0;
                return (
                  <tr key={r.topic} className="border-t border-navy-100 hover:bg-mist">
                    <td className="py-3 pr-4">
                      <div className="font-semibold text-navy-800">{r.topic}</div>
                      <div className="text-[11px] text-slate-500">{strandOf(r.topic)}</div>
                    </td>
                    <td className="py-3 pl-4 text-right">
                      <div className="font-display text-base font-semibold text-navy-800">{r.mastery}%</div>
                      <div className="mt-1 ml-auto h-1.5 w-32 overflow-hidden rounded-full bg-navy-50">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-sky-500 to-orange-400"
                          style={{ width: `${r.mastery}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3 pl-4 text-right">
                      <span
                        className={cn(
                          "inline-flex items-center gap-0.5 font-semibold",
                          up ? "text-emerald-600" : "text-rose-600"
                        )}
                      >
                        {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                        {up ? "+" : ""}
                        {r.delta}%
                      </span>
                    </td>
                    <td className="py-3 pl-4 text-right">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${bandTone[r.band]}`}
                      >
                        {r.band}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function StatCard({ label, value, sub, tone }: { label: string; value: string; sub: string; tone: string }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-navy-100">
      <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">{label}</div>
      <div className={`mt-2 font-display text-2xl font-semibold ${tone}`}>{value}</div>
      <div className="mt-1 text-xs text-slate-500">{sub}</div>
    </div>
  );
}

function Th({
  children,
  onClick,
  active,
  align = "left",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  align?: "left" | "right";
}) {
  return (
    <th
      onClick={onClick}
      aria-sort={active ? "descending" : "none"}
      className={cn(
        "cursor-pointer select-none py-2 pl-4 first:pl-0",
        align === "right" ? "text-right" : "text-left",
        active ? "text-navy-800" : "text-slate-500 hover:text-navy-700"
      )}
    >
      {children}
    </th>
  );
}
