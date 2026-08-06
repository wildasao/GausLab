"use client";

import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Beaker, Save, Trash2, Sparkles, CheckCircle2 } from "lucide-react";
import { saveProblem, deleteProblem, useMyProblems, type ProblemKind, type SavedProblem } from "@/lib/problems";
import { useDashboard } from "@/lib/dashboard-context";
import { useModuleContext } from "./ModuleContext";
import { cn } from "@/lib/cn";

export function LabShell({
  kind,
  title,
  subtitle,
  visual,
  config,
  computedAnswer,
  storyPlaceholder,
  renderSaved,
}: {
  kind: ProblemKind;
  title: string;
  subtitle: string;
  visual: ReactNode;
  config: Record<string, unknown>;
  computedAnswer: string;
  storyPlaceholder: string;
  renderSaved?: (p: SavedProblem) => ReactNode;
}) {
  const { activeStudent } = useDashboard();
  const moduleSlug = useModuleContext();
  const [story, setStory] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const { rows, refresh } = useMyProblems(moduleSlug, activeStudent?.id);

  async function onSave() {
    setStatus("saving");
    setError(null);
    const res = await saveProblem({
      studentId: activeStudent?.id,
      moduleSlug,
      kind,
      config,
      story: story || `A ${kind} problem I created`,
      answer: computedAnswer,
    });
    if (!res.ok) {
      setStatus("error");
      setError(res.error);
      return;
    }
    setStatus("saved");
    setStory("");
    await refresh();
    setTimeout(() => setStatus("idle"), 1600);
  }

  async function onDelete(id: string) {
    await deleteProblem(id);
    await refresh();
  }

  return (
    <section className="rounded-3xl bg-gradient-to-br from-fuchsia-50 via-white to-sky-50 p-6 shadow-soft ring-1 ring-navy-100 sm:p-8">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-orange-500 text-white shadow-soft">
          <Beaker className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-fuchsia-600">
            Lab — build your own problem
          </div>
          <h3 className="mt-0.5 font-display text-lg font-semibold text-navy-800">{title}</h3>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">{subtitle}</p>
        </div>
      </div>

      {/* Interactive visual (owned by parent lab) */}
      <div className="mt-6">{visual}</div>

      {/* Author fields */}
      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr,auto]">
        <div>
          <label
            htmlFor="lab-story"
            className="mb-1.5 block text-xs font-semibold text-navy-700"
          >
            Write the story
          </label>
          <textarea
            id="lab-story"
            rows={3}
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder={storyPlaceholder}
            className="w-full rounded-2xl border border-navy-100 bg-white px-4 py-3 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          />
        </div>
        <div className="lg:w-56">
          <label className="mb-1.5 block text-xs font-semibold text-navy-700">Your answer</label>
          <div className="grid h-[70%] place-items-center rounded-2xl bg-navy-800 p-3 text-white">
            <div className="text-center">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-sky-300">
                Auto-computed
              </div>
              <div className="mt-1 font-display text-2xl font-semibold">{computedAnswer}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Save row */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-slate-500">
          {activeStudent
            ? `Saves to ${activeStudent.name.split(" ")[0]}'s collection`
            : "Sign in to save your creations"}
        </div>
        <button
          type="button"
          onClick={onSave}
          disabled={status === "saving"}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
            status === "saved"
              ? "bg-emerald-500 text-white"
              : "bg-navy-700 text-white hover:bg-navy-800 disabled:opacity-70"
          )}
        >
          {status === "saved" ? (
            <>
              <CheckCircle2 className="h-4 w-4" /> Saved!
            </>
          ) : (
            <>
              <Save className="h-4 w-4" /> Save my problem
            </>
          )}
        </button>
      </div>
      {status === "error" && error && (
        <div className="mt-3 rounded-2xl bg-rose-50 px-3 py-2 text-xs text-rose-700 ring-1 ring-inset ring-rose-200" role="alert">
          {error}
        </div>
      )}

      {/* My collection */}
      <div className="mt-6 border-t border-navy-100 pt-5">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-orange-600">
              <Sparkles className="h-3 w-3" /> My problems
            </div>
            <div className="mt-0.5 text-xs text-slate-500">
              {rows.length} saved
            </div>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {rows.length === 0 ? (
            <div className="mt-3 rounded-2xl bg-white p-6 text-center text-xs text-slate-500 ring-1 ring-navy-100">
              Save your first problem above — it&rsquo;ll appear here forever.
            </div>
          ) : (
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {rows.map((p) => (
                <motion.li
                  key={p.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="group flex items-start gap-3 rounded-2xl bg-white p-3 ring-1 ring-navy-100"
                >
                  <div className="min-w-0 flex-1">
                    <div className="line-clamp-2 text-sm font-semibold text-navy-800">
                      {p.story || `A ${p.kind} problem`}
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500">
                      Answer: <span className="font-semibold text-navy-700">{p.answer}</span> ·{" "}
                      {new Date(p.createdAt).toLocaleDateString("en-AU", { day: "numeric", month: "short" })}
                    </div>
                    {renderSaved && <div className="mt-2">{renderSaved(p)}</div>}
                  </div>
                  <button
                    type="button"
                    aria-label="Delete"
                    onClick={() => onDelete(p.id)}
                    className="opacity-0 grid h-8 w-8 place-items-center rounded-full text-slate-400 transition-opacity hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </motion.li>
              ))}
            </ul>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
