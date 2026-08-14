"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Sparkles,
  ArrowRight,
  Send,
  CheckCircle2,
  RotateCcw,
  Play,
  Mail,
} from "lucide-react";
import type { AssessmentYear, ScoreBreakdown, Question, Answer } from "@/lib/assessment";
import { MODULE_RECS, isCorrect } from "@/lib/assessment";
import { getModule } from "@/lib/modules";
import { getSupabaseBrowser } from "@/lib/supabase/browser";

const BAND_TONE = (pct: number) =>
  pct >= 80
    ? "from-emerald-500 to-emerald-600"
    : pct >= 50
    ? "from-sky-500 to-sky-700"
    : "from-orange-500 to-orange-600";

export function AssessmentResults({
  year,
  result,
  questions,
  answers,
  onRetake,
}: {
  year: AssessmentYear;
  result: ScoreBreakdown;
  questions: Question[];
  answers: Answer[];
  onRetake: () => void;
}) {
  const [email, setEmail] = useState("");
  const [parentName, setParentName] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);

  async function saveLead(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setError(null);
    try {
      const supabase = getSupabaseBrowser();
      const { error: err } = await supabase.from("assessment_results").insert({
        year,
        parent_name: parentName || null,
        email,
        score_correct: result.correct,
        score_total: result.total,
        score_pct: result.pct,
        band_estimate: result.bandEstimate.label,
        per_strand: result.perStrand,
        source_url: typeof window !== "undefined" ? window.location.href : null,
      });
      if (err) {
        setError(err.message);
        setStatus("error");
        return;
      }
      setStatus("saved");
    } catch (e2) {
      setError(e2 instanceof Error ? e2.message : "Failed to save");
      setStatus("error");
    }
  }

  const recModules = MODULE_RECS[year]
    .map((slug) => getModule(slug))
    .filter((m): m is NonNullable<ReturnType<typeof getModule>> => Boolean(m))
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Hero result */}
      <section className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${BAND_TONE(result.pct)} p-6 text-white shadow-lift sm:p-10`}>
        <div
          aria-hidden
          className="absolute inset-0 opacity-50"
          style={{
            background:
              "radial-gradient(500px 220px at 20% 0%, rgba(255,255,255,0.35), transparent 60%)",
          }}
        />
        <div className="relative grid gap-6 lg:grid-cols-[auto,1fr] lg:items-center">
          <div className="grid h-28 w-28 shrink-0 place-items-center rounded-full bg-white/15 ring-1 ring-inset ring-white/25">
            <Trophy className="h-12 w-12 text-white" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ring-white/25">
              <Sparkles className="h-3 w-3" /> Year {year} diagnostic result
            </div>
            <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
              {result.correct} / {result.total} correct ({result.pct}%)
            </h2>
            <p className="mt-1 text-sm text-white/85">
              Estimated NAPLAN readiness:{" "}
              <span className="font-semibold text-white">
                {result.bandEstimate.label}
              </span>{" "}
              (Band {result.bandEstimate.low}
              {result.bandEstimate.low !== result.bandEstimate.high ? `–${result.bandEstimate.high}` : ""})
            </p>
          </div>
        </div>
      </section>

      {/* Strand breakdown */}
      <section className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-100 sm:p-8">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
              Per-strand breakdown
            </div>
            <h3 className="mt-1 font-display text-lg font-semibold text-navy-800">
              Where your child is strongest
            </h3>
          </div>
        </div>
        <ul className="mt-5 space-y-3">
          {Object.entries(result.perStrand).map(([strand, s], i) => {
            const color = ["from-sky-500 to-sky-700", "from-orange-500 to-orange-600", "from-navy-600 to-navy-800"][i % 3];
            return (
              <li key={strand}>
                <div className="flex items-baseline justify-between text-sm">
                  <span className="font-semibold text-navy-800">{strand}</span>
                  <span className="text-xs text-slate-500">
                    {s.correct}/{s.total} · <span className="font-semibold text-navy-800">{s.pct}%</span>
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-navy-50">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.pct}%` }}
                    transition={{ duration: 0.9, delay: i * 0.06 }}
                    className={`h-full rounded-full bg-gradient-to-r ${color}`}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Recommended modules */}
      {recModules.length > 0 && (
        <section className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-100 sm:p-8">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-orange-600">
              Where to start
            </div>
            <h3 className="mt-1 font-display text-lg font-semibold text-navy-800">
              Recommended interactive modules for Year {year}
            </h3>
            <p className="mt-1 text-xs text-slate-600">
              Free to try — hands-on lessons with instant feedback.
            </p>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {recModules.map((m) => (
              <Link
                key={m.slug}
                href={`/portal/dashboard/modules/${m.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-navy-100 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift hover:ring-sky-200"
              >
                <div className={`h-16 bg-gradient-to-br ${m.color}`} />
                <div className="flex flex-1 flex-col p-4">
                  <div className="font-display text-sm font-semibold text-navy-800">
                    {m.title}
                  </div>
                  <div className="mt-1 flex-1 text-[11px] text-slate-600 line-clamp-2">{m.subtitle}</div>
                  <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-sky-700">
                    Open <Play className="h-3 w-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Email capture */}
      {status !== "saved" ? (
        <section className="relative overflow-hidden rounded-3xl bg-navy-800 p-6 text-white shadow-lift sm:p-8">
          <div
            aria-hidden
            className="absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(500px 220px at 20% 0%, rgba(14,165,233,0.28), transparent 60%), radial-gradient(500px 220px at 90% 100%, rgba(249,115,22,0.28), transparent 60%)",
            }}
          />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-sky-100 ring-1 ring-inset ring-white/15">
              <Mail className="h-3.5 w-3.5" /> Save your report
            </div>
            <h3 className="mt-3 font-display text-2xl font-semibold sm:text-3xl">
              Get the full report emailed to you.
            </h3>
            <p className="mt-1 max-w-lg text-sm text-navy-200">
              Detailed breakdown, question-level review, and a personalised 4-week
              learning plan. Free — no strings.
            </p>
            <form
              onSubmit={saveLead}
              className="mt-5 grid gap-3 sm:grid-cols-[1fr,1fr,auto]"
            >
              <input
                type="text"
                required
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                placeholder="Parent name"
                className="w-full rounded-full bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-navy-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="parent@example.com"
                className="w-full rounded-full bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-navy-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              />
              <button
                type="submit"
                disabled={status === "saving"}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-70"
              >
                {status === "saving" ? "Sending…" : (<><Send className="h-4 w-4" /> Send report</>)}
              </button>
            </form>
            {error && (
              <div className="mt-3 rounded-2xl bg-rose-500/15 px-3 py-2 text-xs text-rose-200 ring-1 ring-inset ring-rose-400/30" role="alert">
                {error}
              </div>
            )}
            <p className="mt-3 text-[11px] text-navy-300">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </div>
        </section>
      ) : (
        <section className="rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-6 ring-1 ring-navy-100 sm:p-8">
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-500 text-white shadow-lift">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-navy-800">
                Sent — check your inbox
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Your report for Year {year} is on its way to <b>{email}</b>.
                Want to take the next step?
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href="/contact#assessment"
                  className="inline-flex items-center gap-1.5 rounded-full bg-navy-700 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800"
                >
                  Book with a tutor <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/portal/dashboard/modules"
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-navy-700 ring-1 ring-navy-100 hover:bg-navy-50"
                >
                  Try free modules
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Question review */}
      <section className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-100 sm:p-8">
        <button
          type="button"
          onClick={() => setShowBreakdown((v) => !v)}
          className="text-sm font-semibold text-sky-700 hover:text-sky-800"
        >
          {showBreakdown ? "Hide" : "Show"} question-by-question review →
        </button>
        {showBreakdown && (
          <ul className="mt-4 space-y-3">
            {questions.map((q, i) => {
              const ans = answers.find((a) => a.qid === q.id);
              const ok = ans ? isCorrect(q, ans) : false;
              return (
                <li
                  key={q.id}
                  className="rounded-2xl bg-mist p-4 ring-1 ring-inset ring-navy-100"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                        Q{i + 1} · {q.strand}
                      </div>
                      <div className="mt-0.5 text-sm font-semibold text-navy-800">
                        {q.prompt}
                      </div>
                      <div className="mt-1 text-[11px] text-slate-600">{"explanation" in q ? q.explanation : ""}</div>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${
                        ok
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                          : "bg-rose-50 text-rose-700 ring-rose-200"
                      }`}
                    >
                      {ok ? "Correct" : "Missed"}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <div className="text-center">
        <button
          type="button"
          onClick={onRetake}
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-navy-700 ring-1 ring-navy-100 hover:bg-navy-50"
        >
          <RotateCcw className="h-4 w-4" /> Retake with fresh questions
        </button>
      </div>
    </div>
  );
}
