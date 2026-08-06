"use client";

import { useState } from "react";

export function CoordinatePlane({ start = [3, 2] as [number, number] }) {
  const [x, setX] = useState(start[0]);
  const [y, setY] = useState(start[1]);
  const size = 300;
  const gridStep = 30;
  const half = size / 2;
  const cx = half + x * gridStep;
  const cy = half - y * gridStep;

  return (
    <section className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-100">
      <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
        Interactive coordinate plane
      </div>
      <h3 className="mt-1 font-display text-base font-semibold text-navy-800">
        Click anywhere to place a point — see its (x, y) coordinates.
      </h3>

      <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-start">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="mx-auto h-auto w-full max-w-sm cursor-crosshair rounded-2xl bg-mist ring-1 ring-inset ring-navy-100"
          onClick={(e) => {
            const svg = e.currentTarget;
            const rect = svg.getBoundingClientRect();
            const px = ((e.clientX - rect.left) / rect.width) * size;
            const py = ((e.clientY - rect.top) / rect.height) * size;
            const gx = Math.round((px - half) / gridStep);
            const gy = Math.round((half - py) / gridStep);
            setX(Math.max(-5, Math.min(5, gx)));
            setY(Math.max(-5, Math.min(5, gy)));
          }}
        >
          {/* Grid */}
          {Array.from({ length: 11 }).map((_, i) => {
            const p = i * gridStep;
            return (
              <g key={i}>
                <line x1={p} y1={0} x2={p} y2={size} stroke="rgba(11,30,63,0.06)" />
                <line x1={0} y1={p} x2={size} y2={p} stroke="rgba(11,30,63,0.06)" />
              </g>
            );
          })}
          {/* Axes */}
          <line x1={0} y1={half} x2={size} y2={half} stroke="#0F172A" strokeWidth="1.5" />
          <line x1={half} y1={0} x2={half} y2={size} stroke="#0F172A" strokeWidth="1.5" />
          {/* Axis labels */}
          <text x={size - 6} y={half - 6} fontSize="10" fill="#0F172A" textAnchor="end">x</text>
          <text x={half + 6} y={10} fontSize="10" fill="#0F172A">y</text>
          {/* Tick numbers */}
          {[-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].map((n) => (
            <g key={n}>
              <text x={half + n * gridStep} y={half + 12} fontSize="8" fill="#64748b" textAnchor="middle">{n}</text>
              <text x={half - 8} y={half - n * gridStep + 3} fontSize="8" fill="#64748b" textAnchor="end">{n}</text>
            </g>
          ))}
          {/* Point */}
          <circle cx={cx} cy={cy} r="7" fill="#F97316" stroke="#fff" strokeWidth="2" />
          <text x={cx + 10} y={cy - 8} fontSize="12" fontWeight="700" fill="#0B1E3F">
            ({x}, {y})
          </text>
        </svg>

        <div className="flex-1 space-y-4">
          <Slider label="x" value={x} onChange={setX} />
          <Slider label="y" value={y} onChange={setY} />
          <div className="rounded-2xl bg-navy-800 p-4 text-white">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-sky-300">
              Coordinates
            </div>
            <div className="mt-1 font-display text-2xl font-semibold">
              ({x}, {y})
            </div>
            <div className="mt-2 text-xs text-navy-200">
              Quadrant:{" "}
              <span className="font-semibold text-white">
                {x === 0 || y === 0
                  ? "on an axis"
                  : x > 0 && y > 0
                  ? "I (top-right)"
                  : x < 0 && y > 0
                  ? "II (top-left)"
                  : x < 0 && y < 0
                  ? "III (bottom-left)"
                  : "IV (bottom-right)"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Slider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-semibold text-navy-800">{label}</span>
        <span className="font-display text-lg font-semibold text-navy-800 tabular-nums">{value}</span>
      </div>
      <input
        type="range"
        min={-5}
        max={5}
        step={1}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="mt-1 w-full accent-orange-500"
      />
    </div>
  );
}
