import type { Metadata } from "next";
import { AboutHero } from "@/components/about/hero";
import { StorySection } from "@/components/about/story-section";
import { BackgroundSection } from "@/components/about/background-section";
import { HowWeWorkSection } from "@/components/about/how-we-work-section";
import { AboutFinalCta } from "@/components/about/final-cta";

const description =
  "15+ years running go-to-market operations inside enterprise technology companies. Now she builds the same systems for founders who don't have an enterprise team to build them.";

export const metadata: Metadata = {
  title: "Tina Biello, Founder",
  description,
  alternates: { canonical: "/about" },
  openGraph: { description },
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <StorySection />
      <BackgroundSection />
      <HowWeWorkSection />
      <AboutFinalCta />
    </>
  );
}
