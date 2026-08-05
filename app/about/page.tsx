import { PageHeader } from "@/components/site/PageHeader";
import { Stats } from "@/components/sections/Stats";
import { Testimonials } from "@/components/sections/Testimonials";
import { FinalCTA } from "@/components/sections/FinalCTA";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About · GausLab Maths Academy",
  description:
    "GausLab is an Australian maths tutoring academy built by educators — helping students in Years 3, 5, 7 and 9 gain confidence and top NAPLAN results.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our story"
        title="Built by Australian educators, for Australian kids."
        description="GausLab was founded to give every family access to the kind of personalised, evidence-based maths tutoring usually reserved for elite private schools."
      />
      <Stats />
      <Testimonials />
      <FinalCTA />
    </>
  );
}
