"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useDashboard } from "@/lib/dashboard-context";
import { modulesByPathway, MODULES, type Pathway } from "@/lib/modules";
import { BookOpen, Clock, Play, Sparkles, Brain, Layers3, Repeat } from "lucide-react";
import { cn } from "@/lib/cn";

const PATHWAYS: { key: Pathway; label: string; sub: string; dot: string }[] = [
  { key: 3, label: "Year 3", sub: "Foundations", dot: "bg-emerald-500" },
  { key: 5, label: "Year 5", sub: "Fluency", dot: "bg-sky-500" },
  { key: 7, label: "Year 7", sub: "Transition", dot: "bg-orange-500" },
  { key: 9, label: "Year 9", sub: "Advanced core", dot: "bg-navy-700" },
  { key: "Advanced", label: "Advanced", sub: "Extension & Olympiad", dot: "bg-fuchsia-500" },
];

export default function ModulesIndex() {
  const { activeStudent } = useDashboard();
  const grouped = modulesByPathway();
  const [pathway, setPathway] = useState<Pathway>(activeStudent.year as Pathway);
  const rows = grouped[pathway];
  const suggested = MODULES.find((m) => m.year === activeStudent.year && !m.pathway) ?? MODULES[1];

  return (
    <>
      <PageHeader
        eyebrow="Interactive study modules"
        title="Learn by doing — the way the brain actually learns"
        description="Bite-sized, NAPLAN-aligned modules built on the Concrete → Pictorial → Abstract progression. Every question gets instant feedback."
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

      {/* Pathway tabs */}
      <div className="flex flex-wrap items-center gap-2 rounded-full bg-white p-2 ring-1 ring-navy-100 shadow-soft">
        {PATHWAYS.map((p) => {
          const active = p.key === pathway;
          const count = grouped[p.key].length;
          return (
            <button
              key={String(p.key)}
              onClick={() => setPathway(p.key)}
              aria-pressed={active}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                active ? "bg-navy-700 text-white shadow-soft" : "text-navy-700/70 hover:bg-navy-50"
              )}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", p.dot)} />
              {p.label}
              <span className={cn("text-[10px]", active ? "text-sky-200" : "text-slate-500")}>· {count}</span>
            </button>
          );
        })}
      </div>

      {/* Pathway description */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          {typeof pathway === "number" ? `Year ${pathway}` : "Advanced pathway"}
        </div>
        <h2 className="mt-1 font-display text-xl font-semibold text-navy-800">
          {pathwayHeadline(pathway)}
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-slate-600">{pathwayDescription(pathway)}</p>
      </div>

      {/* Module grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={String(pathway)}
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
              No modules in this pathway yet — coming soon.
            </div>
          )}
        </motion.div>
      </AnimatePresence>
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

function pathwayHeadline(p: Pathway) {
  const map: Record<string, string> = {
    "3": "Year 3 · foundations for early NAPLAN success",
    "5": "Year 5 · fluency and reasoning under exam conditions",
    "7": "Year 7 · transition to high-school algebra",
    "9": "Year 9 · advanced core for Y9 NAPLAN and Y10 readiness",
    Advanced: "Advanced · extension for gifted and Olympiad-bound learners",
  };
  return map[String(p)];
}

function pathwayDescription(p: Pathway) {
  const map: Record<string, string> = {
    "3": "Place value, times tables, time, fractions and shape — every foundation NAPLAN Y3 tests.",
    "5": "Fractions, decimals, percentages, area/perimeter and multi-step reasoning for Y5 NAPLAN.",
    "7": "Integers, ratio, percentages, algebra and geometry — the Year 7 NAPLAN core.",
    "9": "Algebra, trig, Pythagoras, index laws and coordinate geometry — Y9 NAPLAN and beyond.",
    Advanced:
      "Non-routine problem solving, logic puzzles and Olympiad-style questions for students aiming past NAPLAN — selective schools, scholarships and advanced streams.",
  };
  return map[String(p)];
}
