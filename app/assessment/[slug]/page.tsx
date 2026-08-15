"use client";

import Link from "next/link";
import { use, useMemo, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { QuestionCard } from "@/components/assessment/QuestionCard";
import { AssessmentResults } from "@/components/assessment/AssessmentResults";
import { PersonalityQuiz } from "@/components/assessment/PersonalityQuiz";
import {
  sampleQuestions,
  score,
  type AssessmentYear,
  type Answer,
} from "@/lib/assessment";
import { usePersonalityProfile, type PersonalityProfile } from "@/lib/personality";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";

export default function AssessmentQuizPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  // Slug format: y3 | y5 | y7 | y9  (keeps URLs descriptive)
  const y = parseInt(slug.replace(/^y/i, ""), 10);
  if (![3, 5, 7, 9].includes(y)) return notFound();
  const year = y as AssessmentYear;
  const router = useRouter();

  // Fresh sample on each visit
  const seed = useMemo(() => Date.now() + year, [year]);
  const questions = useMemo(() => sampleQuestions(year, seed), [year, seed]);

  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [phase, setPhase] = useState<"profile" | "quiz" | "done">("profile");
  const { profile: existingProfile, loading: profileLoading, refresh: refreshProfile } = usePersonalityProfile();
  const [profileOverride, setProfileOverride] = useState<PersonalityProfile | null>(null);
  const profile = profileOverride ?? existingProfile;

  // Advance past the personality step if a profile already exists
  if (phase === "profile" && !profileLoading && existingProfile) {
    setPhase("quiz");
  }

  const q = questions[idx];
  const answered = q ? Boolean(answers[q.id]) : false;
  const isLast = idx === questions.length - 1;
  const progress = ((idx + (answered ? 1 : 0)) / questions.length) * 100;

  function record(a: Answer) {
    setAnswers((s) => ({ ...s, [a.qid]: a }));
  }

  function next() {
    if (isLast) {
      setPhase("done");
      // scroll top for results
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setIdx((i) => Math.min(questions.length - 1, i + 1));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function prev() {
    setIdx((i) => Math.max(0, i - 1));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const result = useMemo(
    () => (phase === "done" ? score(year, questions, Object.values(answers)) : null),
    [phase, year, questions, answers]
  );

  return (
    <section className="min-h-dvh py-10 sm:py-14">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-16 h-64 opacity-70"
        style={{
          background:
            "radial-gradient(700px 220px at 50% 0%, rgba(14,165,233,0.15), transparent 60%)",
        }}
      />
      <Container>
        <button
          type="button"
          onClick={() => router.push("/assessment")}
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-navy-700 hover:text-navy-900"
        >
          <ArrowLeft className="h-4 w-4" /> Back to year selection
        </button>

        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-navy-700 shadow-soft ring-1 ring-navy-100">
              <Sparkles className="h-3.5 w-3.5 text-orange-500" /> Year {year} Diagnostic · Free
            </div>
            {phase === "quiz" && (
              <div className="mt-2 text-xs text-slate-500">
                Question {idx + 1} of {questions.length}
              </div>
            )}
          </div>

          {phase === "quiz" && (
            <div className="w-full max-w-xs">
              <div className="h-1.5 overflow-hidden rounded-full bg-navy-100">
                <motion.div
                  className="h-full bg-gradient-to-r from-sky-500 to-orange-500"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>
          )}
        </div>

        {phase === "profile" && (
          profileLoading ? (
            <div className="mx-auto max-w-2xl rounded-3xl bg-white p-10 text-center text-sm text-slate-500 shadow-soft ring-1 ring-navy-100">
              Loading your profile…
            </div>
          ) : (
            <PersonalityQuiz
              onComplete={async (p) => {
                setProfileOverride(p);
                await refreshProfile();
                setPhase("quiz");
              }}
              onSkip={() => setPhase("quiz")}
            />
          )
        )}

        {phase === "quiz" && q && (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <QuestionCard
                  question={q}
                  index={idx}
                  onAnswer={record}
                  initial={answers[q.id]}
                  preferredTheme={profile?.visualTheme}
                />
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={prev}
                disabled={idx === 0}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-inset transition-colors",
                  idx === 0
                    ? "bg-white text-slate-300 ring-navy-100"
                    : "bg-white text-navy-700 ring-navy-100 hover:bg-navy-50"
                )}
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <div className="text-xs text-slate-500">
                {answered ? "Answer recorded" : "Choose your answer"}
              </div>
              <Button size="md" onClick={next} disabled={!answered}>
                {isLast ? "See my results" : "Next"} <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}

        {phase === "done" && result && (
          <AssessmentResults
            year={year}
            result={result}
            questions={questions}
            answers={Object.values(answers)}
            profile={profile}
            onRetake={() => {
              setAnswers({});
              setIdx(0);
              setPhase("quiz");
            }}
          />
        )}

        <div className="mt-10 text-center text-xs text-slate-400">
          Prefer a tutor?{" "}
          <Link href="/contact#assessment" className="font-semibold text-sky-700 hover:text-sky-800">
            Book a full 45-min assessment
          </Link>
        </div>
      </Container>
    </section>
  );
}
