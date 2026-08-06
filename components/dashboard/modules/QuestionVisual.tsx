"use client";

import type { QuestionVisual as QV } from "@/lib/modules";
import { MultiplicationArray } from "./visuals/MultiplicationArray";
import { FractionBar } from "./visuals/FractionBar";
import { PythagorasTriangle } from "./visuals/PythagorasTriangle";
import { CoordinatePlane } from "./visuals/CoordinatePlane";
import { PlaceValueBlocks } from "./visuals/PlaceValueBlocks";

export function QuestionVisual({ visual }: { visual: QV }) {
  const { name } = visual;
  const p = (visual.props ?? {}) as Record<string, unknown>;
  return (
    <div className="mb-4 -mx-6 -mt-6 rounded-t-3xl bg-gradient-to-b from-mist to-white px-4 pt-4 sm:mx-0 sm:mt-0 sm:rounded-2xl sm:p-2 sm:ring-1 sm:ring-navy-100">
      <div className="mb-1 pl-1 text-[10px] font-semibold uppercase tracking-widest text-slate-500 sm:hidden">
        Interactive scenario — try it before you answer
      </div>
      {name === "multiplication-array" && (
        <MultiplicationArray
          startRows={(p.startRows as number) ?? 3}
          startCols={(p.startCols as number) ?? 2}
          startTheme={(p.startTheme as "apples" | "stars" | "hearts" | "cookies") ?? "apples"}
        />
      )}
      {name === "fraction-bar" && (
        <FractionBar start={(p.start as [number, number]) ?? [3, 4]} />
      )}
      {name === "pythagoras" && (
        <PythagorasTriangle a={(p.a as number) ?? 3} b={(p.b as number) ?? 4} />
      )}
      {name === "coordinate-plane" && (
        <CoordinatePlane start={(p.start as [number, number]) ?? [3, 2]} />
      )}
      {name === "place-value-blocks" && (
        <PlaceValueBlocks start={(p.start as number) ?? 342} />
      )}
    </div>
  );
}
