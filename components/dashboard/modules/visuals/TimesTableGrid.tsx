"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

export function TimesTableGrid() {
  const [row, setRow] = useState<number | null>(null);
  const [col, setCol] = useState<number | null>(null);
  const N = 10;

  return (
    <section className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-100">
      <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
        Interactive times-table grid
      </div>
      <h3 className="mt-1 font-display text-base font-semibold text-navy-800">
        Hover any cell — see how row × column gives the product.
      </h3>

      <div className="mt-5 overflow-x-auto">
        <div className="inline-grid" style={{ gridTemplateColumns: `repeat(${N + 1}, minmax(36px, 1fr))` }}>
          {/* Header row */}
          <div className="rounded-tl-xl bg-navy-50 p-2 text-center text-[11px] font-semibold text-navy-500">
            ×
          </div>
          {Array.from({ length: N }).map((_, j) => (
            <div
              key={`h-${j}`}
              className={cn(
                "bg-navy-50 p-2 text-center text-[11px] font-semibold",
                col === j ? "bg-orange-100 text-orange-700" : "text-navy-500"
              )}
            >
              {j + 1}
            </div>
          ))}

          {/* Body */}
          {Array.from({ length: N }).map((_, i) => (
            <div key={`row-${i}`} className="contents">
              <div
                className={cn(
                  "bg-navy-50 p-2 text-center text-[11px] font-semibold",
                  row === i ? "bg-orange-100 text-orange-700" : "text-navy-500"
                )}
              >
                {i + 1}
              </div>
              {Array.from({ length: N }).map((_, j) => {
                const active = row === i && col === j;
                const inRow = row === i;
                const inCol = col === j;
                return (
                  <button
                    key={`c-${i}-${j}`}
                    type="button"
                    onMouseEnter={() => {
                      setRow(i);
                      setCol(j);
                    }}
                    onFocus={() => {
                      setRow(i);
                      setCol(j);
                    }}
                    className={cn(
                      "aspect-square border border-navy-100/50 text-xs font-semibold transition-colors",
                      active
                        ? "bg-orange-500 text-white"
                        : inRow || inCol
                        ? "bg-orange-50 text-orange-800"
                        : "bg-white text-navy-700 hover:bg-mist"
                    )}
                  >
                    {(i + 1) * (j + 1)}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {row !== null && col !== null && (
        <div className="mt-4 rounded-2xl bg-navy-800 p-4 text-white">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-sky-300">
            Selected
          </div>
          <div className="mt-1 font-display text-2xl font-semibold">
            {row + 1} × {col + 1} ={" "}
            <span className="text-orange-300">{(row + 1) * (col + 1)}</span>
          </div>
        </div>
      )}
    </section>
  );
}
