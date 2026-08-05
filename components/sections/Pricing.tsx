"use client";

import { useState } from "react";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";

const plans = [
  {
    name: "Essentials",
    price: { weekly: 65, term: 780 },
    tagline: "Weekly small-group tutoring",
    features: [
      "60-min weekly group session",
      "Personalised learning plan",
      "Weekly homework & feedback",
      "Parent progress emails",
      "Access to worksheet library",
    ],
    cta: "Start Essentials",
  },
  {
    name: "Accelerate",
    highlight: true,
    badge: "Most popular",
    price: { weekly: 99, term: 1188 },
    tagline: "1:1 tutoring + NAPLAN focus",
    features: [
      "60-min weekly 1:1 session",
      "NAPLAN mock exams (Y3/5/7/9)",
      "AI homework assistant included",
      "Fortnightly parent-tutor calls",
      "Full portal & progress dashboard",
      "Unlimited resource downloads",
    ],
    cta: "Book Accelerate",
  },
  {
    name: "Elite",
    price: { weekly: 149, term: 1788 },
    tagline: "2× weekly, top NSW tutors",
    features: [
      "2 × 60-min weekly 1:1 sessions",
      "Priority booking with senior tutors",
      "In-person or online",
      "Custom NAPLAN strategy plan",
      "Guaranteed band improvement*",
    ],
    cta: "Talk to admissions",
  },
];

export function Pricing() {
  const [billing, setBilling] = useState<"weekly" | "term">("term");
  return (
    <Section
      id="pricing"
      eyebrow="Transparent pricing"
      title={
        <>
          Simple plans, clear outcomes — <span className="text-sky-600">no lock-in contracts</span>.
        </>
      }
      description="Pay per term (12 weeks) or weekly. Cancel anytime. Every plan starts with a free diagnostic assessment."
    >
      <div className="mx-auto mb-10 inline-flex items-center gap-1 rounded-full bg-white p-1.5 ring-1 ring-navy-100 shadow-soft">
        {(["weekly", "term"] as const).map((b) => (
          <button
            key={b}
            onClick={() => setBilling(b)}
            aria-pressed={billing === b}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition-all",
              billing === b ? "bg-navy-700 text-white" : "text-navy-700/70 hover:bg-navy-50"
            )}
          >
            {b === "weekly" ? "Pay weekly" : "Pay per term"}
            {b === "term" && (
              <span className="ml-2 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold text-orange-700">
                Save 8%
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.06}>
            <article
              className={cn(
                "relative flex h-full flex-col rounded-3xl bg-white p-8 ring-1 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift",
                p.highlight
                  ? "ring-2 ring-orange-400 shadow-lift"
                  : "ring-navy-100"
              )}
            >
              {p.highlight && (
                <div className="absolute -top-3 left-8 inline-flex items-center gap-1 rounded-full bg-orange-500 px-3 py-1 text-[11px] font-semibold text-white shadow-soft">
                  <Sparkles className="h-3 w-3" /> {p.badge}
                </div>
              )}
              <h3 className="font-display text-xl font-semibold text-navy-800">
                {p.name}
              </h3>
              <p className="mt-1 text-sm text-slate-600">{p.tagline}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-4xl font-semibold text-navy-800">
                  ${p.price[billing]}
                </span>
                <span className="text-sm text-slate-500">
                  {billing === "weekly" ? "/week" : "/term (12 wks)"}
                </span>
              </div>
              <ul className="mt-6 space-y-2.5 text-sm text-slate-700">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-0.5 grid h-5 w-5 place-items-center rounded-full bg-sky-100 text-sky-700 ring-1 ring-inset ring-sky-200">
                      <Check className="h-3 w-3" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button
                  href="/contact#assessment"
                  variant={p.highlight ? "primary" : "outline"}
                  size="md"
                  className="w-full"
                >
                  {p.cta}
                </Button>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-slate-500">
        * Confidence Guarantee: if no measurable improvement by session 8, next 4 lessons are free.
      </p>
    </Section>
  );
}
