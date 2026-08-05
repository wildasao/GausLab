import Link from "next/link";
import { cn } from "@/lib/cn";

export function Logo({ className, invert = false }: { className?: string; invert?: boolean }) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label="GausLab Maths Academy home"
    >
      <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-700 to-sky-500 shadow-soft ring-1 ring-navy-800/10">
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M3 20c3-3 5-4 7-4s4 1 7 4" />
          <path d="M3 4c3 3 5 4 7 4s4-1 7-4" />
          <path d="M12 8v8" />
        </svg>
        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-orange-500 ring-2 ring-white" />
      </span>
      <span className={cn("flex flex-col leading-tight", invert && "text-white")}>
        <span className={cn("font-display text-lg font-semibold tracking-tight", invert ? "text-white" : "text-navy-700")}>
          GausLab
        </span>
        <span className={cn("text-[10px] font-medium uppercase tracking-[0.18em]", invert ? "text-sky-200" : "text-slate-500")}>
          Maths Academy
        </span>
      </span>
    </Link>
  );
}
