import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import {
  Microscope,
  BookMarked,
  TrendingUp,
  FileCheck2,
  ArrowRight,
  Star,
} from "lucide-react";

const steps = [
  {
    icon: Microscope,
    title: "Diagnostic (Week 0)",
    body:
      "45-minute one-to-one session. Students work through 25 adaptive questions across all Australian Curriculum strands.",
    output: "Written diagnostic report · Skill heat-map · NAPLAN band projection",
  },
  {
    icon: BookMarked,
    title: "Weekly formative",
    body:
      "Every session includes a 5-minute quick-check aligned to that week's topic. Tutors record scores in the portal in real time.",
    output: "Instant portal update · Skill mastery bar movement",
  },
  {
    icon: FileCheck2,
    title: "Term review (Week 6)",
    body:
      "A 30-minute mixed-topic paper marked against NAPLAN standards. Includes a video walkthrough of any missed question.",
    output: "6-week progress report · Video review · Parent 1:1 call",
  },
  {
    icon: TrendingUp,
    title: "NAPLAN mock (Week 10)",
    body:
      "Full-length, timed, mock NAPLAN under exam conditions. Marked by two tutors for consistency.",
    output: "Band projection · Question-level analysis · Strategy plan",
  },
];

const rubric = [
  { band: "Well below", tone: "bg-rose-50 text-rose-700 ring-rose-200", desc: "Missing foundational skills — priority for remediation." },
  { band: "Developing", tone: "bg-amber-50 text-amber-700 ring-amber-200", desc: "Concept present, needs consistent practice." },
  { band: "Meeting", tone: "bg-sky-50 text-sky-700 ring-sky-200", desc: "On track for year-level expectations." },
  { band: "Exceeding", tone: "bg-emerald-50 text-emerald-700 ring-emerald-200", desc: "Ready for stretch problems and extension." },
];

export function Assessment() {
  return (
    <Section
      id="assessment"
      className="bg-gradient-to-b from-white via-mist to-white"
      eyebrow="How we assess"
      title={
        <>
          Rigorous, transparent, <span className="text-sky-600">parent-friendly</span>.
        </>
      }
      description="Every child is measured against the same NAPLAN-aligned rubric — and every parent sees the same clear report their tutor sees."
    >
      {/* 4-step assessment loop */}
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-8 top-16 hidden h-px bg-gradient-to-r from-transparent via-sky-300 to-transparent lg:block"
        />
        <div className="grid gap-6 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06}>
              <div className="h-full rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-100">
                <div className="flex items-center justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-navy-700 text-white shadow-soft">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                    Step 0{i + 1}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-navy-800">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.body}</p>
                <div className="mt-4 rounded-xl bg-mist p-3 text-[11px] font-medium text-navy-700 ring-1 ring-inset ring-navy-100">
                  {s.output}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Rubric + sample */}
      <div className="mt-16 grid gap-8 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <div className="rounded-3xl bg-white p-8 shadow-soft ring-1 ring-navy-100">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Marking rubric
            </div>
            <h3 className="mt-2 font-display text-2xl font-semibold text-navy-800">
              Every skill mapped to four bands.
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              We use the same four-band rubric across all year levels so parents can
              compare progress term-over-term at a glance.
            </p>
            <ul className="mt-6 space-y-3">
              {rubric.map((r) => (
                <li key={r.band} className="flex items-start gap-3">
                  <span
                    className={`min-w-[100px] rounded-full px-2.5 py-1 text-center text-[11px] font-semibold ring-1 ring-inset ${r.tone}`}
                  >
                    {r.band}
                  </span>
                  <span className="text-sm text-slate-700">{r.desc}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex gap-3">
              <Button href="/contact#assessment" size="md">
                Book free diagnostic <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Reveal>

        <Reveal className="lg:col-span-7" delay={0.05}>
          <div className="relative overflow-hidden rounded-3xl bg-navy-800 p-8 text-white shadow-lift">
            <div
              aria-hidden
              className="absolute inset-0 opacity-60"
              style={{
                background:
                  "radial-gradient(500px 220px at 15% 0%, rgba(14,165,233,0.28), transparent 60%), radial-gradient(500px 220px at 90% 100%, rgba(249,115,22,0.22), transparent 60%)",
              }}
            />
            <div className="relative">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-200">
                Sample report snippet
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div>
                  <div className="font-display text-2xl font-semibold">Ava L. · Year 5</div>
                  <div className="text-xs text-navy-300">6-week review · Term 2 2026</div>
                </div>
                <div className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-400/40">
                  On track: Band 7 → 8
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {[
                  { skill: "Equivalent fractions", band: "Exceeding", pct: 96, color: "from-emerald-400 to-emerald-500" },
                  { skill: "Decimal operations", band: "Meeting", pct: 84, color: "from-sky-400 to-sky-500" },
                  { skill: "Multi-step word problems", band: "Meeting", pct: 78, color: "from-sky-400 to-sky-500" },
                  { skill: "Area of composite shapes", band: "Developing", pct: 62, color: "from-amber-400 to-amber-500" },
                  { skill: "Data interpretation", band: "Meeting", pct: 81, color: "from-sky-400 to-sky-500" },
                ].map((r) => (
                  <div key={r.skill}>
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-navy-100">{r.skill}</span>
                      <span className="text-white/70">
                        {r.band} · {r.pct}%
                      </span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${r.color}`}
                        style={{ width: `${r.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-sky-200">
                  <Star className="h-3.5 w-3.5 text-orange-300" /> Tutor commentary
                </div>
                <p className="mt-2 text-sm leading-relaxed text-navy-100">
                  Ava&rsquo;s confidence in fractions is now excellent — she&rsquo;s ready for percentage
                  problems. Next 3 weeks: strengthen composite-area problems using the
                  decompose-and-add strategy we practised this week.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
