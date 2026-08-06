"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LabShell } from "./LabShell";

export function PythagorasLab() {
  const [a, setA] = useState(3);
  const [b, setB] = useState(4);
  const c = Math.sqrt(a * a + b * b);
  const roundedC = Math.round(c * 100) / 100;
  const answer = `c = ${roundedC}${Number.isInteger(c) ? " (whole number!)" : ""}`;

  const svgW = 260;
  const svgH = 200;
  const pad = 30;
  const maxLeg = 10;
  const scale = (svgW - 2 * pad) / maxLeg;
  const ax = pad;
  const ay = svgH - pad;
  const bx = pad + b * scale;
  const by = svgH - pad;
  const cy = svgH - pad - a * scale;

  return (
    <LabShell
      kind="pythagoras"
      title="Design a Pythagoras problem"
      subtitle="Set the two legs and see the hypotenuse. Write a real-world story around it."
      config={{ a, b, c: roundedC }}
      computedAnswer={answer}
      storyPlaceholder={`e.g. "A ladder ${roundedC}m long leans against a wall. The base is ${b}m away. How far up the wall does it reach?"`}
      visual={
        <div className="grid gap-4 rounded-2xl bg-mist p-4 ring-1 ring-inset ring-navy-100 sm:grid-cols-[1fr,220px]">
          <div className="flex justify-center">
            <svg viewBox={`0 0 ${svgW} ${svgH}`} className="h-auto w-full max-w-md">
              <motion.polygon
                animate={{ points: `${ax},${ay} ${bx},${by} ${pad},${cy}` }}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
                fill="rgba(14,165,233,0.15)"
                stroke="#0EA5E9"
                strokeWidth="2.5"
              />
              <rect x={ax} y={ay - 12} width="12" height="12" fill="none" stroke="#0EA5E9" strokeWidth="1.5" />
              <text x={(ax + bx) / 2} y={ay + 20} textAnchor="middle" fontSize="13" fill="#0F172A" fontWeight="600">
                b = {b}
              </text>
              <text x={ax - 10} y={(ay + cy) / 2} textAnchor="end" fontSize="13" fill="#0F172A" fontWeight="600">
                a = {a}
              </text>
              <text
                x={(bx + pad) / 2 + 8}
                y={(by + cy) / 2 - 8}
                textAnchor="start"
                fontSize="13"
                fill="#F97316"
                fontWeight="700"
              >
                c = {roundedC}
              </text>
            </svg>
          </div>

          <div className="flex flex-col gap-4">
            <Slider label="Leg a" value={a} onChange={setA} />
            <Slider label="Leg b" value={b} onChange={setB} />
            <div className="rounded-2xl bg-navy-800 p-3 text-white">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-sky-300">
                My working
              </div>
              <div className="mt-1 space-y-0.5 font-mono text-xs">
                <div className="text-white">
                  {a}² + {b}² = c²
                </div>
                <div className="text-white">
                  {a * a} + {b * b} = c²
                </div>
                <div className="font-semibold text-orange-300">c = {roundedC}</div>
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
}

function Slider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-semibold text-navy-800">{label}</span>
        <span className="font-display text-base font-semibold text-navy-800 tabular-nums">{value}</span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="mt-1 w-full accent-orange-500"
      />
    </div>
  );
}
