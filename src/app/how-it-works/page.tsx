import type { Metadata } from "next";
import { MarketingPlaceholderPage } from "@/components/marketing-placeholder-page";

export const metadata: Metadata = {
  title: "How It Works",
  description: "How Modern CoS's prompt products work.",
  alternates: { canonical: "/how-it-works" },
};

export default function HowItWorksPage() {
  return <MarketingPlaceholderPage eyebrow="How It Works" title="How It Works" />;
}
