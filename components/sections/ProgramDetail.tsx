"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { PROGRAMS, YEAR_ORDER, type Year } from "@/lib/programs";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import {
  Clock,
  Users,
  BookOpen,
  Target,
  CheckCircle2,
  ChevronRight,
  Lightbulb,
  BadgeCheck,
  ArrowRight,
} from "lucide-react";

const strandTone: Record<
  "sky" | "orange" | "navy" | "emerald",
  { chip: string; bar: string; ring: string }
> = {
  sky: {
    chip: "bg-sky-50 text-sky-700 ring-sky-200",
    bar: "bg-gradient-to-r from-sky-500 to-sky-600",
    ring: "ring-sky-200",
  },
  orange: {
    chip: "bg-orange-50 text-orange-700 ring-orange-200",
    bar: "bg-gradient-to-r from-orange-500 to-orange-600",
    ring: "ring-orange-200",
  },
  navy: {
    chip: "bg-navy-50 text-navy-700 ring-navy-200",
    bar: "bg-gradient-to-r from-navy-600 to-navy-800",
    ring: "ring-navy-200",
  },
  emerald: {
    chip: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    bar: "bg-gradient-to-r from-emerald-500 to-emerald-600",
    ring: "ring-emerald-200",
  },
};

export function ProgramDetail() {
  const [year, setYear] = useState<Year>("5");
  const [openTopic, setOpenTopic] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const p = PROGRAMS[year];
  const reduce = useReducedMotion();

  return (
    <>
      {/* Year selector — sticky */}
      <div className="sticky top-[64px] z-20 border-y border-navy-100/70 bg-white/85 backdrop-blur-md">
        <Container>
          <div className="flex items-center justify-between gap-4 py-3">
            <div className="hidden text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 sm:block">
              Select year level
            </div>
            <div className="inline-flex items-center gap-1 rounded-full bg-navy-50 p-1 ring-1 ring-navy-100">
              {YEAR_ORDER.map((y) => (
                <button
                  key={y}
                  onClick={() => {
                    setYear(y);
                    setOpenTopic(null);
                    setShowAnswer(false);
                  }}
                  aria-pressed={year === y}
                  className={cn(
                    "min-w-[76px] rounded-full px-4 py-2 text-sm font-semibold transition-all",
                    year === y
                      ? "bg-navy-700 text-white shadow-soft"
                      : "text-navy-700/70 hover:bg-navy-100"
                  )}
                >
                  Year {y}
                </button>
              ))}
            </div>
            <Button href="/contact#assessment" size="sm" className="hidden sm:inline-flex">
              Free Y{year} assessment
            </Button>
          </div>
        </Container>
      </div>

      <Section className="pt-14">
        <AnimatePresence mode="wait">
          <motion.div
            key={year}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
          >
            {/* Header */}
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700 ring-1 ring-inset ring-orange-200">
                  {p.tag}
                </div>
                <h2 className="mt-4 font-display text-3xl font-semibold text-navy-800 sm:text-4xl">
                  {p.headline}
                </h2>
                <p className="mt-2 max-w-2xl text-base text-slate-600 sm:text-lg">
                  {p.tagline}
                </p>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600">
                  {p.overview}
                </p>

                <dl className="mt-8 grid gap-3 sm:grid-cols-2">
                  <FactCard icon={Users} label="Age range" value={p.ageRange} />
                  <FactCard icon={Clock} label="Weekly load" value={p.weeklyLoad} />
                  <FactCard icon={BookOpen} label="Session length" value={p.sessionLength} />
                  <FactCard icon={Target} label="Formats" value={p.formats.join(" · ")} />
                </dl>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-3xl bg-gradient-to-br from-navy-800 via-navy-700 to-sky-700 p-7 text-white shadow-lift">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-sky-100 ring-1 ring-inset ring-white/15">
                    <BadgeCheck className="h-3.5 w-3.5 text-emerald-300" /> Learning outcomes
                  </div>
                  <ul className="mt-4 space-y-3 text-sm">
                    {p.outcomes.map((o) => (
                      <li key={o} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-300" />
                        <span className="text-navy-50">{o}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 border-t border-white/10 pt-4">
                    <div className="text-[11px] font-semibold uppercase tracking-widest text-sky-200">
                      NAPLAN Y{p.year} focus
                    </div>
                    <ul className="mt-2 space-y-1.5 text-sm text-navy-100">
                      {p.naplanFocus.map((f) => (
                        <li key={f} className="flex items-start gap-2">
                          <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-orange-400" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Strand weighting */}
            <div className="mt-16">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Curriculum coverage
                  </div>
                  <h3 className="mt-1 font-display text-2xl font-semibold text-navy-800">
                    What we teach — and how much of each strand.
                  </h3>
                </div>
                <div className="hidden text-xs text-slate-500 sm:block">
                  Aligned to Australian Curriculum V9 · NSW / VIC / QLD adaptable
                </div>
              </div>

              <div className="mt-5 h-3 w-full overflow-hidden rounded-full bg-navy-50">
                <div className="flex h-full w-full">
                  {p.strands.map((s) => (
                    <div
                      key={s.name}
                      className={cn("h-full", strandTone[s.color].bar)}
                      style={{ width: `${s.weight}%` }}
                      title={`${s.name}: ${s.weight}%`}
                    />
                  ))}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-xs">
                {p.strands.map((s) => (
                  <div key={s.name} className="inline-flex items-center gap-2 text-slate-600">
                    <span className={cn("h-2.5 w-2.5 rounded-full", strandTone[s.color].bar)} />
                    <span className="font-semibold text-navy-700">{s.name}</span>
                    <span className="text-slate-500">{s.weight}%</span>
                  </div>
                ))}
              </div>

              {/* Strands */}
              <div className="mt-10 space-y-10">
                {p.strands.map((s) => (
                  <div key={s.name}>
                    <div className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset", strandTone[s.color].chip)}>
                      {s.name} · {s.weight}%
                    </div>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      {s.topics.map((t) => {
                        const key = `${p.year}-${s.name}-${t.title}`;
                        const isOpen = openTopic === key;
                        return (
                          <button
                            key={t.title}
                            onClick={() => setOpenTopic(isOpen ? null : key)}
                            aria-expanded={isOpen}
                            className={cn(
                              "group text-left rounded-2xl bg-white p-5 ring-1 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift",
                              isOpen ? cn("ring-2", strandTone[s.color].ring) : "ring-navy-100"
                            )}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="font-display text-base font-semibold text-navy-800">
                                {t.title}
                              </div>
                              <ChevronRight
                                className={cn(
                                  "h-4 w-4 text-slate-400 transition-transform",
                                  isOpen && "rotate-90 text-navy-700"
                                )}
                              />
                            </div>
                            <AnimatePresence initial={false}>
                              {isOpen && (
                                <motion.div
                                  initial={reduce ? false : { height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={reduce ? undefined : { height: 0, opacity: 0 }}
                                  transition={{ duration: 0.25 }}
                                  className="overflow-hidden"
                                >
                                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                                    {t.explanation}
                                  </p>
                                  <div className="mt-4">
                                    <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                                      Skills covered
                                    </div>
                                    <ul className="mt-2 flex flex-wrap gap-1.5">
                                      {t.skills.map((sk) => (
                                        <li
                                          key={sk}
                                          className="inline-flex items-center gap-1 rounded-full bg-navy-50 px-2.5 py-1 text-[11px] font-medium text-navy-700 ring-1 ring-inset ring-navy-100"
                                        >
                                          {sk}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample assessment */}
            <div className="mt-16 grid gap-8 rounded-3xl bg-mist p-6 ring-1 ring-navy-100 sm:p-10 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-navy-700 ring-1 ring-navy-100">
                  <Lightbulb className="h-3.5 w-3.5 text-orange-500" /> Sample NAPLAN-style question
                </div>
                <h3 className="mt-4 font-display text-2xl font-semibold text-navy-800 sm:text-3xl">
                  What Year {p.year} students actually work on.
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Our assessment library contains 800+ NAPLAN-style questions per year level,
                  each mapped to the exact skill it tests. This is a real example — with the
                  teaching commentary we share with parents.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button href="/contact#assessment" size="md">
                    Book Y{p.year} diagnostic <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button href="/resources" variant="outline" size="md">
                    Get practice pack
                  </Button>
                </div>
              </div>
              <div className="lg:col-span-7">
                <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-navy-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-orange-600">
                      {p.sample.band}
                    </span>
                    <span className="rounded-full bg-navy-50 px-2 py-0.5 text-[10px] font-semibold text-navy-700 ring-1 ring-inset ring-navy-100">
                      Q{p.year}·01
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-navy-800">{p.sample.prompt}</p>
                  {p.sample.choices && (
                    <ul className="mt-4 grid grid-cols-2 gap-2">
                      {p.sample.choices.map((c, i) => {
                        const letter = String.fromCharCode(65 + i);
                        const isRight = c === p.sample.answer;
                        const revealed = showAnswer;
                        return (
                          <li
                            key={c}
                            className={cn(
                              "flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors",
                              revealed && isRight
                                ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                                : "border-navy-100 bg-white text-navy-800"
                            )}
                          >
                            <span
                              className={cn(
                                "grid h-6 w-6 place-items-center rounded-full text-[11px] font-semibold ring-1 ring-inset",
                                revealed && isRight
                                  ? "bg-emerald-500 text-white ring-emerald-500"
                                  : "bg-navy-50 text-navy-700 ring-navy-100"
                              )}
                            >
                              {letter}
                            </span>
                            {c}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                  <div className="mt-5 flex items-center justify-between">
                    <button
                      onClick={() => setShowAnswer((v) => !v)}
                      className="text-sm font-semibold text-sky-700 hover:text-sky-800"
                    >
                      {showAnswer ? "Hide" : "Show"} worked solution
                    </button>
                    <span className="text-[11px] text-slate-500">Timing: ~90 sec target</span>
                  </div>
                  <AnimatePresence initial={false}>
                    {showAnswer && (
                      <motion.div
                        initial={reduce ? false : { opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={reduce ? undefined : { opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 rounded-xl bg-mist p-4 ring-1 ring-navy-100">
                          <div className="text-[11px] font-semibold uppercase tracking-widest text-emerald-700">
                            Answer: {p.sample.answer}
                          </div>
                          <p className="mt-1 text-sm leading-relaxed text-slate-700">
                            {p.sample.workingOut}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </Section>
    </>
  );
}

function FactCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-navy-100">
      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-navy-800">{value}</div>
    </div>
  );
}
