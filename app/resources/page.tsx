import { PageHeader } from "@/components/site/PageHeader";
import { ResourceCentre } from "@/components/sections/ResourceCentre";
import { FinalCTA } from "@/components/sections/FinalCTA";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resource Centre · Free NAPLAN Packs & Worksheets",
  description:
    "Download free NAPLAN practice questions, maths worksheets and study guides — hand-picked by Australian maths educators.",
};

export default function ResourcesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Resource centre"
        title="Free NAPLAN packs, worksheets and study guides."
        description="Curated by our team of Australian maths educators. New material added every month — sign up once and get everything."
      />
      <ResourceCentre />
      <FinalCTA />
    </>
  );
}
