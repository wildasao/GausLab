"use client";

import type { Block } from "@/lib/modules";
import { Theory, Tip } from "./Theory";
import { Video } from "./Video";
import { Example } from "./Example";
import { McqQuestion, NumericQuestion } from "./Question";
import { FractionBar } from "./visuals/FractionBar";
import { EquationBalance } from "./visuals/EquationBalance";
import { PythagorasTriangle } from "./visuals/PythagorasTriangle";
import { TimesTableGrid } from "./visuals/TimesTableGrid";
import { PlaceValueBlocks } from "./visuals/PlaceValueBlocks";
import { CoordinatePlane } from "./visuals/CoordinatePlane";
import { MultiplicationArray } from "./visuals/MultiplicationArray";
import { TimesTableRace } from "./games/TimesTableRace";
import { ProblemLab } from "./labs/ProblemLab";

export function BlockRenderer({
  block,
  onAnswer,
}: {
  block: Block;
  onAnswer?: (correct: boolean) => void;
}) {
  switch (block.kind) {
    case "theory":
      return <Theory title={block.title} body={block.body} />;
    case "tip":
      return <Tip body={block.body} />;
    case "video":
      return <Video src={block.src} title={block.title} caption={block.caption} />;
    case "example":
      return <Example problem={block.problem} steps={block.steps} answer={block.answer} />;
    case "mcq":
      return (
        <McqQuestion
          prompt={block.prompt}
          choices={block.choices}
          answerIndex={block.answerIndex}
          explanation={block.explanation}
          hint={block.hint}
          visual={block.visual}
          onAnswer={onAnswer}
        />
      );
    case "numeric":
      return (
        <NumericQuestion
          prompt={block.prompt}
          answer={block.answer}
          unit={block.unit}
          tolerance={block.tolerance}
          explanation={block.explanation}
          hint={block.hint}
          visual={block.visual}
          onAnswer={onAnswer}
        />
      );
    case "visual":
      if (block.name === "fraction-bar") {
        const p = (block.props ?? {}) as { start?: [number, number] };
        return <FractionBar start={p.start ?? [3, 4]} />;
      }
      if (block.name === "equation-balance") {
        const p = (block.props ?? {}) as { equation?: string };
        return <EquationBalance equation={p.equation ?? "x + 3 = 7"} />;
      }
      if (block.name === "pythagoras") {
        const p = (block.props ?? {}) as { a?: number; b?: number };
        return <PythagorasTriangle a={p.a ?? 3} b={p.b ?? 4} />;
      }
      if (block.name === "times-table") return <TimesTableGrid />;
      if (block.name === "place-value-blocks") {
        const p = (block.props ?? {}) as { start?: number };
        return <PlaceValueBlocks start={p.start ?? 342} />;
      }
      if (block.name === "coordinate-plane") {
        const p = (block.props ?? {}) as { start?: [number, number] };
        return <CoordinatePlane start={p.start ?? [3, 2]} />;
      }
      if (block.name === "multiplication-array") {
        const p = (block.props ?? {}) as {
          startRows?: number;
          startCols?: number;
          startTheme?: "apples" | "stars" | "hearts" | "cookies";
        };
        return (
          <MultiplicationArray
            startRows={p.startRows ?? 3}
            startCols={p.startCols ?? 2}
            startTheme={p.startTheme ?? "apples"}
          />
        );
      }
      return null;
    case "game":
      if (block.name === "times-table-race") {
        const p = (block.props ?? {}) as { durationSeconds?: number };
        return <TimesTableRace durationSeconds={p.durationSeconds ?? 60} />;
      }
      return null;
    case "lab":
      return <ProblemLab name={block.name} />;
  }
}

export function isQuestion(block: Block) {
  return block.kind === "mcq" || block.kind === "numeric";
}
