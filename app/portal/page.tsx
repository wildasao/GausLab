import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/site/Logo";
import { LoginForm } from "@/components/site/LoginForm";
import { ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Parent Portal · Secure Login",
  description:
    "Log in to the GausLab parent portal to monitor progress, view homework and connect with your child's tutor.",
};

export default function PortalPage() {
  return (
    <section className="relative min-h-[80vh] py-16 sm:py-24">
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-mist to-white" />
      <Container>
        <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl bg-white shadow-lift ring-1 ring-navy-100 lg:grid-cols-2">
          <div className="hidden bg-gradient-to-br from-navy-800 via-navy-700 to-sky-700 p-10 text-white lg:block">
            <Logo invert />
            <h2 className="mt-10 font-display text-3xl font-semibold">
              Your child&rsquo;s maths journey — all in one place.
            </h2>
            <ul className="mt-8 space-y-4 text-sm">
              {[
                "Weekly progress reports",
                "Homework & practice quizzes",
                "Tutor feedback and lesson notes",
                "Secure video lessons",
                "NAPLAN band projections",
              ].map((l) => (
                <li key={l} className="flex items-center gap-2 text-navy-100">
                  <ShieldCheck className="h-4 w-4 text-emerald-300" /> {l}
                </li>
              ))}
            </ul>
            <div className="mt-10 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
              <div className="text-xs text-sky-200">Security</div>
              <div className="mt-1 text-sm text-white">
                256-bit encryption · Australian data hosting · Multi-factor authentication
              </div>
            </div>
          </div>
          <LoginForm />
        </div>
      </Container>
    </section>
  );
}
