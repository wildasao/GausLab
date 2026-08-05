import { PageHeader } from "@/components/site/PageHeader";
import { Pricing } from "@/components/sections/Pricing";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing · Simple plans, no lock-in contracts",
  description:
    "Transparent pricing for GausLab Maths Academy — pay per term or weekly. Every plan starts with a free diagnostic assessment.",
};

export default function PricingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title="Transparent pricing. Australian value."
        description="Pay per term (12 weeks) with an 8% discount, or weekly with no lock-in. All prices include GST."
      />
      <Pricing />
      <FAQ />
      <FinalCTA />
    </>
  );
}
