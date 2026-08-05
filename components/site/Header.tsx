"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const nav = [
  { label: "Programs", href: "/programs" },
  { label: "How it works", href: "/#process" },
  { label: "Pricing", href: "/pricing" },
  { label: "Resources", href: "/resources" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled
          ? "border-b border-navy-100/70 bg-white/85 backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-navy-700/80 transition-colors hover:bg-navy-50 hover:text-navy-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <Button href="/portal" variant="ghost" size="sm">
            Parent Login
          </Button>
          <Button href="/contact#assessment" variant="primary" size="sm">
            Free Assessment
          </Button>
        </div>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-navy-700 ring-1 ring-navy-100 lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden">
          <div className="mx-4 mb-3 rounded-2xl border border-navy-100 bg-white p-3 shadow-lift">
            <nav className="flex flex-col" aria-label="Mobile">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-navy-700 hover:bg-navy-50"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                  <ChevronDown className="h-4 w-4 -rotate-90 text-slate-400" />
                </Link>
              ))}
            </nav>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button href="/portal" variant="outline" size="sm">
                Parent Login
              </Button>
              <Button href="/contact#assessment" variant="primary" size="sm">
                Free Assessment
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
