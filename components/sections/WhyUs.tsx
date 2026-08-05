import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import {
  ClipboardList,
  GraduationCap,
  Users,
  Laptop,
  LineChart,
  Award,
} from "lucide-react";

const items = [
  {
    icon: ClipboardList,
    title: "Personalised learning plans",
    body:
      "Every student starts with a diagnostic and receives a 12-week roadmap targeting their exact gaps and stretch goals.",
    tone: "bg-sky-50 text-sky-600 ring-sky-200",
  },
  {
    icon: GraduationCap,
    title: "Experienced maths educators",
    body:
      "Tutors are qualified Australian teachers or top ATAR maths graduates, trained in NAPLAN pedagogy.",
    tone: "bg-orange-50 text-orange-600 ring-orange-200",
  },
  {
    icon: Users,
    title: "1-on-1 or small group",
    body:
      "Choose focused 1:1 sessions or peer-powered small groups of 3–4 for collaborative problem-solving.",
    tone: "bg-navy-50 text-navy-700 ring-navy-200",
  },
  {
    icon: Laptop,
    title: "Online or in-person",
    body:
      "Attend at our Sydney studio or join our interactive online classroom with shared whiteboard.",
    tone: "bg-emerald-50 text-emerald-600 ring-emerald-200",
  },
  {
    icon: LineChart,
    title: "Measurable progress",
    body:
      "Parents see weekly progress reports, topic mastery bars and NAPLAN band projections in the portal.",
    tone: "bg-fuchsia-50 text-fuchsia-600 ring-fuchsia-200",
  },
  {
    icon: Award,
    title: "Confidence guarantee",
    body:
      "If a student doesn&rsquo;t improve by their second review, the next 4 lessons are on us.",
    tone: "bg-amber-50 text-amber-600 ring-amber-200",
  },
];

export function WhyUs() {
  return (
    <Section
      id="why-us"
      eyebrow="Why parents choose GausLab"
      title={
        <>
          A tutoring partner that <span className="text-sky-600">actually moves the needle</span>.
        </>
      }
      description="We combine expert Australian educators with a data-driven approach so every dollar of tutoring produces visible, reportable progress."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => (
          <Reveal key={it.title} delay={i * 0.05}>
            <article className="group h-full rounded-3xl bg-white p-7 shadow-soft ring-1 ring-navy-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift hover:ring-sky-200">
              <div
                className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ring-inset ${it.tone}`}
              >
                <it.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-navy-800">
                {it.title}
              </h3>
              <p
                className="mt-2 text-sm leading-relaxed text-slate-600"
                dangerouslySetInnerHTML={{ __html: it.body }}
              />
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
