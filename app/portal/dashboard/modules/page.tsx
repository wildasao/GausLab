"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useDashboard } from "@/lib/dashboard-context";
import { modulesByPathway, MODULES, type Pathway, type Year } from "@/lib/modules";
import {
  BookOpen,
  Clock,
  Play,
  Sparkles,
  Brain,
  Layers3,
  Repeat,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/cn";

const YEAR_LABEL: Record<Year, { label: string; sub: string; dot: string }> = {
  3: { label: "Year 3", sub: "Foundations", dot: "bg-emerald-500" },
  5: { label: "Year 5", sub: "Fluency", dot: "bg-sky-500" },
  7: { label: "Year 7", sub: "Transition", dot: "bg-orange-500" },
  9: { label: "Year 9", sub: "Advanced core", dot: "bg-navy-700" },
};

type ViewMode = "current" | "advanced";

export default function ModulesIndex() {
  const { activeStudent } = useDashboard();
  const grouped = modulesByPathway();
  const studentYear = (activeStudent.year as Year) in YEAR_LABEL ? (activeStudent.year as Year) : 5;
  const [view, setView] = useState<ViewMode>("current");
  const [peekYear, setPeekYear] = useState<Year | null>(null);
  const [peekOpen, setPeekOpen] = useState(false);

  const effectiveYear: Year = peekYear ?? studentYear;
  const isPeeking = peekYear !== null && peekYear !== studentYear;
  const rows = view === "advanced" ? grouped["Advanced"] : grouped[effectiveYear];

  const firstName = activeStudent.name.split(" ")[0];
  const suggested = MODULES.find((m) => m.year === studentYear && !m.pathway) ?? MODULES[0];
  const meta = YEAR_LABEL[effectiveYear];

  return (
    <>
      <PageHeader
        eyebrow={`${firstName}'s workspace`}
        title="Interactive study modules"
        description={`Everything below is scoped to Year ${studentYear} — ${firstName}'s current level.`}
      />

      {/* Suggested for student */}
      <section
        className="relative overflow-hidden rounded-3xl p-6 text-white shadow-lift sm:p-8"
        style={{ background: "linear-gradient(135deg, #0B1E3F 0%, #152C5E 40%, #0369A1 100%)" }}
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
              <Sparkles className="h-3.5 w-3.5 text-orange-300" /> Recommended for {firstName}
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

      {/* View switcher — current year vs Advanced extension only */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-1 rounded-full bg-white p-1 ring-1 ring-navy-100 shadow-soft">
          <button
            type="button"
            onClick={() => {
              setView("current");
              setPeekYear(null);
            }}
            aria-pressed={view === "current"}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              view === "current" ? "bg-navy-700 text-white shadow-soft" : "text-navy-700/70 hover:bg-navy-50"
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", YEAR_LABEL[studentYear].dot)} />
            {YEAR_LABEL[studentYear].label}
            <span className={cn("text-[10px]", view === "current" ? "text-sky-200" : "text-slate-500")}>· {grouped[studentYear].length}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setView("advanced");
              setPeekYear(null);
            }}
            aria-pressed={view === "advanced"}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              view === "advanced" ? "bg-navy-700 text-white shadow-soft" : "text-navy-700/70 hover:bg-navy-50"
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-500" />
            Advanced
            <span className={cn("text-[10px]", view === "advanced" ? "text-sky-200" : "text-slate-500")}>· {grouped["Advanced"].length}</span>
          </button>
        </div>

        {/* Discreet peek at other years (progress preview / catch-up for older kids) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setPeekOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-full bg-mist px-3 py-1.5 text-xs font-semibold text-navy-700/70 ring-1 ring-inset ring-navy-100 hover:bg-white"
          >
            {isPeeking ? `Previewing ${YEAR_LABEL[peekYear!].label}` : "Preview other year"}
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", peekOpen && "rotate-180")} />
          </button>
          {peekOpen && (
            <div className="absolute right-0 top-full z-10 mt-2 w-56 overflow-hidden rounded-2xl bg-white shadow-lift ring-1 ring-navy-100">
              <button
                type="button"
                onClick={() => {
                  setPeekYear(null);
                  setView("current");
                  setPeekOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2 border-b border-navy-100 px-4 py-2.5 text-left text-xs font-semibold text-navy-700 hover:bg-navy-50",
                  !isPeeking && "bg-sky-50"
                )}
              >
                Return to {firstName}&rsquo;s year
              </button>
              {(Object.keys(YEAR_LABEL) as unknown as Year[]).map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => {
                    setPeekYear(Number(y) as Year);
                    setView("current");
                    setPeekOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 px-4 py-2.5 text-left text-xs hover:bg-navy-50",
                    peekYear === y && "bg-sky-50"
                  )}
                >
                  <span className={cn("h-1.5 w-1.5 rounded-full", YEAR_LABEL[y].dot)} />
                  <span className="font-semibold text-navy-800">{YEAR_LABEL[y].label}</span>
                  <span className="text-slate-500">· {YEAR_LABEL[y].sub}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Peek banner */}
      {isPeeking && view === "current" && (
        <div className="rounded-2xl bg-sky-50 p-3 text-xs text-sky-800 ring-1 ring-inset ring-sky-200">
          You&rsquo;re previewing <b>{YEAR_LABEL[peekYear!].label}</b>. Great for peeking ahead or catching up — but progress and assessments stay scoped to {firstName}&rsquo;s year ({YEAR_LABEL[studentYear].label}).
        </div>
      )}

      {/* Pathway description */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          {view === "advanced" ? "Advanced pathway" : `${meta.label} · ${meta.sub}`}
        </div>
        <h2 className="mt-1 font-display text-xl font-semibold text-navy-800">
          {view === "advanced" ? "Extension for gifted or Olympiad-bound learners" : pathwayHeadline(effectiveYear)}
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-slate-600">
          {view === "advanced"
            ? "Non-routine problem solving, logic puzzles and higher-order questions for students aiming past NAPLAN."
            : pathwayDescription(effectiveYear)}
        </p>
      </div>

      {/* Module grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${view}-${effectiveYear}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {rows.map((m) => (
            <Link
              key={m.slug}
              href={`/portal/dashboard/modules/${m.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-navy-100 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift hover:ring-sky-200"
            >
              <div className={cn("relative h-24 bg-gradient-to-br", m.color)}>
                <div className="absolute inset-0 bg-noise opacity-30" />
                <div className="absolute left-3 top-3 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white ring-1 ring-inset ring-white/30">
                  {m.pathway === "Advanced" ? "Advanced" : `Year ${m.year}`}
                </div>
                <div className="absolute right-3 top-3 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white ring-1 ring-inset ring-white/30">
                  {m.strand.split(" ")[0]}
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-sm font-semibold text-navy-800">{m.title}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-slate-600">{m.subtitle}</p>
                <div className="mt-auto flex items-center justify-between pt-4 text-[11px] text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {m.minutes} min · {m.lessons.length} lessons
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700">
                    Start <Play className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
          {rows.length === 0 && (
            <div className="col-span-full rounded-3xl bg-white p-12 text-center text-slate-500 ring-1 ring-navy-100">
              No modules in this view yet — coming soon.
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* How we teach */}
      <section className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-100">
        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-fuchsia-50 px-2.5 py-1 text-[11px] font-semibold text-fuchsia-700 ring-1 ring-inset ring-fuchsia-200">
              <Brain className="h-3 w-3" /> How we teach
            </div>
            <h2 className="mt-2 font-display text-lg font-semibold text-navy-800">
              Montessori pedagogy meets applied neuroscience.
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              We designed every module around the way children actually learn maths — from tangible experience through visual reasoning to symbolic mastery.
            </p>
          </div>
          <Principle
            icon={Layers3}
            title="Concrete → Pictorial → Abstract"
            body="Bruner's classic progression: learners meet each concept as a hands-on manipulative, then a visual, then a symbol. No skipping steps."
            tone="from-emerald-500 to-emerald-600"
          />
          <Principle
            icon={Repeat}
            title="Retrieval + spacing"
            body="Every lesson interleaves theory with recall practice. Short daily sessions beat long marathons — the brain consolidates during rest."
            tone="from-sky-500 to-sky-700"
          />
          <Principle
            icon={Sparkles}
            title="Productive struggle"
            body="Instant, kind feedback. Hints instead of answers. Mistakes are the moment learning happens, not failure — growth mindset baked in."
            tone="from-orange-500 to-orange-600"
          />
        </div>
      </section>
    </>
  );
}

function Principle({
  icon: Icon,
  title,
  body,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  tone: string;
}) {
  return (
    <div className="rounded-2xl bg-mist p-4 ring-1 ring-inset ring-navy-100">
      <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${tone} text-white shadow-soft`}>
        <Icon className="h-4 w-4" />
      </div>
      <h3 className="mt-3 font-display text-sm font-semibold text-navy-800">{title}</h3>
      <p className="mt-1 text-xs leading-relaxed text-slate-600">{body}</p>
    </div>
  );
}

function pathwayHeadline(y: Year) {
  const map: Record<Year, string> = {
    3: "Foundations for early NAPLAN success",
    5: "Fluency and reasoning under exam conditions",
    7: "Transition to high-school algebra",
    9: "Advanced core for Y9 NAPLAN and Y10 readiness",
  };
  return map[y];
}

function pathwayDescription(y: Year) {
  const map: Record<Year, string> = {
    3: "Place value, times tables, time, fractions and shape — every foundation NAPLAN Y3 tests.",
    5: "Fractions, decimals, percentages, area/perimeter and multi-step reasoning for Y5 NAPLAN.",
    7: "Integers, ratio, percentages, algebra and geometry — the Year 7 NAPLAN core.",
    9: "Algebra, trig, Pythagoras, index laws and coordinate geometry — Y9 NAPLAN and beyond.",
  };
  return map[y];
}
