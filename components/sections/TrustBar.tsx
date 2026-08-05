import { Container } from "@/components/ui/Container";

const logos = [
  "ACARA aligned",
  "NSW Syllabus",
  "Victorian Curriculum",
  "QCAA",
  "Google Reviews",
  "AITSL trained",
];

export function TrustBar() {
  return (
    <section aria-label="Curriculum alignment and trust" className="border-y border-navy-100/70 bg-white/70">
      <Container>
        <div className="flex flex-col items-center gap-4 py-8 sm:flex-row sm:justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Curriculum-aligned across Australia
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {logos.map((name) => (
              <li
                key={name}
                className="text-sm font-semibold text-navy-700/60 transition-colors hover:text-navy-700"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
