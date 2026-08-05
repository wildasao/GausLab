import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Star, Quote } from "lucide-react";

const items = [
  {
    quote:
      "My daughter went from being terrified of maths tests to actually looking forward to NAPLAN. She jumped two bands in a single term.",
    name: "Rebecca T.",
    role: "Parent, Year 5 · Chatswood",
    color: "from-sky-500 to-sky-700",
    result: "+2 NAPLAN bands",
  },
  {
    quote:
      "The diagnostic assessment was eye-opening. GausLab found gaps in his fractions that school had missed. Weekly reports keep us in the loop.",
    name: "Andrew L.",
    role: "Parent, Year 7 · Parramatta",
    color: "from-orange-500 to-orange-600",
    result: "94% attendance",
  },
  {
    quote:
      "The small-group format is brilliant — my son is challenged by his peers but never falls behind. Best tutoring investment we've made.",
    name: "Priya S.",
    role: "Parent, Year 9 · Bondi",
    color: "from-navy-600 to-navy-800",
    result: "Band 9 in Y9",
  },
];

export function Testimonials() {
  return (
    <Section
      id="testimonials"
      eyebrow="Parent stories"
      title={
        <>
          Loved by <span className="text-orange-500">2,400+ Australian families</span>.
        </>
      }
      description="Verified reviews from parents whose children study with GausLab."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {items.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.06}>
            <figure className="relative flex h-full flex-col rounded-3xl bg-white p-7 shadow-soft ring-1 ring-navy-100">
              <Quote className="absolute right-6 top-6 h-8 w-8 text-navy-100" aria-hidden />
              <div className="flex items-center gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-navy-800">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="mt-6 flex items-center justify-between border-t border-navy-100 pt-5">
                <figcaption className="flex items-center gap-3">
                  <div
                    className={`grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br ${t.color} font-display text-sm font-semibold text-white ring-2 ring-white`}
                  >
                    {t.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-navy-800">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                  </div>
                </figcaption>
                <div className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                  {t.result}
                </div>
              </div>
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
