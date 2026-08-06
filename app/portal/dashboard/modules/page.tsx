"use client";

import Link from "next/link";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useDashboard } from "@/lib/dashboard-context";
import { modulesByYear, MODULES } from "@/lib/modules";
import { BookOpen, Clock, Play, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";

const years = [3, 5, 7, 9] as const;

export default function ModulesIndex() {
  const { activeStudent } = useDashboard();
  const grouped = modulesByYear();
  const suggested = MODULES.find((m) => m.year === activeStudent.year) ?? MODULES[1];

  return (
    <>
      <PageHeader
        eyebrow="Interactive study modules"
        title="Learn by doing — one topic at a time"
        description="Bite-sized, NAPLAN-aligned modules with theory, worked examples and interactive practice. Every question gets instant feedback."
      />

      {/* Suggested */}
      <section
        className="relative overflow-hidden rounded-3xl p-6 text-white shadow-lift sm:p-8"
        style={{
          background: "linear-gradient(135deg, #0B1E3F 0%, #152C5E 40%, #0369A1 100%)",
        }}
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(500px 220px at 20% 0%, rgba(249,115,22,0.28), transparent 60%), radial-gradient(500px 220px at 100% 100%, rgba(14,165,233,0.35), transparent 60%)",
          }}
        />
        <div className="relative flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-sky-100 ring-1 ring-inset ring-white/15">
              <Sparkles className="h-3.5 w-3.5 text-orange-300" /> Recommended for {activeStudent.name.split(" ")[0]}
            </div>
            <h2 className="mt-3 font-display text-2xl font-semibold text-white sm:text-3xl">
              {suggested.title}
            </h2>
            <p className="mt-1 max-w-xl text-sm text-navy-100">{suggested.subtitle}</p>
            <div className="mt-3 flex items-center gap-3 text-xs text-navy-200">
              <span className="inline-flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5" /> Year {suggested.year} · {suggested.strand}
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> {suggested.minutes} min
              </span>
            </div>
          </div>
          <Link
            href={`/portal/dashboard/modules/${suggested.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
          >
            <Play className="h-4 w-4" /> Start module
          </Link>
        </div>
      </section>

      {/* By year */}
      {years.map((y) => (
        <section key={y} className="space-y-4">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Year {y}
              </div>
              <h2 className="mt-1 font-display text-xl font-semibold text-navy-800">
                {yearHeadline(y)}
              </h2>
            </div>
            <span className="text-xs text-slate-500">{grouped[y].length} module{grouped[y].length === 1 ? "" : "s"}</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {grouped[y].map((m) => (
              <Link
                key={m.slug}
                href={`/portal/dashboard/modules/${m.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-navy-100 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift hover:ring-sky-200"
              >
                <div className={cn("relative h-28 bg-gradient-to-br", m.color)}>
                  <div className="absolute inset-0 bg-noise opacity-30" />
                  <div className="absolute left-4 top-4 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold text-white ring-1 ring-inset ring-white/25">
                    Year {m.year}
                  </div>
                  <div className="absolute right-4 top-4 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold text-white ring-1 ring-inset ring-white/25">
                    {m.strand.split(" ")[0]}
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-base font-semibold text-navy-800 group-hover:text-navy-900">
                    {m.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-600">{m.subtitle}</p>
                  <div className="mt-auto flex items-center justify-between pt-4 text-[11px] text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {m.minutes} min · {m.lessons.length} lessons
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-sky-700">
                      Start <Play className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}

function yearHeadline(y: number) {
  const map: Record<number, string> = {
    3: "Foundations for early NAPLAN success",
    5: "Fluency and reasoning under exam conditions",
    7: "Transition to high-school algebra",
    9: "Advanced — sharpen for Y9 NAPLAN and Y10",
  };
  return map[y] ?? "";
}
