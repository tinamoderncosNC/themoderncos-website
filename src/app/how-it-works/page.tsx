import type { Metadata } from "next";
import { HowItWorksHero } from "@/components/how-it-works/hero";
import { ProcessSection } from "@/components/how-it-works/process-section";
import { GuardrailsSection } from "@/components/how-it-works/guardrails-section";
import { TimelinesSection } from "@/components/how-it-works/timelines-section";
import { HowItWorksFinalCta } from "@/components/how-it-works/final-cta";

const description =
  "Every engagement follows the same four steps, whether it's a single workflow fix or an ongoing retainer. Here's exactly what happens at each one.";

export const metadata: Metadata = {
  title: "How It Works",
  description,
  alternates: { canonical: "/how-it-works" },
  openGraph: { description },
};

export default function HowItWorksPage() {
  return (
    <>
      <HowItWorksHero />
      <ProcessSection />
      <GuardrailsSection />
      <TimelinesSection />
      <HowItWorksFinalCta />
    </>
  );
}
