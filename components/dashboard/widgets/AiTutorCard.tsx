"use client";

import { Sparkles, ArrowRight } from "lucide-react";

export function AiTutorCard() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-orange-500 to-orange-600 p-6 text-white shadow-lift">
      <div
        aria-hidden
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(400px 200px at 100% 0%, rgba(255,255,255,0.35), transparent 60%)",
        }}
      />
      <div className="relative">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold text-white ring-1 ring-inset ring-white/30">
          <Sparkles className="h-3.5 w-3.5" /> AI Tutor · New
        </div>
        <h3 className="mt-3 font-display text-xl font-semibold">
          Stuck on homework? Ask the AI tutor.
        </h3>
        <p className="mt-1 max-w-sm text-sm text-white/90">
          Show your working, snap a photo of the question, or ask for a step-by-step hint —
          the AI tutor won&rsquo;t just give the answer.
        </p>
        <button className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50">
          Open AI tutor <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
