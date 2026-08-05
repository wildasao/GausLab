import { PageHeader } from "@/components/site/PageHeader";
import { ProgramDetail } from "@/components/sections/ProgramDetail";
import { Assessment } from "@/components/sections/Assessment";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { FAQ } from "@/components/sections/FAQ";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maths Programs · Years 3, 5, 7, 9 & NAPLAN Prep",
  description:
    "Explore GausLab's structured maths tutoring programs for Years 3, 5, 7 and 9 — curriculum-aligned, NAPLAN-focused, with detailed topic breakdowns and sample assessments.",
};

export default function ProgramsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Programs"
        title="Maths programs built for how Australian kids actually learn."
        description="Every program is aligned to the Australian Curriculum V9 and adapted for NSW, VIC and QLD syllabi. Choose a year level below to see the full topic list, outcomes and a real assessment sample."
      />
      <ProgramDetail />
      <Assessment />
      <FAQ />
      <FinalCTA />
    </>
  );
}
