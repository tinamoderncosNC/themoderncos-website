import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { ProblemSection } from "@/components/home/problem-section";
import { WhatWeDo } from "@/components/home/what-we-do";
import { OfferLadder } from "@/components/home/offer-ladder";
import { ProofSection } from "@/components/home/proof-section";
import { FinalCta } from "@/components/home/final-cta";

const description =
  "The Modern CoS helps founder-led businesses replace chaos with systems, using practical AI instead of more headcount.";

export const metadata: Metadata = {
  title: "Operations Advisory, Powered by AI",
  description,
  alternates: { canonical: "/" },
  openGraph: { description },
};

export default function Home() {
  return (
    <>
      <Hero />
      <ProblemSection />
      <WhatWeDo />
      <OfferLadder />
      <ProofSection />
      <FinalCta />
    </>
  );
}
