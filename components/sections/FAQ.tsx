"use client";

import { Section } from "@/components/ui/Section";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/cn";

const faqs = [
  {
    q: "How is the free diagnostic assessment structured?",
    a: "It's a 45-minute session with a qualified tutor who works through curriculum-aligned questions to identify your child's strengths and gaps. You receive a written report and a suggested learning plan — no obligation to enrol.",
  },
  {
    q: "Do you offer both online and in-person tutoring?",
    a: "Yes. Our Sydney studio (Level 3, 88 George St) runs in-person sessions after school and on weekends. Our interactive online classroom uses a shared whiteboard and works from any laptop or tablet — perfect for families anywhere in Australia.",
  },
  {
    q: "Which curriculums do you cover?",
    a: "All GausLab programs are ACARA-aligned and adapted to NSW, Victorian, Queensland and other state syllabi. NAPLAN preparation is embedded across Years 3, 5, 7 and 9.",
  },
  {
    q: "How do you measure progress?",
    a: "Every student has a topic-by-topic mastery dashboard in the parent portal. You receive weekly progress emails, and every 6 weeks we share a formal progress report with NAPLAN band projections.",
  },
  {
    q: "What if my child doesn't improve?",
    a: "We back our programs with a Confidence Guarantee — if there is no measurable improvement by session 8, the next 4 lessons are free while we adjust the plan.",
  },
  {
    q: "How are payments handled?",
    a: "Secure online payments via Stripe. You can pay per term (12 weeks) with an 8% discount, or weekly with no lock-in contract. All prices include GST.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section
      id="faq"
      eyebrow="Frequently asked"
      title="Questions parents often ask."
      description="Can't find your answer? Get in touch — we usually reply within a few hours."
    >
      <div className="mx-auto max-w-3xl divide-y divide-navy-100 rounded-3xl bg-white ring-1 ring-navy-100 shadow-soft">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <details
              key={f.q}
              open={isOpen}
              onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open ? i : null)}
              className="group px-6 py-5 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left">
                <span className="font-display text-base font-semibold text-navy-800 sm:text-lg">
                  {f.q}
                </span>
                <span
                  className={cn(
                    "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-navy-50 text-navy-700 transition-colors group-open:bg-orange-500 group-open:text-white"
                  )}
                >
                  {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </span>
              </summary>
              <div className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
                {f.a}
              </div>
            </details>
          );
        })}
      </div>
    </Section>
  );
}
