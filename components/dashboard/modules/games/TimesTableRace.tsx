"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, Timer, Trophy, Zap, Flame, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";

type Q = { a: number; b: number; choices: number[]; correct: number };

const BEST_KEY = "gauslab.times-table-race.best";

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeQuestion(maxFactor: number): Q {
  const a = randInt(2, maxFactor);
  const b = randInt(2, maxFactor);
  const correct = a * b;
  const distractors = new Set<number>();
  while (distractors.size < 3) {
    const jitter = randInt(-Math.max(2, Math.round(correct * 0.15)), Math.max(2, Math.round(correct * 0.15)));
    const cand = correct + jitter;
    if (cand !== correct && cand > 0 && !distractors.has(cand)) distractors.add(cand);
  }
  const choices = [correct, ...distractors].sort(() => Math.random() - 0.5);
  return { a, b, choices, correct };
}

type Phase = "idle" | "playing" | "over";

export function TimesTableRace({ durationSeconds = 60 }: { durationSeconds?: number }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [best, setBest] = useState<number>(0);
  const [q, setQ] = useState<Q>(() => makeQuestion(5));
  const [feedback, setFeedback] = useState<null | { picked: number; ok: boolean }>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load best score
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(BEST_KEY);
    setBest(raw ? Number(raw) || 0 : 0);
  }, []);

  const maxFactor = useMemo(() => {
    if (streak >= 8) return 12;
    if (streak >= 4) return 10;
    if (streak >= 2) return 7;
    return 5;
  }, [streak]);

  const nextQuestion = useCallback(() => {
    setQ(makeQuestion(maxFactor));
    setFeedback(null);
  }, [maxFactor]);

  const start = useCallback(() => {
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setTimeLeft(durationSeconds);
    setFeedback(null);
    setQ(makeQuestion(5));
    setPhase("playing");
  }, [durationSeconds]);

  const stop = useCallback(() => {
    setPhase("over");
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  // Tick timer
  useEffect(() => {
    if (phase !== "playing") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = null;
          setPhase("over");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  // Persist best on game over
  useEffect(() => {
    if (phase !== "over") return;
    if (score > best && typeof window !== "undefined") {
      window.localStorage.setItem(BEST_KEY, String(score));
      setBest(score);
    }
  }, [phase, score, best]);

  const onAnswer = (choice: number) => {
    if (phase !== "playing" || feedback) return;
    const ok = choice === q.correct;
    setFeedback({ picked: choice, ok });
    if (ok) {
      setScore((s) => s + 1);
      setStreak((s) => {
        const ns = s + 1;
        setBestStreak((b) => Math.max(b, ns));
        return ns;
      });
    } else {
      setStreak(0);
    }
    // brief feedback pause then next
    setTimeout(nextQuestion, ok ? 350 : 700);
  };

  return (
    <section className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-100">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-semibold text-orange-700 ring-1 ring-inset ring-orange-200">
            <Zap className="h-3 w-3" /> Times Table Race · Mini-game
          </div>
          <h3 className="mt-2 font-display text-lg font-semibold text-navy-800">
            60 seconds. How many can you get right?
          </h3>
          <p className="mt-1 max-w-md text-xs leading-relaxed text-slate-600">
            The faster your streak, the harder the questions. Ready?
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <Stat icon={Trophy} label="Best" value={best} color="text-orange-600" />
        </div>
      </div>

      {/* Play area */}
      <div className="mt-6 overflow-hidden rounded-3xl bg-gradient-to-br from-navy-800 via-navy-700 to-sky-800 p-6 text-white shadow-lift">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <TimerRing seconds={timeLeft} total={durationSeconds} active={phase === "playing"} />
            <div className="flex flex-col leading-tight">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-sky-200">Time left</div>
              <div className="font-display text-xl font-semibold">{timeLeft}s</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <MiniStat icon={Trophy} label="Score" value={score} tone="text-orange-300" />
            <MiniStat icon={Flame} label="Streak" value={streak} tone="text-emerald-300" />
          </div>
        </div>

        <div className="mt-6 min-h-[260px]">
          {phase === "idle" && (
            <div className="grid place-items-center py-10">
              <button
                type="button"
                onClick={start}
                className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lift hover:bg-orange-600"
              >
                <Play className="h-4 w-4" /> Start the race
              </button>
              <p className="mt-3 text-center text-xs text-navy-200">
                Answer fast — a streak of 4 unlocks harder questions.
              </p>
            </div>
          )}

          {phase === "playing" && (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${q.a}-${q.b}-${q.correct}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center"
              >
                <div className="text-[10px] font-semibold uppercase tracking-widest text-sky-200">
                  Solve
                </div>
                <div className="mt-2 font-display text-5xl font-semibold sm:text-6xl">
                  {q.a}
                  <span className="mx-3 text-white/60">×</span>
                  {q.b}
                  <span className="mx-3 text-white/60">=</span>
                  <span className="text-orange-300">?</span>
                </div>

                <div className="mt-6 grid w-full max-w-md grid-cols-2 gap-3 sm:grid-cols-4">
                  {q.choices.map((c) => {
                    const isPicked = feedback?.picked === c;
                    const isCorrect = c === q.correct;
                    const revealed = feedback !== null;
                    const cls = revealed && isCorrect
                      ? "bg-emerald-500 text-white ring-emerald-500"
                      : revealed && isPicked && !isCorrect
                      ? "bg-rose-500 text-white ring-rose-500"
                      : "bg-white/10 text-white ring-white/15 hover:bg-white/15";
                    return (
                      <motion.button
                        key={c}
                        type="button"
                        onClick={() => onAnswer(c)}
                        disabled={revealed}
                        whileTap={{ scale: 0.94 }}
                        className={cn(
                          "rounded-2xl px-3 py-3 font-display text-xl font-semibold ring-1 ring-inset transition-colors sm:text-2xl",
                          cls
                        )}
                      >
                        {c}
                      </motion.button>
                    );
                  })}
                </div>

                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset",
                      feedback.ok
                        ? "bg-emerald-500/15 text-emerald-200 ring-emerald-400/40"
                        : "bg-rose-500/15 text-rose-200 ring-rose-400/40"
                    )}
                  >
                    {feedback.ok ? (
                      <>
                        <Sparkles className="h-3.5 w-3.5" /> Nice! {q.a} × {q.b} = {q.correct}
                      </>
                    ) : (
                      <>Missed — {q.a} × {q.b} = {q.correct}</>
                    )}
                  </motion.div>
                )}

                {streak >= 3 && (
                  <div className="mt-2 text-[11px] text-orange-300">
                    🔥 On fire — {streak} in a row
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}

          {phase === "over" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid place-items-center py-6 text-center"
            >
              <Trophy className="h-10 w-10 text-orange-300" />
              <div className="mt-2 font-display text-3xl font-semibold text-white">
                {score} correct
              </div>
              <div className="mt-1 text-xs text-navy-200">
                Best streak: {bestStreak} · Personal best: {Math.max(best, score)}
              </div>
              {score > 0 && score === best && (
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-orange-500/20 px-3 py-1 text-[11px] font-semibold text-orange-200 ring-1 ring-inset ring-orange-400/40">
                  <Sparkles className="h-3 w-3" /> New personal best!
                </div>
              )}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={start}
                  className="inline-flex items-center gap-1.5 rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600"
                >
                  <RotateCcw className="h-4 w-4" /> Play again
                </button>
                {phase === "over" && (
                  <button
                    type="button"
                    onClick={() => setPhase("idle")}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-inset ring-white/15 hover:bg-white/15"
                  >
                    Back
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {phase === "playing" && (
          <button
            type="button"
            onClick={stop}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-[11px] font-semibold text-navy-100 ring-1 ring-inset ring-white/10 hover:bg-white/10"
          >
            End early
          </button>
        )}
      </div>
    </section>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="rounded-full bg-mist px-3 py-1 ring-1 ring-inset ring-navy-100">
      <div className="flex items-center gap-1.5">
        <Icon className={cn("h-3.5 w-3.5", color)} />
        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">{label}</span>
        <span className={cn("font-display text-sm font-semibold", color)}>{value}</span>
      </div>
    </div>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className={cn("h-4 w-4", tone)} />
      <div className="flex flex-col leading-none">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-sky-200">
          {label}
        </span>
        <span className="font-display text-lg font-semibold text-white">{value}</span>
      </div>
    </div>
  );
}

function TimerRing({ seconds, total, active }: { seconds: number; total: number; active: boolean }) {
  const R = 22;
  const C = 2 * Math.PI * R;
  const dash = (seconds / total) * C;
  const warn = seconds <= 10 && seconds > 0;
  return (
    <div className="relative grid h-14 w-14 place-items-center">
      <svg viewBox="0 0 60 60" className="h-14 w-14 -rotate-90">
        <circle cx="30" cy="30" r={R} stroke="rgba(255,255,255,0.12)" strokeWidth="6" fill="none" />
        <circle
          cx="30"
          cy="30"
          r={R}
          stroke={warn ? "#F97316" : "#0EA5E9"}
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${C}`}
          style={{ transition: active ? "stroke-dasharray 1s linear, stroke 0.2s" : undefined }}
        />
      </svg>
      <Timer className="absolute h-4 w-4 text-white/80" />
    </div>
  );
}
