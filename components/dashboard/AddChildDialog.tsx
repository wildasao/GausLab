"use client";

import { useState } from "react";
import { X, Sparkles } from "lucide-react";
import { getSupabaseBrowser } from "@/lib/supabase/browser";
import { cn } from "@/lib/cn";

const YEARS = [3, 5, 7, 9] as const;
const AVATARS = [
  "from-sky-500 to-sky-700",
  "from-orange-500 to-orange-600",
  "from-emerald-500 to-emerald-600",
  "from-navy-500 to-navy-700",
  "from-fuchsia-500 to-fuchsia-700",
];

export function AddChildDialog({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (studentId: string) => void;
}) {
  const [name, setName] = useState("");
  const [year, setYear] = useState<3 | 5 | 7 | 9>(5);
  const [avatar, setAvatar] = useState<string>(AVATARS[0]);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setStatus("saving");
    setError(null);
    const supabase = getSupabaseBrowser();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("You need to sign in first.");
      setStatus("error");
      return;
    }
    const { data, error: err } = await supabase
      .from("students")
      .insert({
        parent_id: user.id,
        name: trimmed,
        year,
        target_band: year + 3,
        current_band: year + 2,
        mastery: 0,
        streak_days: 0,
        hours_term: 0,
        avatar_gradient: avatar,
      })
      .select()
      .single();
    if (err || !data) {
      setError(err?.message ?? "Could not create student.");
      setStatus("error");
      return;
    }
    onCreated(data.id);
  }

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-navy-900/60 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div className="absolute left-1/2 top-1/2 w-[min(94vw,480px)] -translate-x-1/2 -translate-y-1/2">
        <form
          onSubmit={onSubmit}
          className="relative rounded-3xl bg-white p-6 shadow-lift ring-1 ring-navy-100"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full text-slate-500 hover:bg-navy-50"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-semibold text-orange-700 ring-1 ring-inset ring-orange-200">
            <Sparkles className="h-3 w-3" /> Add another child
          </div>
          <h2 className="mt-3 font-display text-xl font-semibold text-navy-800">
            Set up a new workspace
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            The dashboard will scope modules, progress and messages to this child.
          </p>

          <div className="mt-5 space-y-4">
            <div>
              <label htmlFor="child-name" className="mb-1.5 block text-xs font-semibold text-navy-700">
                Child&rsquo;s name
              </label>
              <input
                id="child-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Noah L."
                className="w-full rounded-full border border-navy-100 bg-white px-4 py-3 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-navy-700">
                Year level (NAPLAN)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {YEARS.map((y) => (
                  <button
                    key={y}
                    type="button"
                    onClick={() => setYear(y)}
                    aria-pressed={year === y}
                    className={cn(
                      "rounded-2xl border px-3 py-2 text-sm font-semibold transition-colors",
                      year === y
                        ? "border-navy-700 bg-navy-700 text-white"
                        : "border-navy-100 bg-white text-navy-700 hover:bg-navy-50"
                    )}
                  >
                    Year {y}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-navy-700">
                Avatar colour
              </label>
              <div className="flex gap-2">
                {AVATARS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAvatar(a)}
                    aria-label={`Avatar ${a}`}
                    aria-pressed={avatar === a}
                    className={cn(
                      "h-10 w-10 rounded-full bg-gradient-to-br ring-2 transition-transform",
                      a,
                      avatar === a ? "ring-navy-800 scale-110" : "ring-transparent"
                    )}
                  />
                ))}
              </div>
            </div>

            {error && (
              <div className="rounded-2xl bg-rose-50 px-3 py-2 text-xs text-rose-700 ring-1 ring-inset ring-rose-200" role="alert">
                {error}
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-navy-700 ring-1 ring-navy-100 hover:bg-navy-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || status === "saving"}
              className="inline-flex items-center gap-1.5 rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-70"
            >
              {status === "saving" ? "Adding…" : "Add child"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
