import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Clock, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Free 5-Minute Diagnostic Assessment · GausLab",
  description:
    "Get an instant snapshot of your child's NAPLAN readiness. Interactive 10-question diagnostic for Years 3, 5, 7 and 9 — no email required.",
};

const YEARS: { year: 3 | 5 | 7 | 9; label: string; tone: string; body: string }[] = [
  { year: 3, label: "Foundations", tone: "from-emerald-500 to-emerald-600", body: "Place value, addition, multiplication basics, fractions, time." },
  { year: 5, label: "Fluency", tone: "from-sky-500 to-sky-700", body: "Fractions, decimals, percentages, area, multi-step problems." },
  { year: 7, label: "Transition", tone: "from-orange-500 to-orange-600", body: "Integers, algebra, ratios, geometry, statistics." },
  { year: 9, label: "Advanced core", tone: "from-navy-700 to-navy-900", body: "Trig, Pythagoras, index laws, coordinate geometry, probability." },
];

export default function AssessmentLanding() {
  return (
    <>
      <section
        className="relative overflow-hidden"
        style={{
          background: "radial-gradient(1200px 500px at 50% -10%, rgba(14,165,233,0.18), transparent 60%), linear-gradient(to bottom, #F6F9FE, #FFFFFF)",
        }}
      >
        <Container>
          <div className="mx-auto max-w-3xl py-20 text-center sm:py-24">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-navy-700 shadow-soft ring-1 ring-navy-100">
              <Sparkles className="h-3.5 w-3.5 text-orange-500" /> Free · 5 minutes · no sign-up
            </div>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-navy-800 sm:text-5xl lg:text-6xl">
              Where is your child in maths — <span className="text-sky-600">really</span>?
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-slate-600 sm:text-lg">
              10 interactive questions calibrated to the NAPLAN curriculum. Instant scoring,
              per-strand breakdown, and a suggested band range.
            </p>

            <ul className="mx-auto mt-6 flex max-w-md flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-slate-600">
              <li className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-sky-600" /> ~5 minutes
              </li>
              <li className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> No email required
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-orange-500" /> Interactive — not just multiple choice
              </li>
            </ul>
          </div>
        </Container>
      </section>

      <section className="pb-24">
        <Container>
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-6 text-center font-display text-2xl font-semibold text-navy-800">
              Pick your child&rsquo;s year level to start
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {YEARS.map((y) => (
                <Link
                  key={y.year}
                  href={`/assessment/y${y.year}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-navy-100 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-lift hover:ring-sky-200"
                >
                  <div className={`relative h-24 bg-gradient-to-br ${y.tone}`}>
                    <div className="absolute inset-0 bg-noise opacity-30" />
                    <div className="absolute left-4 top-4 text-white/80 text-[10px] font-semibold uppercase tracking-widest">
                      {y.label}
                    </div>
                    <div className="absolute right-4 top-4 font-display text-3xl font-semibold text-white">
                      Y{y.year}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display text-lg font-semibold text-navy-800">
                      Year {y.year} diagnostic
                    </h3>
                    <p className="mt-1 flex-1 text-xs leading-relaxed text-slate-600">{y.body}</p>
                    <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-sky-700">
                      Start test <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-12 rounded-3xl bg-navy-800 p-8 text-white shadow-lift">
              <div className="grid gap-4 lg:grid-cols-[1fr,auto] lg:items-center">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-sky-300">
                    Prefer a full session with a tutor?
                  </div>
                  <h3 className="mt-1 font-display text-xl font-semibold">
                    Book a 45-minute human diagnostic assessment.
                  </h3>
                  <p className="mt-1 max-w-xl text-sm text-navy-200">
                    A qualified tutor works one-to-one with your child, produces a written report
                    and a 12-week learning plan. Free and no obligation.
                  </p>
                </div>
                <Button href="/contact#assessment" size="lg">
                  Book with a tutor
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
