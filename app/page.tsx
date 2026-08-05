import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { WhyUs } from "@/components/sections/WhyUs";
import { Programs } from "@/components/sections/Programs";
import { Process } from "@/components/sections/Process";
import { Stats } from "@/components/sections/Stats";
import { Testimonials } from "@/components/sections/Testimonials";
import { ResourceCentre } from "@/components/sections/ResourceCentre";
import { Pricing } from "@/components/sections/Pricing";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <WhyUs />
      <Programs />
      <Process />
      <Stats />
      <Testimonials />
      <ResourceCentre />
      <Pricing />
      <FAQ />
      <FinalCTA />
    </>
  );
}
