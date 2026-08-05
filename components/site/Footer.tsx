"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "./Logo";
import { Container } from "@/components/ui/Container";
import { Facebook, Instagram, Youtube, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { getSupabaseBrowser } from "@/lib/supabase/browser";

const columns = [
  {
    title: "Programs",
    links: [
      { label: "Year 3 Maths", href: "/programs#year-3" },
      { label: "Year 5 Maths", href: "/programs#year-5" },
      { label: "Year 7 Maths", href: "/programs#year-7" },
      { label: "Year 9 Maths", href: "/programs#year-9" },
      { label: "NAPLAN Prep", href: "/programs#naplan" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "Our tutors", href: "/tutors" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Free NAPLAN pack", href: "/resources#naplan" },
      { label: "Worksheets", href: "/resources#worksheets" },
      { label: "Study guides", href: "/resources#guides" },
      { label: "Parent portal", href: "/portal" },
      { label: "Help centre", href: "/help" },
    ],
  },
];

export function Footer() {
  const supabase = getSupabaseBrowser();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const { error } = await supabase.from("leads").insert({ email, source: "footer" });
    if (error && error.code !== "23505") {
      setStatus("error");
      return;
    }
    setStatus("done");
    setEmail("");
  }

  return (
    <footer className="relative overflow-hidden bg-navy-800 text-navy-100">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(700px 260px at 15% 0%, rgba(14,165,233,0.25), transparent 60%), radial-gradient(600px 240px at 85% 20%, rgba(249,115,22,0.18), transparent 60%)",
        }}
      />
      <Container className="relative">
        <div className="grid gap-12 py-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo invert />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-navy-200">
              Australia&rsquo;s premium maths tutoring academy for Years 3, 5, 7 and 9 —
              building confidence and NAPLAN-ready thinking through personalised programs.
            </p>
            <div className="mt-6 space-y-2 text-sm">
              <a href="tel:+61212345678" className="flex items-center gap-2 text-navy-100 hover:text-white">
                <Phone className="h-4 w-4 text-sky-300" /> +61 2 1234 5678
              </a>
              <a href="mailto:hello@gauslab.com.au" className="flex items-center gap-2 text-navy-100 hover:text-white">
                <Mail className="h-4 w-4 text-sky-300" /> hello@gauslab.com.au
              </a>
              <div className="flex items-center gap-2 text-navy-200">
                <MapPin className="h-4 w-4 text-sky-300" /> Level 3, 88 George St, Sydney NSW
              </div>
            </div>

            <form
              className="mt-8 rounded-2xl bg-white/5 p-3 ring-1 ring-white/10"
              onSubmit={subscribe}
            >
              <label htmlFor="footer-email" className="sr-only">
                Email for newsletter
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  id="footer-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Parent email address"
                  className="w-full rounded-full bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-navy-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                />
                <button
                  type="submit"
                  disabled={status === "loading" || status === "done"}
                  className="inline-flex items-center justify-center rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-70"
                >
                  {status === "loading" ? "…" : status === "done" ? "Subscribed" : "Get updates"}
                </button>
              </div>
              <p className="mt-2 px-2 text-xs text-navy-300">
                {status === "error"
                  ? "Something went wrong — try again in a moment."
                  : status === "done"
                  ? "Thanks! Check your inbox for the welcome email."
                  : "NAPLAN tips, worksheets and news. No spam, unsubscribe anytime."}
              </p>
            </form>
          </div>

          {columns.map((col) => (
            <div key={col.title} className="lg:col-span-2">
              <h4 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-white">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2 text-sm">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-navy-200 transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-2">
            <h4 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-white">
              Follow
            </h4>
            <ul className="mt-4 flex gap-2">
              {[
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Youtube, href: "#", label: "YouTube" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
              ].map(({ icon: Icon, href, label }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 transition-colors hover:bg-sky-500 hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-3 border-t border-white/10 py-6 text-xs text-navy-300 sm:flex-row sm:items-center">
          <div>© {new Date().getFullYear()} GausLab Maths Academy. All rights reserved. ABN 12 345 678 901.</div>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/accessibility" className="hover:text-white">Accessibility</Link>
            <Link href="/sitemap.xml" className="hover:text-white">Sitemap</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
