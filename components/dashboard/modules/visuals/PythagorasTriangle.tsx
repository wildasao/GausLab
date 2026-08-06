"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function PythagorasTriangle({ a: startA = 3, b: startB = 4 }: { a?: number; b?: number }) {
  const [a, setA] = useState(startA);
  const [b, setB] = useState(startB);
  const c = Math.sqrt(a * a + b * b);

  const svgW = 340;
  const svgH = 260;
  const pad = 40;
  const maxLeg = 10;
  const scale = (svgW - 2 * pad) / maxLeg;
  const ax = pad;
  const ay = svgH - pad;
  const bx = pad + b * scale;
  const by = svgH - pad;
  const cx = pad;
  const cy = svgH - pad - a * scale;

  return (
    <section className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-100">
      <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
        Interactive triangle
      </div>
      <h3 className="mt-1 font-display text-base font-semibold text-navy-800">
        Drag the sliders — watch the hypotenuse update.
      </h3>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr,220px]">
        <div className="flex justify-center">
          <svg viewBox={`0 0 ${svgW} ${svgH}`} className="h-auto w-full max-w-md">
            {/* triangle */}
            <motion.polygon
              points={`${ax},${ay} ${bx},${by} ${cx},${cy}`}
              fill="rgba(14,165,233,0.15)"
              stroke="#0EA5E9"
              strokeWidth="2.5"
              animate={{
                points: `${ax},${ay} ${bx},${by} ${cx},${cy}`,
              }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
            />
            {/* right angle marker */}
            <rect x={ax} y={ay - 14} width="14" height="14" fill="none" stroke="#0EA5E9" strokeWidth="1.5" />
            {/* labels */}
            <text x={(ax + bx) / 2} y={ay + 22} textAnchor="middle" fontSize="14" fill="#0F172A" fontWeight="600">
              b = {b}
            </text>
            <text x={ax - 14} y={(ay + cy) / 2} textAnchor="end" fontSize="14" fill="#0F172A" fontWeight="600">
              a = {a}
            </text>
            <text
              x={(bx + cx) / 2 + 8}
              y={(by + cy) / 2 - 8}
              textAnchor="start"
              fontSize="14"
              fill="#F97316"
              fontWeight="700"
            >
              c = {c.toFixed(2)}
            </text>
          </svg>
        </div>

        <div className="space-y-4">
          <Slider label="Side a" value={a} onChange={setA} />
          <Slider label="Side b" value={b} onChange={setB} />
          <div className="rounded-2xl bg-navy-800 p-4 text-white">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-sky-300">
              Working
            </div>
            <div className="mt-2 space-y-1 font-mono text-sm">
              <div className="text-navy-200">
                a² + b² = c²
              </div>
              <div className="text-white">
                {a}² + {b}² = c²
              </div>
              <div className="text-white">
                {a * a} + {b * b} = c²
              </div>
              <div className="text-orange-300 font-semibold">
                c² = {a * a + b * b} → c = {c.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Slider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-semibold text-navy-800">{label}</span>
        <span className="font-display text-lg font-semibold text-navy-800 tabular-nums">{value}</span>
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
