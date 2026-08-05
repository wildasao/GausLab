import { Container } from "@/components/ui/Container";
import { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden pb-16 pt-14 sm:pb-20 sm:pt-20">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-mist to-white" />
        <div className="absolute inset-0 bg-radial-sky" />
      </div>
      <Container>
        <div className="max-w-3xl">
          {eyebrow && (
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-navy-700 shadow-soft ring-1 ring-navy-100">
              {eyebrow}
            </div>
          )}
          <h1 className="text-balance font-display text-4xl font-semibold leading-tight text-navy-800 sm:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-slate-600 sm:text-lg">
              {description}
            </p>
          )}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </Container>
    </section>
  );
}
