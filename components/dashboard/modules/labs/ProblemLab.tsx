"use client";

import { MultiplicationLab } from "./MultiplicationLab";
import { FractionLab } from "./FractionLab";
import { PythagorasLab } from "./PythagorasLab";
import { PlaceValueLab } from "./PlaceValueLab";
import type { ProblemKind } from "@/lib/problems";

export function ProblemLab({ name }: { name: ProblemKind }) {
  switch (name) {
    case "multiplication":
      return <MultiplicationLab />;
    case "fraction":
      return <FractionLab />;
    case "pythagoras":
      return <PythagorasLab />;
    case "place-value":
      return <PlaceValueLab />;
    default:
      return null;
  }
}
