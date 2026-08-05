import { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "group relative rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-100 transition-all duration-300 hover:shadow-lift hover:-translate-y-0.5 hover:ring-sky-200",
        className
      )}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-lg font-semibold text-navy-700", className)} {...props} />;
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-2 text-sm leading-relaxed text-slate-600", className)} {...props} />;
}
