"use client";

import { useState } from "react";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/cn";

type Year = "3" | "5" | "7" | "9";

const programs: Record<
  Year,
  {
    tag: string;
    tagline: string;
    focus: string;
    topics: string[];
    outcome: string;
  }
> = {
  "3": {
    tag: "Foundations",
    tagline: "Build core number fluency and confidence.",
    focus: "Number Sense · Arithmetic · Early Problem Solving",
    topics: [
      "Place value to 10,000",
      "Addition & subtraction strategies",
      "Multiplication tables to 10",
      "Fractions of shapes and sets",
      "Length, area and time",
      "NAPLAN Y3 practice questions",
    ],
    outcome: "Ready for NAPLAN Year 3 — averaging Band 3–5 in Numeracy.",
  },
  "5": {
    tag: "Fluency",
    tagline: "Master fractions, decimals and multi-step problems.",
    focus: "Fractions · Decimals · Measurement · Problem Solving",
    topics: [
      "Equivalent & operations on fractions",
      "Decimals and percentages",
      "Areas, perimeters and volume",
      "Word problems with 2+ steps",
      "Data interpretation & graphs",
      "NAPLAN Y5 strategy sessions",
    ],
    outcome: "Targeting NAPLAN Y5 Bands 6–8 with clear proficiency evidence.",
  },
  "7": {
    tag: "Transition",
    tagline: "Bridge primary maths into high-school algebra.",
    focus: "Algebra · Ratio · Geometry · Statistics",
    topics: [
      "Integers & order of operations",
      "Linear equations & patterns",
      "Ratio, rates and proportion",
      "Angles, triangles & polygons",
      "Data, mean & probability",
      "NAPLAN Y7 exam techniques",
    ],
    outcome: "Confident Year 7 student ready for advanced Year 8 maths.",
  },
  "9": {
    tag: "Advanced",
    tagline: "Sharpen algebra, geometry and NAPLAN under time.",
    focus: "Algebra II · Trigonometry · Statistics · Probability",
    topics: [
      "Quadratics and factorising",
      "Coordinate geometry",
      "Pythagoras & basic trigonometry",
      "Simultaneous equations",
      "Probability trees & statistics",
      "Full NAPLAN Y9 mock exams",
    ],
    outcome: "Strong Band 8–10 performance and a springboard into Year 10.",
  },
};

export function Programs() {
  const [year, setYear] = useState<Year>("5");
  const p = programs[year];
  return (
    <Section
      id="programs"
      className="bg-gradient-to-b from-white via-mist to-white"
      eyebrow="Programs by year level"
      title={
        <>
          Dedicated maths programs for{" "}
          <span className="text-orange-500">Years 3, 5, 7 & 9</span>.
        </>
      }
      description="Every program is written to the Australian Curriculum and reinforced with NAPLAN-style questioning so students are always exam-ready — never just exam-crammed."
    >
      <div className="mx-auto mb-8 inline-flex items-center gap-1 rounded-full bg-white p-1.5 ring-1 ring-navy-100 shadow-soft">
        {(Object.keys(programs) as Year[]).map((y) => (
          <button
            key={y}
            onClick={() => setYear(y)}
            aria-pressed={year === y}
            className={cn(
              "min-w-[80px] rounded-full px-4 py-2 text-sm font-semibold transition-all",
              year === y
                ? "bg-navy-700 text-white shadow-soft"
                : "text-navy-700/70 hover:bg-navy-50"
            )}
          >
            Year {y}
          </button>
        ))}
      </div>

      <Reveal>
        <div className="grid gap-8 rounded-3xl bg-white p-6 ring-1 ring-navy-100 shadow-soft sm:p-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700 ring-1 ring-inset ring-orange-200">
              {p.tag}
            </div>
            <h3 className="mt-4 font-display text-2xl font-semibold text-navy-800 sm:text-3xl">
              Year {year} Maths Program
            </h3>
            <p className="mt-3 text-slate-600">{p.tagline}</p>
            <div className="mt-6 rounded-2xl bg-navy-50/70 p-4 text-sm text-navy-700 ring-1 ring-inset ring-navy-100">
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-navy-500">
                Focus areas
              </div>
              <div className="mt-1 font-medium">{p.focus}</div>
            </div>
            <div className="mt-6 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800 ring-1 ring-inset ring-emerald-200">
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-600">
                Outcome
              </div>
              <div className="mt-1 font-medium">{p.outcome}</div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/contact#assessment" size="md">
                Book Y{year} assessment
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button href="/programs" variant="outline" size="md">
                Full curriculum
              </Button>
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-dashed border-navy-100 bg-mist/60 p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                What we cover
              </div>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {p.topics.map((t) => (
                  <li key={t} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="mt-0.5 grid h-5 w-5 place-items-center rounded-full bg-sky-100 text-sky-700 ring-1 ring-inset ring-sky-200">
                      <Check className="h-3 w-3" />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { k: "Lessons/week", v: year === "9" ? "2" : "1" },
                  { k: "Session length", v: year === "3" ? "45 min" : "60 min" },
                  { k: "Format", v: "1:1 or 3–4 group" },
                ].map((s) => (
                  <div key={s.k} className="rounded-xl bg-white p-3 text-center ring-1 ring-navy-100">
                    <div className="font-display text-lg font-semibold text-navy-800">{s.v}</div>
                    <div className="text-[10px] uppercase tracking-widest text-slate-500">{s.k}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
