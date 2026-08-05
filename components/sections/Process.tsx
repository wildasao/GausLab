import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ClipboardCheck, Route, CalendarClock, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: ClipboardCheck,
    number: "01",
    title: "Free diagnostic assessment",
    body:
      "A 45-minute session identifies your child's exact gaps, strengths and NAPLAN readiness — no obligation.",
  },
  {
    icon: Route,
    number: "02",
    title: "Personalised learning plan",
    body:
      "Your tutor designs a 12-week roadmap mapped to your state's curriculum and NAPLAN standards.",
  },
  {
    icon: CalendarClock,
    number: "03",
    title: "Weekly interactive lessons",
    body:
      "Engaging 1:1 or small group sessions online or at our Sydney studio — with homework and instant feedback.",
  },
  {
    icon: TrendingUp,
    number: "04",
    title: "Ongoing progress tracking",
    body:
      "Parents receive weekly reports, mastery scores and NAPLAN band projections in the parent portal.",
  },
];

export function Process() {
  return (
    <Section
      id="process"
      eyebrow="How it works"
      title={
        <>
          A simple four-step journey to <span className="text-sky-600">real progress</span>.
        </>
      }
      description="We remove the guesswork from tutoring. Every student gets a plan, a coach and a scoreboard."
    >
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-8 top-16 hidden h-px bg-gradient-to-r from-transparent via-sky-300 to-transparent lg:block"
        />
        <div className="grid gap-6 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.number} delay={i * 0.06}>
              <div className="relative h-full rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                <div className="flex items-center justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-navy-700 text-white shadow-soft">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div className="font-display text-3xl font-semibold text-navy-100">
                    {s.number}
                  </div>
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-navy-800">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
