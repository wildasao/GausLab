import { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Tone = "sky" | "orange" | "navy" | "green";

const tones: Record<Tone, string> = {
  sky: "bg-sky-50 text-sky-700 ring-sky-200",
  orange: "bg-orange-50 text-orange-700 ring-orange-200",
  navy: "bg-navy-50 text-navy-700 ring-navy-200",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

export function Badge({
  className,
  tone = "sky",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
