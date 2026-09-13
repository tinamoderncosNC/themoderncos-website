import type { Metadata } from "next";
import { ProductsHero } from "@/components/products/hero";
import { ToolsSection } from "@/components/products/tools-section";
import { HowItWorksSection } from "@/components/products/how-it-works-section";
import { NeedMoreSection } from "@/components/products/need-more-section";
import { ProductsFinalCta } from "@/components/products/final-cta";

const description =
  "No call, no proposal, no waiting. Buy it, open it in your browser, and use it today.";

export const metadata: Metadata = {
  title: "Products",
  description,
  alternates: { canonical: "/products" },
  openGraph: { description },
};

export default function ProductsPage() {
  return (
    <>
      <ProductsHero />
      <ToolsSection />
      <HowItWorksSection />
      <NeedMoreSection />
      <ProductsFinalCta />
    </>
  );
}
