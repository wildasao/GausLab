"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Star, ShieldCheck, Sparkles, PlayCircle, ArrowRight } from "lucide-react";

export function Hero() {
  const reduce = useReducedMotion();
  return (
    <section className="relative overflow-hidden pt-8 sm:pt-14 lg:pt-20">
      {/* backdrop */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-mist to-white" />
        <div className="absolute inset-0 bg-radial-sky" />
        <div
          className="absolute inset-x-0 top-0 h-[520px] opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(11,30,63,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(11,30,63,0.08) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage:
              "linear-gradient(to bottom, black, transparent 80%)",
          }}
        />
      </div>

      <Container>
        <div className="grid items-center gap-14 pb-20 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-navy-700 shadow-soft ring-1 ring-navy-100"
            >
              <Sparkles className="h-3.5 w-3.5 text-orange-500" />
              NAPLAN-ready programs for Years 3, 5, 7 & 9
            </motion.div>

            <motion.h1
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
              className="mt-5 text-balance font-display text-4xl font-semibold leading-[1.05] tracking-tight text-navy-800 sm:text-5xl lg:text-[3.6rem]"
            >
              Build Maths Confidence.{" "}
              <span className="relative inline-block">
                <span className="relative z-10">Achieve Better</span>
                <svg
                  aria-hidden
                  viewBox="0 0 300 14"
                  className="absolute -bottom-1.5 left-0 h-2 w-full text-orange-400"
                  preserveAspectRatio="none"
                >
                  <path d="M2 8 C 60 2, 140 12, 298 6" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                </svg>
              </span>{" "}
              NAPLAN Results.
            </motion.h1>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-slate-600 sm:text-lg"
            >
              Personalised online and in-person maths tutoring, designed by experienced
              Australian educators. Turn maths anxiety into measurable progress — and
              walk into NAPLAN prepared.
            </motion.p>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
              className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center"
            >
              <Button href="/assessment" size="lg">
                Take the 5-minute diagnostic
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button href="/contact#assessment" variant="outline" size="lg">
                <PlayCircle className="h-4 w-4 text-sky-600" />
                Book with a tutor
              </Button>
            </motion.div>

            <motion.div
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-600"
            >
              <div className="inline-flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[
                    "from-sky-400 to-sky-600",
                    "from-orange-400 to-orange-600",
                    "from-navy-500 to-navy-700",
                    "from-emerald-400 to-emerald-600",
                  ].map((g, i) => (
                    <div
                      key={i}
                      className={`h-8 w-8 rounded-full bg-gradient-to-br ${g} ring-2 ring-white`}
                    />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                    <span className="ml-1 font-semibold text-navy-700">4.9/5</span>
                  </div>
                  <div className="text-xs text-slate-500">from 320+ parent reviews</div>
                </div>
              </div>
              <div className="inline-flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <span>Working With Children Checked tutors</span>
              </div>
            </motion.div>
          </div>

          {/* Right visual */}
          <div className="lg:col-span-6">
            <HeroVisual />
          </div>
        </div>
      </Container>
    </section>
  );
}

function HeroVisual() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
      className="relative mx-auto aspect-[4/5] w-full max-w-lg"
    >
      {/* main card */}
      <div className="absolute inset-0 rounded-[2.25rem] bg-gradient-to-br from-navy-700 via-navy-800 to-navy-900 p-8 shadow-lift ring-1 ring-navy-900/40">
        <div className="flex items-center justify-between text-navy-100">
          <div className="text-xs uppercase tracking-[0.16em] text-sky-300">Diagnostic Report</div>
          <div className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-semibold text-emerald-300 ring-1 ring-emerald-400/40">
            NAPLAN-ready
          </div>
        </div>
        <div className="mt-2 font-display text-2xl text-white">Ava, Year 5</div>
        <div className="text-xs text-navy-300">Personalised learning plan · 12 weeks</div>

        {/* ring stat */}
        <div className="mt-6 flex items-center gap-6">
          <RingStat value={87} label="Numeracy score" />
          <div className="flex-1 space-y-3">
            {[
              { label: "Fractions & Decimals", value: 92 },
              { label: "Problem Solving", value: 78 },
              { label: "Measurement", value: 84 },
            ].map((row) => (
              <div key={row.label}>
                <div className="flex items-center justify-between text-[11px] text-navy-200">
                  <span>{row.label}</span>
                  <span className="font-semibold text-white">{row.value}%</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${row.value}%` }}
                    transition={{ duration: 1.1, ease: "easeOut", delay: 0.6 }}
                    className="h-full rounded-full bg-gradient-to-r from-sky-400 to-orange-400"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* progress chart */}
        <div className="mt-6 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-white">Weekly progress</div>
            <div className="text-[10px] text-sky-300">+18% vs last term</div>
          </div>
          <svg viewBox="0 0 260 90" className="mt-2 w-full">
            <defs>
              <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#0EA5E9" stopOpacity="0.55" />
                <stop offset="1" stopColor="#0EA5E9" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0 70 L30 60 L60 62 L90 45 L120 50 L150 35 L180 30 L210 18 L240 12 L260 8 L260 90 L0 90 Z"
              fill="url(#g)"
            />
            <path
              d="M0 70 L30 60 L60 62 L90 45 L120 50 L150 35 L180 30 L210 18 L240 12 L260 8"
              fill="none"
              stroke="#F97316"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 260].map((x, i) => {
              const ys = [70, 60, 62, 45, 50, 35, 30, 18, 12, 8];
              return <circle key={i} cx={x} cy={ys[i]} r="2.5" fill="#F97316" />;
            })}
          </svg>
        </div>
      </div>

      {/* floating chips */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="absolute -left-6 top-16 hidden rounded-2xl bg-white p-3 pr-4 shadow-lift ring-1 ring-navy-100 sm:flex sm:items-center sm:gap-3"
      >
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-orange-100 text-orange-600 font-semibold">
          ½
        </div>
        <div>
          <div className="text-xs text-slate-500">Today&rsquo;s lesson</div>
          <div className="text-sm font-semibold text-navy-700">Equivalent Fractions</div>
        </div>
      </motion.div>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="absolute -right-4 bottom-24 hidden rounded-2xl bg-white p-3 pr-4 shadow-lift ring-1 ring-navy-100 sm:flex sm:items-center sm:gap-3"
      >
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-emerald-600">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xs text-slate-500">NAPLAN 2025</div>
          <div className="text-sm font-semibold text-navy-700">Band 7 achieved</div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function RingStat({ value, label }: { value: number; label: string }) {
  const C = 2 * Math.PI * 34;
  const dash = (value / 100) * C;
  return (
    <div className="relative grid h-24 w-24 place-items-center">
      <svg viewBox="0 0 80 80" className="h-24 w-24 -rotate-90">
        <circle cx="40" cy="40" r="34" stroke="rgba(255,255,255,0.12)" strokeWidth="8" fill="none" />
        <motion.circle
          cx="40"
          cy="40"
          r="34"
          stroke="#F97316"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${C}`}
          initial={{ strokeDasharray: `0 ${C}` }}
          animate={{ strokeDasharray: `${dash} ${C}` }}
          transition={{ duration: 1.1, ease: "easeOut", delay: 0.5 }}
        />
      </svg>
      <div className="absolute flex flex-col items-center leading-none">
        <div className="font-display text-2xl font-semibold text-white">{value}</div>
        <div className="mt-0.5 text-[9px] uppercase tracking-widest text-navy-200">{label}</div>
      </div>
    </div>
  );
}
