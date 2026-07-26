import type { Metadata } from "next";
import { MarketingPlaceholderPage } from "@/components/marketing-placeholder-page";

export const metadata: Metadata = {
  title: "About",
  description: "About Modern CoS, LLC.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <MarketingPlaceholderPage eyebrow="About" title="About Modern CoS" />;
}
