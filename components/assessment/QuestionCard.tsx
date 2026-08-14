"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Question, Answer, QuestionVisual } from "@/lib/assessment";
import { Check, CheckSquare, Square } from "lucide-react";
import { cn } from "@/lib/cn";
import { MultiplicationArray } from "@/components/dashboard/modules/visuals/MultiplicationArray";
import { FractionBar } from "@/components/dashboard/modules/visuals/FractionBar";
import { PythagorasTriangle } from "@/components/dashboard/modules/visuals/PythagorasTriangle";
import { PlaceValueBlocks } from "@/components/dashboard/modules/visuals/PlaceValueBlocks";

function VisualRenderer({ v }: { v: QuestionVisual }) {
  if (v.name === "multiplication-array")
    return (
      <MultiplicationArray
        startRows={v.props.rows}
        startCols={v.props.cols}
        startTheme={v.props.theme ?? "apples"}
      />
    );
  if (v.name === "fraction-bar")
    return <FractionBar start={[v.props.num, v.props.den] as [number, number]} />;
  if (v.name === "pythagoras")
    return <PythagorasTriangle a={v.props.a} b={v.props.b} />;
  if (v.name === "place-value-blocks") return <PlaceValueBlocks start={v.props.n} />;
  return null;
}

export function QuestionCard({
  question,
  index,
  onAnswer,
  initial,
}: {
  question: Question;
  index: number;
  onAnswer: (a: Answer) => void;
  initial?: Answer;
}) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-100 sm:p-8">
      <div className="text-[11px] font-semibold uppercase tracking-widest text-orange-600">
        Question {index + 1} · {question.strand}
      </div>
      <h2 className="mt-1 font-display text-xl font-semibold text-navy-800 sm:text-2xl">
        {question.prompt}
      </h2>

      {"visual" in question && question.visual && (
        <div className="mt-5">
          <VisualRenderer v={question.visual} />
        </div>
      )}

      <div className="mt-6">
        {question.kind === "mcq" && (
          <McqInput q={question} onAnswer={onAnswer} initial={initial as Answer | undefined} />
        )}
        {question.kind === "numeric" && (
          <NumericInput q={question} onAnswer={onAnswer} initial={initial as Answer | undefined} />
        )}
        {question.kind === "multiselect" && (
          <MultiselectInput q={question} onAnswer={onAnswer} initial={initial as Answer | undefined} />
        )}
        {question.kind === "fill-fraction" && (
          <FillFractionInput q={question} onAnswer={onAnswer} initial={initial as Answer | undefined} />
        )}
      </div>
    </section>
  );
}

// ─── MCQ ──────────────────────────────────────────────────────────
function McqInput({
  q,
  onAnswer,
  initial,
}: {
  q: Extract<Question, { kind: "mcq" }>;
  onAnswer: (a: Answer) => void;
  initial?: Answer;
}) {
  const initialPick = initial?.kind === "mcq" ? initial.picked : null;
  const [picked, setPicked] = useState<number | null>(initialPick);
  useEffect(() => setPicked(initial?.kind === "mcq" ? initial.picked : null), [q.id, initial]);
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {q.choices.map((c, i) => {
        const active = picked === i;
        return (
          <li key={i}>
            <button
              type="button"
              onClick={() => {
                setPicked(i);
                onAnswer({ qid: q.id, kind: "mcq", picked: i });
              }}
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition-colors ring-1 ring-inset",
                active
                  ? "bg-sky-50 text-navy-800 ring-sky-300"
                  : "bg-white text-navy-800 ring-navy-100 hover:bg-mist"
              )}
            >
              <span
                className={cn(
                  "grid h-7 w-7 place-items-center rounded-full text-xs font-semibold",
                  active
                    ? "bg-sky-500 text-white ring-1 ring-inset ring-sky-500"
                    : "bg-navy-50 text-navy-700 ring-1 ring-inset ring-navy-100"
                )}
              >
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1">{c}</span>
              {active && <Check className="h-4 w-4 text-sky-600" />}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

// ─── Numeric ──────────────────────────────────────────────────────
function NumericInput({
  q,
  onAnswer,
  initial,
}: {
  q: Extract<Question, { kind: "numeric" }>;
  onAnswer: (a: Answer) => void;
  initial?: Answer;
}) {
  const initialVal = initial?.kind === "numeric" && initial.picked !== null ? String(initial.picked) : "";
  const [val, setVal] = useState(initialVal);
  useEffect(() => setVal(initial?.kind === "numeric" && initial.picked !== null ? String(initial.picked) : ""), [q.id, initial]);
  function change(v: string) {
    setVal(v);
    const num = parseFloat(v.replace(",", "."));
    onAnswer({ qid: q.id, kind: "numeric", picked: Number.isNaN(num) ? null : num });
  }
  return (
    <div className="flex items-center gap-3">
      <input
        type="text"
        inputMode="decimal"
        value={val}
        onChange={(e) => change(e.target.value)}
        placeholder="Your answer"
        className="w-full max-w-xs rounded-2xl border border-navy-100 bg-white px-4 py-3 text-lg font-semibold text-navy-800 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
      />
      {q.unit && <span className="text-sm font-semibold text-slate-500">{q.unit}</span>}
    </div>
  );
}

// ─── Multi-select ─────────────────────────────────────────────────
function MultiselectInput({
  q,
  onAnswer,
  initial,
}: {
  q: Extract<Question, { kind: "multiselect" }>;
  onAnswer: (a: Answer) => void;
  initial?: Answer;
}) {
  const initialPicked = initial?.kind === "multiselect" ? initial.picked : [];
  const [picked, setPicked] = useState<number[]>(initialPicked);
  useEffect(() => setPicked(initial?.kind === "multiselect" ? initial.picked : []), [q.id, initial]);
  function toggle(i: number) {
    const next = picked.includes(i) ? picked.filter((x) => x !== i) : [...picked, i].sort();
    setPicked(next);
    onAnswer({ qid: q.id, kind: "multiselect", picked: next });
  }
  return (
    <div>
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
        Tap all that apply
      </div>
      <ul className="grid gap-2 sm:grid-cols-2">
        {q.options.map((o, i) => {
          const on = picked.includes(i);
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => toggle(i)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition-colors ring-1 ring-inset",
                  on
                    ? "bg-sky-50 text-navy-800 ring-sky-300"
                    : "bg-white text-navy-800 ring-navy-100 hover:bg-mist"
                )}
              >
                {on ? (
                  <CheckSquare className="h-5 w-5 text-sky-600" />
                ) : (
                  <Square className="h-5 w-5 text-slate-400" />
                )}
                <span className="flex-1">{o}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ─── Fill fraction (interactive shading) ──────────────────────────
function FillFractionInput({
  q,
  onAnswer,
  initial,
}: {
  q: Extract<Question, { kind: "fill-fraction" }>;
  onAnswer: (a: Answer) => void;
  initial?: Answer;
}) {
  const initialNum = initial?.kind === "fill-fraction" ? initial.picked : 0;
  const [num, setNum] = useState<number>(initialNum);
  useEffect(() => setNum(initial?.kind === "fill-fraction" ? initial.picked : 0), [q.id, initial]);
  function setTo(n: number) {
    setNum(n);
    onAnswer({ qid: q.id, kind: "fill-fraction", picked: n });
  }
  return (
    <div>
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
        Click the segments to shade them
      </div>
      <div className="flex overflow-hidden rounded-2xl ring-1 ring-inset ring-navy-100">
        {Array.from({ length: q.denominator }).map((_, i) => {
          const filled = i < num;
          return (
            <button
              key={i}
              onClick={() => setTo(i + 1 === num ? i : i + 1)}
              className="group relative flex-1 border-r border-white/50 last:border-r-0"
              style={{ height: 80 }}
              aria-label={`Segment ${i + 1}`}
            >
              <motion.div
                animate={{ opacity: filled ? 1 : 0 }}
                transition={{ duration: 0.15 }}
                className="absolute inset-0 bg-gradient-to-b from-orange-400 to-orange-500"
              />
              {!filled && (
                <div className="absolute inset-0 bg-mist group-hover:bg-orange-50" />
              )}
              <div className="pointer-events-none relative grid h-full place-items-center text-sm font-semibold">
                <span className={filled ? "text-white" : "text-slate-400"}>{i + 1}</span>
              </div>
            </button>
          );
        })}
      </div>
      <div className="mt-3 text-xs text-slate-600">
        You&rsquo;ve shaded{" "}
        <span className="font-semibold text-navy-800">
          {num}/{q.denominator}
        </span>{" "}
        of the bar.
      </div>
    </div>
  );
}
