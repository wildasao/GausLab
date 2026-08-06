"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { getModule, MODULES, PHASE_META } from "@/lib/modules";
import { BlockRenderer, isQuestion } from "@/components/dashboard/modules/BlockRenderer";
import { recordAttempt } from "@/lib/attempts";
import { useDashboard } from "@/lib/dashboard-context";
import { ModuleProvider } from "@/components/dashboard/modules/labs/ModuleContext";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Layers,
  Trophy,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  RotateCcw,
  Brain,
} from "lucide-react";
import { cn } from "@/lib/cn";

export default function ModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  // Hooks must run in a stable order — declare them all before any early return.
  const { activeStudent } = useDashboard();
  const [lessonIdx, setLessonIdx] = useState(0);
  // scores[lessonIdx][blockIdx] = "correct" | "incorrect"
  const [scores, setScores] = useState<Record<number, Record<number, "correct" | "incorrect">>>({});

  const mod = getModule(slug);
  if (!mod) return notFound();

  const lesson = mod.lessons[lessonIdx];
  const totalLessons = mod.lessons.length;
  const isLast = lessonIdx === totalLessons - 1;

  // Overall accuracy across all lessons
  const overall = useMemo(() => {
    let correct = 0;
    let attempted = 0;
    for (const l of Object.values(scores)) {
      for (const v of Object.values(l)) {
        attempted += 1;
        if (v === "correct") correct += 1;
      }
    }
    const totalQuestions = mod.lessons.reduce(
      (acc, l) => acc + l.blocks.filter(isQuestion).length,
      0
    );
    return { correct, attempted, totalQuestions, pct: totalQuestions ? Math.round((correct / totalQuestions) * 100) : 0 };
  }, [scores, mod.lessons]);

  const nextModule = useMemo(() => {
    const currentYearIdx = MODULES.findIndex((m) => m.slug === mod.slug);
    return MODULES[(currentYearIdx + 1) % MODULES.length];
  }, [mod.slug]);

  const modSlug = mod.slug;
  const lessonId = lesson.id;
  const studentId = activeStudent?.id;
  function recordAnswer(blockIdx: number, correct: boolean) {
    setScores((s) => ({
      ...s,
      [lessonIdx]: {
        ...(s[lessonIdx] || {}),
        [blockIdx]: correct ? "correct" : "incorrect",
      },
    }));
    // Fire-and-forget: send to Supabase for progress analytics
    void recordAttempt({
      studentId,
      moduleSlug: modSlug,
      lessonId,
      blockIndex: blockIdx,
      correct,
    });
  }

  const lessonQuestions = lesson.blocks.filter(isQuestion).length;
  const lessonAnswered = Object.keys(scores[lessonIdx] || {}).length;
  const lessonComplete = lessonQuestions > 0 && lessonAnswered >= lessonQuestions;

  return (
    <ModuleProvider slug={mod.slug}>
      {/* Back link */}
      <div>
        <Link
          href="/portal/dashboard/modules"
          className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 hover:text-sky-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> All modules
        </Link>
      </div>

      {/* Module header */}
      <section
        className="relative overflow-hidden rounded-3xl p-6 text-white shadow-lift sm:p-8"
        style={{
          background: "linear-gradient(135deg, #0B1E3F 0%, #152C5E 50%, #0369A1 100%)",
        }}
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(500px 220px at 15% 0%, rgba(14,165,233,0.35), transparent 60%), radial-gradient(500px 220px at 90% 100%, rgba(249,115,22,0.28), transparent 60%)",
          }}
        />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2 text-xs text-navy-200">
            <span className="rounded-full bg-white/10 px-2.5 py-1 font-semibold text-sky-100 ring-1 ring-inset ring-white/15">
              Year {mod.year}
            </span>
            <span className="rounded-full bg-white/10 px-2.5 py-1 font-semibold text-sky-100 ring-1 ring-inset ring-white/15">
              {mod.strand}
            </span>
            <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {mod.minutes} min</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1"><Layers className="h-3 w-3" /> {totalLessons} lessons</span>
          </div>
          <h1 className="mt-3 font-display text-2xl font-semibold text-white sm:text-3xl">
            {mod.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-navy-100">{mod.overview}</p>

          {/* Lesson strip */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {mod.lessons.map((l, i) => {
              const active = i === lessonIdx;
              const done = scores[i] && Object.keys(scores[i]).length >= l.blocks.filter(isQuestion).length && l.blocks.filter(isQuestion).length > 0;
              return (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setLessonIdx(i)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset transition-colors",
                    active
                      ? "bg-orange-500 text-white ring-orange-500"
                      : done
                      ? "bg-emerald-500/15 text-emerald-200 ring-emerald-400/40"
                      : "bg-white/10 text-navy-100 ring-white/15 hover:bg-white/15"
                  )}
                >
                  {done && <CheckCircle2 className="h-3 w-3" />}
                  Lesson {i + 1}
                </button>
              );
            })}
          </div>

          {/* Overall progress bar */}
          <div className="mt-5">
            <div className="flex items-baseline justify-between text-[11px] text-navy-200">
              <span>Overall module progress</span>
              <span className="font-semibold text-white">
                {overall.attempted}/{overall.totalQuestions} answered · {overall.pct}% correct
              </span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.round((overall.attempted / Math.max(1, overall.totalQuestions)) * 100)}%` }}
                transition={{ duration: 0.5 }}
                className="h-full rounded-full bg-gradient-to-r from-sky-400 to-orange-400"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Lesson content */}
      <AnimatePresence mode="wait">
        <motion.section
          key={lesson.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="space-y-4"
        >
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Lesson {lessonIdx + 1} of {totalLessons}
                </div>
                {lesson.phase && (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${
                      PHASE_META[lesson.phase].tone
                    }`}
                    title={PHASE_META[lesson.phase].body}
                  >
                    {PHASE_META[lesson.phase].label}
                  </span>
                )}
              </div>
              <h2 className="mt-1 font-display text-xl font-semibold text-navy-800 sm:text-2xl">
                {lesson.title}
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-slate-600">{lesson.intro}</p>
              {lesson.phase && (
                <p className="mt-2 max-w-2xl text-[11px] italic text-slate-500">
                  {PHASE_META[lesson.phase].body}
                </p>
              )}
            </div>
            {lessonComplete && (
              <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                <CheckCircle2 className="h-3.5 w-3.5" /> Lesson complete
              </div>
            )}
          </div>

          {lesson.blocks.map((b, i) => (
            <BlockRenderer
              key={i}
              block={b}
              onAnswer={(ok) => recordAnswer(i, ok)}
            />
          ))}
        </motion.section>
      </AnimatePresence>

      {/* Nav footer */}
      <section className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white p-5 shadow-soft ring-1 ring-navy-100">
        <button
          type="button"
          onClick={() => setLessonIdx((i) => Math.max(0, i - 1))}
          disabled={lessonIdx === 0}
          className="inline-flex items-center gap-1.5 rounded-full bg-navy-50 px-4 py-2 text-sm font-semibold text-navy-700 hover:bg-navy-100 disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" /> Previous lesson
        </button>

        {isLast ? (
          <ModuleComplete
            pct={overall.pct}
            correct={overall.correct}
            total={overall.totalQuestions}
            attempted={overall.attempted}
            nextModuleSlug={nextModule.slug}
            nextTitle={nextModule.title}
            cognitiveTip={mod.cognitiveTip}
            reset={() => {
              setScores({});
              setLessonIdx(0);
            }}
          />
        ) : (
          <button
            type="button"
            onClick={() => setLessonIdx((i) => Math.min(totalLessons - 1, i + 1))}
            className="inline-flex items-center gap-1.5 rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600"
          >
            Next lesson <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </section>
    </ModuleProvider>
  );
}

function ModuleComplete({
  pct,
  correct,
  total,
  attempted,
  nextModuleSlug,
  nextTitle,
  cognitiveTip,
  reset,
}: {
  pct: number;
  correct: number;
  total: number;
  attempted: number;
  nextModuleSlug: string;
  nextTitle: string;
  cognitiveTip?: string;
  reset: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
        <Trophy className="h-3.5 w-3.5" /> {attempted === total ? "Module complete" : `${attempted}/${total} answered`} · {correct}/{total} correct ({pct}%)
      </div>
      {cognitiveTip && (
        <div
          className="max-w-md rounded-2xl bg-fuchsia-50 px-3 py-2 text-[11px] text-fuchsia-900 ring-1 ring-inset ring-fuchsia-200"
          title="Applied neuroscience tip"
        >
          <div className="mb-0.5 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-fuchsia-700">
            <Brain className="h-3 w-3" /> Grow next
          </div>
          {cognitiveTip}
        </div>
      )}
      <button
        type="button"
        onClick={reset}
        className="inline-flex items-center gap-1.5 rounded-full bg-navy-50 px-3 py-1.5 text-xs font-semibold text-navy-700 hover:bg-navy-100"
      >
        <RotateCcw className="h-3.5 w-3.5" /> Retry module
      </button>
      <Link
        href={`/portal/dashboard/modules/${nextModuleSlug}`}
        className="inline-flex items-center gap-1.5 rounded-full bg-navy-700 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800"
      >
        <Sparkles className="h-4 w-4 text-orange-300" /> Try next: {nextTitle}
      </Link>
    </div>
  );
}
