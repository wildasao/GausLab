import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ArrowRight, CalendarCheck, Sparkles } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="relative py-20 sm:py-24">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-navy-800 via-navy-700 to-sky-700 p-8 sm:p-14 shadow-lift">
          <div
            aria-hidden
            className="absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(700px 240px at 15% 10%, rgba(249,115,22,0.35), transparent 60%), radial-gradient(700px 240px at 90% 90%, rgba(14,165,233,0.4), transparent 60%)",
            }}
          />
          <div className="relative grid items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-sky-100 ring-1 ring-inset ring-white/15">
                <Sparkles className="h-3.5 w-3.5 text-orange-300" /> Free · 45 minutes · no obligation
              </div>
              <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-[2.75rem]">
                Ready to see what your child is truly capable of in maths?
              </h2>
              <p className="mt-3 max-w-2xl text-navy-100">
                Book a free diagnostic assessment today — walk away with a clear plan,
                whether or not you enrol.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:justify-end">
              <Button href="/assessment" size="lg" variant="primary">
                <CalendarCheck className="h-4 w-4" />
                Take 5-min diagnostic
              </Button>
              <Button href="/contact#assessment" size="lg" variant="outline" className="!bg-white/10 !text-white !ring-white/20 hover:!bg-white/15">
                Book with a tutor
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
