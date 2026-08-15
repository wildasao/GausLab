"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
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
import { MODULE_RECS, isCorrect, buildFeedback } from "@/lib/assessment";
import type { PersonalityProfile } from "@/lib/personality";
import { overallToneFor } from "@/lib/personality";
import { StrandRing } from "@/components/assessment/StrandRing";
import { Lightbulb, XCircle } from "lucide-react";
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
  profile,
  onRetake,
}: {
  year: AssessmentYear;
  result: ScoreBreakdown;
  questions: Question[];
  answers: Answer[];
  profile?: PersonalityProfile | null;
  onRetake: () => void;
}) {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const [email, setEmail] = useState("");
  const [parentName, setParentName] = useState("");
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const autoSavedRef = useRef(false);

  // On mount: fetch signed-in user; pre-fill and auto-save
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      const u = data.user;
      if (u) {
        setAuthed(true);
        const meta = (u.user_metadata as { full_name?: string }) ?? {};
        setEmail(u.email ?? "");
        setParentName(meta.full_name ?? "");
        if (!autoSavedRef.current) {
          autoSavedRef.current = true;
          await persist({
            email: u.email ?? "",
            parentName: meta.full_name ?? "",
            userId: u.id,
          });
        }
      } else {
        setAuthed(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  async function persist(input: { email: string; parentName: string; userId?: string }) {
    setStatus("saving");
    setError(null);
    try {
      const { error: err } = await supabase.from("assessment_results").insert({
        user_id: input.userId ?? null,
        year,
        parent_name: input.parentName || null,
        email: input.email,
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

  async function saveLead(e: React.FormEvent) {
    e.preventDefault();
    await persist({ email, parentName });
  }

  const recModules = MODULE_RECS[year]
    .map((slug) => getModule(slug))
    .filter((m): m is NonNullable<ReturnType<typeof getModule>> => Boolean(m))
    .slice(0, 3);

  const feedback = useMemo(() => buildFeedback(year, result), [year, result]);
  const strandEntries = Object.entries(result.perStrand) as [
    keyof typeof result.perStrand,
    (typeof result.perStrand)[keyof typeof result.perStrand]
  ][];
  const tone = overallToneFor(profile ?? null);
  const toneOpener =
    tone === "encouraging"
      ? "You showed up and gave it a real go — that matters more than the score. "
      : tone === "stretch"
      ? "Nice work — let's aim higher next. "
      : "";

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

      {/* Overall narrative */}
      <section className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-100 sm:p-8">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-orange-500 text-white shadow-soft">
            <Lightbulb className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-orange-600">
              What this means
            </div>
            <p className="mt-2 text-base leading-relaxed text-navy-800">
              {toneOpener}
              {feedback.overall}
            </p>
          </div>
        </div>
      </section>

      {/* Strand rings + per-strand feedback */}
      <section>
        <div className="mb-4">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
            Per-strand breakdown
          </div>
          <h3 className="mt-1 font-display text-lg font-semibold text-navy-800">
            Where your child is strongest
          </h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {feedback.strands.map((s, i) => {
            const stats = result.perStrand[s.strand];
            return (
              <StrandRing
                key={s.strand + i}
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
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {feedback.strands.map((s) => (
            <div
              key={"body-" + s.strand}
              className="rounded-2xl bg-white p-4 text-xs leading-relaxed text-slate-700 ring-1 ring-navy-100 shadow-soft"
            >
              {s.body}
            </div>
          ))}
        </div>

        {/* Bar chart summary underneath — keeps a quick visual comparison */}
        <div className="mt-6 rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-100">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
            Comparison at a glance
          </div>
          <ul className="mt-4 space-y-3">
            {strandEntries.map(([strand, s], i) => {
              const color = ["from-sky-500 to-sky-700", "from-orange-500 to-orange-600", "from-navy-600 to-navy-800"][i % 3];
              return (
                <li key={String(strand)}>
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="font-semibold text-navy-800">{String(strand)}</span>
                    <span className="text-xs text-slate-500">
                      {s.correct}/{s.total} ·{" "}
                      <span className="font-semibold text-navy-800">{s.pct}%</span>
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
        </div>
      </section>

      {/* Next steps */}
      <section className="rounded-3xl bg-gradient-to-br from-navy-800 via-navy-700 to-sky-800 p-6 text-white shadow-lift sm:p-8">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-sky-200">
          Your child&rsquo;s next steps
        </div>
        <h3 className="mt-1 font-display text-xl font-semibold">
          Turn this snapshot into progress
        </h3>
        <ul className="mt-4 space-y-2 text-sm text-navy-100">
          {feedback.nextSteps.map((step, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
              <span dangerouslySetInnerHTML={{ __html: step.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>") }} />
            </li>
          ))}
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

      {/* Email capture — hidden for logged-in parents (they got auto-saved) */}
      {authed === false && status !== "saved" ? (
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
                {authed ? "Saved to your account" : "Sent — check your inbox"}
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                {authed ? (
                  <>Your Year {year} result is stored on your parent dashboard{email ? <> (<b>{email}</b>)</> : ""}. Want to keep going?</>
                ) : (
                  <>Your report for Year {year} is on its way to <b>{email}</b>. Want to take the next step?</>
                )}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {authed && (
                  <Link
                    href="/portal/dashboard/assessments"
                    className="inline-flex items-center gap-1.5 rounded-full bg-navy-700 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800"
                  >
                    See my diagnostic history <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
                <Link
                  href="/contact#assessment"
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold ${
                    authed
                      ? "bg-white text-navy-700 ring-1 ring-navy-100 hover:bg-navy-50"
                      : "bg-navy-700 text-white hover:bg-navy-800"
                  }`}
                >
                  Book with a tutor {!authed && <ArrowRight className="h-4 w-4" />}
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

      {/* Question review — rich per-question breakdown */}
      <section className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-100 sm:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
              Question-by-question review
            </div>
            <h3 className="mt-1 font-display text-lg font-semibold text-navy-800">
              What your child answered — and what the correct answer was
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setShowBreakdown((v) => !v)}
            className="text-sm font-semibold text-sky-700 hover:text-sky-800"
          >
            {showBreakdown ? "Hide review" : "Show review"} →
          </button>
        </div>
        {showBreakdown && (
          <ul className="mt-5 space-y-3">
            {questions.map((q, i) => {
              const ans = answers.find((a) => a.qid === q.id);
              const ok = ans ? isCorrect(q, ans) : false;
              return (
                <li key={q.id}>
                  <QuestionReviewRow index={i} q={q} ans={ans} ok={ok} />
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

// ─── Rich per-question review row ─────────────────────────────────
function QuestionReviewRow({
  index,
  q,
  ans,
  ok,
}: {
  index: number;
  q: Question;
  ans?: Answer;
  ok: boolean;
}) {
  const yours = formatUserAnswer(q, ans);
  const correct = formatCorrectAnswer(q);
  return (
    <article
      className={
        "rounded-2xl p-4 ring-1 ring-inset " +
        (ok ? "bg-emerald-50/50 ring-emerald-200" : "bg-rose-50/40 ring-rose-200")
      }
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            Q{index + 1} · {q.strand}
          </div>
          <div className="mt-0.5 text-sm font-semibold text-navy-800">{q.prompt}</div>
        </div>
        <span
          className={
            "shrink-0 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset " +
            (ok
              ? "bg-emerald-100 text-emerald-800 ring-emerald-300"
              : "bg-rose-100 text-rose-800 ring-rose-300")
          }
        >
          {ok ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
          {ok ? "Correct" : "Missed"}
        </span>
      </div>

      <dl className="mt-3 grid gap-2 sm:grid-cols-2">
        <div className="rounded-xl bg-white p-3 ring-1 ring-inset ring-navy-100">
          <dt className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            Your answer
          </dt>
          <dd
            className={
              "mt-1 text-sm font-semibold " + (ok ? "text-emerald-700" : "text-rose-700")
            }
          >
            {yours ?? <span className="text-slate-400 italic">Not answered</span>}
          </dd>
        </div>
        <div className="rounded-xl bg-white p-3 ring-1 ring-inset ring-emerald-200">
          <dt className="text-[10px] font-semibold uppercase tracking-widest text-emerald-700">
            Correct answer
          </dt>
          <dd className="mt-1 text-sm font-semibold text-emerald-700">{correct}</dd>
        </div>
      </dl>

      {"explanation" in q && q.explanation && (
        <div className="mt-3 rounded-xl bg-white p-3 text-[12px] leading-relaxed text-slate-700 ring-1 ring-inset ring-navy-100">
          <span className="mr-1 text-[10px] font-semibold uppercase tracking-widest text-navy-500">
            Why:
          </span>
          {q.explanation}
        </div>
      )}
    </article>
  );
}

// ─── Helpers to display answers in plain text ─────────────────────
function formatUserAnswer(q: Question, a?: Answer): string | null {
  if (!a) return null;
  if (q.kind === "mcq" && a.kind === "mcq") {
    return a.picked === null ? null : `${String.fromCharCode(65 + a.picked)}. ${q.choices[a.picked]}`;
  }
  if (q.kind === "numeric" && a.kind === "numeric") {
    return a.picked === null ? null : `${a.picked}${q.unit ? " " + q.unit : ""}`;
  }
  if (q.kind === "multiselect" && a.kind === "multiselect") {
    if (a.picked.length === 0) return null;
    return a.picked.map((i) => q.options[i]).join(", ");
  }
  if (q.kind === "fill-fraction" && a.kind === "fill-fraction") {
    return `${a.picked}/${q.denominator}`;
  }
  return null;
}

function formatCorrectAnswer(q: Question): string {
  if (q.kind === "mcq") {
    return `${String.fromCharCode(65 + q.answerIndex)}. ${q.choices[q.answerIndex]}`;
  }
  if (q.kind === "numeric") {
    return `${q.answer}${q.unit ? " " + q.unit : ""}`;
  }
  if (q.kind === "multiselect") {
    return q.correct.map((i) => q.options[i]).join(", ");
  }
  if (q.kind === "fill-fraction") {
    return `${q.correctNumerator}/${q.denominator}`;
  }
  return "";
}
