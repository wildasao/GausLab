"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles, Check } from "lucide-react";
import {
  PERSONALITY_QUESTIONS,
  saveProfile,
  EMPTY_PROFILE,
  type PersonalityProfile,
  type Interest,
  type LearningStyle,
  type Confidence,
  type Motivation,
  type VisualTheme,
} from "@/lib/personality";
import { cn } from "@/lib/cn";

export function PersonalityQuiz({
  onComplete,
  onSkip,
}: {
  onComplete: (p: PersonalityProfile) => void;
  onSkip?: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const [profile, setProfile] = useState<PersonalityProfile>({ ...EMPTY_PROFILE });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const q = PERSONALITY_QUESTIONS[idx];
  const total = PERSONALITY_QUESTIONS.length;
  const isLast = idx === total - 1;
  const progress = ((idx + 1) / total) * 100;

  function answerSingle<T extends string>(key: "learningStyle" | "confidence" | "motivation" | "visualTheme", value: T) {
    setProfile((p) => ({ ...p, [key]: value } as PersonalityProfile));
  }

  function toggleInterest(v: Interest, max: number) {
    setProfile((p) => {
      const has = p.interests.includes(v);
      let next: Interest[];
      if (has) next = p.interests.filter((x) => x !== v);
      else if (p.interests.length >= max) return p; // ignore extra picks
      else next = [...p.interests, v];
      return { ...p, interests: next };
    });
  }

  const answered = (() => {
    if (q.key === "interests") return profile.interests.length > 0;
    return (profile[q.key] as string | null) !== null;
  })();

  async function complete() {
    setSaving(true);
    setError(null);
    const res = await saveProfile(profile);
    if (!res.ok) {
      setError(res.error ?? "Save failed");
      setSaving(false);
      return;
    }
    onComplete(profile);
  }

  return (
    <section className="mx-auto max-w-2xl">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-navy-700 shadow-soft ring-1 ring-navy-100">
            <Sparkles className="h-3.5 w-3.5 text-orange-500" /> Quick personality quiz · 30 seconds
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Question {idx + 1} of {total}
          </div>
        </div>
        <div className="w-40">
          <div className="h-1.5 overflow-hidden rounded-full bg-navy-100">
            <motion.div
              className="h-full bg-gradient-to-r from-sky-500 to-orange-500"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.section
          key={q.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-100 sm:p-8"
        >
          <h2 className="font-display text-xl font-semibold text-navy-800 sm:text-2xl">
            {q.prompt}
          </h2>
          {q.key === "interests" && (
            <p className="mt-1 text-xs text-slate-500">Pick up to {q.maxPicks}.</p>
          )}

          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {q.kind === "multi" && q.key === "interests" &&
              q.options.map((o) => {
                const active = profile.interests.includes(o.id);
                const disabled = !active && profile.interests.length >= q.maxPicks;
                return (
                  <li key={o.id}>
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => toggleInterest(o.id, q.maxPicks)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition-colors ring-1 ring-inset",
                        active
                          ? "bg-sky-50 text-navy-800 ring-sky-300"
                          : "bg-white text-navy-800 ring-navy-100 hover:bg-mist",
                        disabled && "opacity-50"
                      )}
                    >
                      <span className="text-xl">{o.emoji}</span>
                      <span className="flex-1 font-medium">{o.label}</span>
                      {active && <Check className="h-4 w-4 text-sky-600" />}
                    </button>
                  </li>
                );
              })}
            {q.kind === "single" &&
              q.options.map((o) => {
                const current = profile[q.key];
                const active = current === o.id;
                return (
                  <li key={o.id}>
                    <button
                      type="button"
                      onClick={() =>
                        answerSingle(
                          q.key as "learningStyle" | "confidence" | "motivation" | "visualTheme",
                          o.id as LearningStyle | Confidence | Motivation | VisualTheme
                        )
                      }
                      className={cn(
                        "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition-colors ring-1 ring-inset",
                        active
                          ? "bg-sky-50 text-navy-800 ring-sky-300"
                          : "bg-white text-navy-800 ring-navy-100 hover:bg-mist"
                      )}
                    >
                      <span className="text-xl">{o.emoji}</span>
                      <span className="flex-1 font-medium">{o.label}</span>
                      {active && <Check className="h-4 w-4 text-sky-600" />}
                    </button>
                  </li>
                );
              })}
          </ul>
        </motion.section>
      </AnimatePresence>

      {error && (
        <div className="mt-3 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-inset ring-rose-200" role="alert">
          {error}
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
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

        <div className="flex flex-wrap items-center gap-2">
          {onSkip && (
            <button
              type="button"
              onClick={onSkip}
              className="text-xs font-semibold text-slate-500 hover:text-navy-700"
            >
              Skip for now
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (isLast) void complete();
              else setIdx((i) => Math.min(total - 1, i + 1));
            }}
            disabled={!answered || saving}
            className="inline-flex items-center gap-1 rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
          >
            {isLast ? (saving ? "Saving…" : "Start my diagnostic") : "Next"} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
