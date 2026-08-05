"use client";

import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { FileText, BookOpen, Download, Puzzle, ArrowRight } from "lucide-react";
import { useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/browser";

const packs = [
  {
    icon: FileText,
    title: "NAPLAN Practice Pack",
    body: "20 authentic-style questions per year level, with worked solutions.",
    tag: "PDF · 32 pages",
    tone: "from-sky-500 to-sky-700",
  },
  {
    icon: BookOpen,
    title: "Parent Study Guide",
    body: "Weekly routines and prompts to help maths practice at home.",
    tag: "eBook · 18 pages",
    tone: "from-orange-500 to-orange-600",
  },
  {
    icon: Puzzle,
    title: "Fractions Worksheets",
    body: "Progressive worksheets covering equivalent fractions to operations.",
    tag: "Printable · Y3-Y7",
    tone: "from-navy-600 to-navy-800",
  },
];

export function ResourceCentre() {
  const supabase = getSupabaseBrowser();
  const [email, setEmail] = useState("");
  const [year, setYear] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    const { error } = await supabase.from("leads").insert({
      email,
      child_year: year ? Number(year) : null,
      source: "resource-centre",
    });
    if (error && error.code !== "23505") {
      // 23505 = unique violation → already subscribed, treat as done
      setError(error.message);
      setStatus("error");
      return;
    }
    setStatus("done");
  }
  return (
    <Section
      id="resources"
      className="bg-gradient-to-b from-white to-mist"
      eyebrow="Resource centre"
      title={
        <>
          Free NAPLAN practice, worksheets & guides — <span className="text-sky-600">just for parents</span>.
        </>
      }
      description="Get research-backed resources delivered straight to your inbox. New packs added every month."
    >
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="grid gap-5 sm:grid-cols-2">
            {packs.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.05}>
                <article className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <div
                    aria-hidden
                    className={`absolute -right-14 -top-14 h-32 w-32 rounded-full bg-gradient-to-br ${p.tone} opacity-20 blur-2xl transition-opacity group-hover:opacity-40`}
                  />
                  <div className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${p.tone} text-white shadow-soft`}>
                    <p.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold text-navy-800">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">{p.body}</p>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                      {p.tag}
                    </span>
                    <a
                      href="#resource-form"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-sky-700 hover:text-sky-800"
                    >
                      Download <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
        <div className="lg:col-span-5">
          <Reveal>
            <form
              id="resource-form"
              onSubmit={onSubmit}
              className="relative overflow-hidden rounded-3xl bg-navy-800 p-8 text-white shadow-lift"
            >
              <div
                aria-hidden
                className="absolute inset-0 opacity-60"
                style={{
                  background:
                    "radial-gradient(400px 220px at 20% 0%, rgba(14,165,233,0.3), transparent 60%), radial-gradient(400px 220px at 100% 100%, rgba(249,115,22,0.25), transparent 60%)",
                }}
              />
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-sky-200 ring-1 ring-inset ring-white/10">
                  <Download className="h-3.5 w-3.5" /> Instant email download
                </div>
                <h3 className="mt-4 font-display text-2xl font-semibold sm:text-3xl">
                  Get the full NAPLAN pack free.
                </h3>
                <p className="mt-2 text-sm text-navy-200">
                  Enter your email and we&rsquo;ll send you all three resources, plus monthly maths
                  tips for parents.
                </p>
                <div className="mt-6 space-y-3">
                  <label htmlFor="parent-email" className="sr-only">Parent email</label>
                  <input
                    id="parent-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="parent@example.com"
                    className="w-full rounded-full bg-white/10 px-5 py-3 text-sm text-white placeholder:text-navy-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                  />
                  <label htmlFor="child-year" className="sr-only">Child year level</label>
                  <select
                    id="child-year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    required
                    className="w-full appearance-none rounded-full bg-white/10 px-5 py-3 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                  >
                    <option value="" disabled className="text-slate-800">Child&rsquo;s year level</option>
                    {["3", "5", "7", "9"].map((y) => (
                      <option key={y} value={y} className="text-slate-800">Year {y}</option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    disabled={status === "loading" || status === "done"}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:opacity-70"
                  >
                    {status === "idle" && (<>Send my free pack <ArrowRight className="h-4 w-4" /></>)}
                    {status === "loading" && "Sending…"}
                    {status === "done" && "Sent — check your inbox"}
                    {status === "error" && "Try again"}
                  </button>
                  {status === "error" && error && (
                    <div className="rounded-2xl bg-rose-500/15 px-4 py-2 text-xs text-rose-200 ring-1 ring-inset ring-rose-400/30" role="alert">
                      {error}
                    </div>
                  )}
                </div>
                <p className="mt-3 text-[11px] text-navy-300">
                  We respect your privacy. Unsubscribe anytime. Compliant with Australian Privacy Act.
                </p>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
