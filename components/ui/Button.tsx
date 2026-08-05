import Link from "next/link";
import { forwardRef, ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-200 will-change-transform " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 " +
  "disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] cursor-pointer";

const variants: Record<Variant, string> = {
  primary:
    "bg-orange-500 text-white shadow-[0_10px_30px_-12px_rgba(249,115,22,0.6)] hover:bg-orange-600 hover:-translate-y-0.5",
  secondary:
    "bg-navy-700 text-white hover:bg-navy-800 shadow-[0_10px_30px_-12px_rgba(11,30,63,0.5)] hover:-translate-y-0.5",
  outline:
    "bg-white text-navy-700 ring-1 ring-inset ring-navy-200 hover:ring-navy-300 hover:bg-navy-50/60",
  ghost:
    "bg-transparent text-navy-700 hover:bg-navy-50",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-4 py-2",
  md: "text-sm px-5 py-2.5",
  lg: "text-base px-7 py-3.5",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
};

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type LinkProps = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
type Props = ButtonProps | LinkProps;

export const Button = forwardRef<HTMLElement, Props>(function Button(
  { variant = "primary", size = "md", className, ...props },
  ref
) {
  const classes = cn(base, variants[variant], sizes[size], className);
  if ("href" in props && props.href !== undefined) {
    const { href, ...rest } = props;
    return (
      <Link
        href={href}
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={classes}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      />
    );
  }
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={classes}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    />
  );
});
