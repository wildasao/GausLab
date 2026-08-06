"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, RotateCcw, HelpCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";
import type { QuestionVisual as QV } from "@/lib/modules";
import { QuestionVisual } from "./QuestionVisual";

type State = "idle" | "correct" | "incorrect";

export function McqQuestion({
  prompt,
  choices,
  answerIndex,
  explanation,
  hint,
  visual,
  onAnswer,
}: {
  prompt: string;
  choices: string[];
  answerIndex: number;
  explanation: string;
  hint?: string;
  visual?: QV;
  onAnswer?: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [state, setState] = useState<State>("idle");
  const [showHint, setShowHint] = useState(false);

  function submit() {
    if (selected === null) return;
    const ok = selected === answerIndex;
    setState(ok ? "correct" : "incorrect");
    onAnswer?.(ok);
  }

  function reset() {
    setSelected(null);
    setState("idle");
    setShowHint(false);
  }

  return (
    <QuestionShell
      prompt={prompt}
      state={state}
      hint={hint}
      showHint={showHint}
      onHint={() => setShowHint(true)}
      onReset={reset}
      onSubmit={submit}
      canSubmit={selected !== null}
      explanation={explanation}
      visual={visual}
    >
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {choices.map((c, i) => {
          const isSelected = selected === i;
          const isCorrect = i === answerIndex;
          const revealed = state !== "idle";
          const highlight =
            revealed && isCorrect
              ? "border-emerald-300 bg-emerald-50 text-emerald-900"
              : revealed && isSelected && !isCorrect
              ? "border-rose-300 bg-rose-50 text-rose-900"
              : isSelected
              ? "border-sky-300 bg-sky-50 text-navy-900"
              : "border-navy-100 bg-white text-navy-800 hover:border-sky-200 hover:bg-sky-50/40";
          const letter = String.fromCharCode(65 + i);
          return (
            <li key={c}>
              <button
                type="button"
                disabled={revealed}
                onClick={() => setSelected(i)}
                aria-pressed={isSelected}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition-colors",
                  highlight,
                  revealed && "cursor-default"
                )}
              >
                <span
                  className={cn(
                    "grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-semibold ring-1 ring-inset",
                    revealed && isCorrect
                      ? "bg-emerald-500 text-white ring-emerald-500"
                      : revealed && isSelected && !isCorrect
                      ? "bg-rose-500 text-white ring-rose-500"
                      : isSelected
                      ? "bg-sky-500 text-white ring-sky-500"
                      : "bg-navy-50 text-navy-700 ring-navy-100"
                  )}
                >
                  {letter}
                </span>
                <span className="text-left">{c}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </QuestionShell>
  );
}

export function NumericQuestion({
  prompt,
  answer,
  unit,
  tolerance = 0,
  explanation,
  hint,
  visual,
  onAnswer,
}: {
  prompt: string;
  answer: number;
  unit?: string;
  tolerance?: number;
  explanation: string;
  hint?: string;
  visual?: QV;
  onAnswer?: (correct: boolean) => void;
}) {
  const [value, setValue] = useState("");
  const [state, setState] = useState<State>("idle");
  const [showHint, setShowHint] = useState(false);

  function submit() {
    const num = parseFloat(value.replace(/,/g, "."));
    if (Number.isNaN(num)) {
      setState("incorrect");
      return;
    }
    const ok = Math.abs(num - answer) <= tolerance;
    setState(ok ? "correct" : "incorrect");
    onAnswer?.(ok);
  }

  function reset() {
    setValue("");
    setState("idle");
    setShowHint(false);
  }

  return (
    <QuestionShell
      prompt={prompt}
      state={state}
      hint={hint}
      showHint={showHint}
      onHint={() => setShowHint(true)}
      onReset={reset}
      onSubmit={submit}
      canSubmit={value.trim() !== ""}
      explanation={explanation}
      visual={visual}
    >
      <div className="mt-4 flex items-center gap-3">
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={state !== "idle"}
          placeholder="Type your answer…"
          className={cn(
            "w-full max-w-xs rounded-full border px-4 py-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400",
            state === "correct"
              ? "border-emerald-300 bg-emerald-50 text-emerald-900"
              : state === "incorrect"
              ? "border-rose-300 bg-rose-50 text-rose-900"
              : "border-navy-100 bg-white text-navy-900"
          )}
        />
        {unit && <span className="text-sm font-semibold text-slate-600">{unit}</span>}
      </div>
    </QuestionShell>
  );
}

// ─── Shared shell ─────────────────────────────────────────────────
function QuestionShell({
  prompt,
  state,
  children,
  hint,
  showHint,
  onHint,
  onReset,
  onSubmit,
  canSubmit,
  explanation,
  visual,
}: {
  prompt: string;
  state: State;
  children: React.ReactNode;
  hint?: string;
  showHint: boolean;
  onHint: () => void;
  onReset: () => void;
  onSubmit: () => void;
  canSubmit: boolean;
  explanation: string;
  visual?: QV;
}) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-100">
      {visual && <QuestionVisual visual={visual} />}

      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-widest text-orange-600">
            Try it yourself
          </div>
          <p className="mt-2 text-base leading-relaxed text-navy-800">{prompt}</p>
        </div>
      </div>

      {children}

      <AnimatePresence>
        {showHint && hint && state === "idle" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 overflow-hidden"
          >
            <div className="rounded-2xl bg-sky-50 p-3 text-sm text-sky-900 ring-1 ring-inset ring-sky-200">
              <div className="mb-1 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-sky-700">
                <Sparkles className="h-3 w-3" /> Hint
              </div>
              {hint}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {state !== "idle" && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "mt-4 rounded-2xl p-4 ring-1 ring-inset",
            state === "correct"
              ? "bg-emerald-50 text-emerald-900 ring-emerald-200"
              : "bg-rose-50 text-rose-900 ring-rose-200"
          )}
        >
          <div className="flex items-center gap-2 text-sm font-semibold">
            {state === "correct" ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Nice work — that's correct!
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 text-rose-600" /> Not quite — try again.
              </>
            )}
          </div>
          <p className="mt-2 text-sm leading-relaxed">{explanation}</p>
        </motion.div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {state === "idle" ? (
            <>
              <button
                type="button"
                onClick={onSubmit}
                disabled={!canSubmit}
                className="inline-flex items-center gap-1.5 rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
              >
                Check answer
              </button>
              {hint && !showHint && (
                <button
                  type="button"
                  onClick={onHint}
                  className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-4 py-2 text-xs font-semibold text-sky-700 ring-1 ring-inset ring-sky-200 hover:bg-sky-100"
                >
                  <HelpCircle className="h-3.5 w-3.5" /> Show hint
                </button>
              )}
            </>
          ) : (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 rounded-full bg-navy-50 px-4 py-2 text-xs font-semibold text-navy-700 hover:bg-navy-100"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Try again
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
