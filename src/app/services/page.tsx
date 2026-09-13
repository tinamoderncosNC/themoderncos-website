import type { Metadata } from "next";
import { ServicesHero } from "@/components/services/hero";
import { LadderSection } from "@/components/services/ladder-section";
import { OnCallSection } from "@/components/services/on-call-section";
import { HowDifferentSection } from "@/components/services/how-different-section";
import { ServicesFinalCta } from "@/components/services/final-cta";

const description =
  "From a single diagnostic conversation to an ongoing operational partnership. Every tier is built around one rule: it has to save time, reduce complexity, or improve clarity, or it doesn't happen.";

export const metadata: Metadata = {
  title: "Services",
  description,
  alternates: { canonical: "/services" },
  openGraph: { description },
};

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <LadderSection />
      <OnCallSection />
      <HowDifferentSection />
      <ServicesFinalCta />
    </>
  );
}
