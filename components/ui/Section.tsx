import { cn } from "@/lib/cn";
import { HTMLAttributes, ReactNode } from "react";
import { Container } from "./Container";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  bleed?: boolean;
}

export function Section({
  className,
  children,
  eyebrow,
  title,
  description,
  align = "center",
  bleed = false,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn("py-20 sm:py-24 lg:py-28", className)}
      {...props}
    >
      <Container>
        {(eyebrow || title || description) && (
          <div
            className={cn(
              "mx-auto mb-14 max-w-2xl",
              align === "center" ? "text-center" : "text-left mx-0"
            )}
          >
            {eyebrow && (
              <div
                className={cn(
                  "mb-4 inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold tracking-wide text-sky-700 ring-1 ring-inset ring-sky-200"
                )}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                {eyebrow}
              </div>
            )}
            {title && (
              <h2 className="text-balance text-3xl font-semibold sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-4 text-pretty text-base leading-relaxed text-slate-600 sm:text-lg">
                {description}
              </p>
            )}
          </div>
        )}
        {bleed ? <>{children}</> : children}
      </Container>
    </section>
  );
}
