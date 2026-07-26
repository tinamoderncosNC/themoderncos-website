import type { Metadata } from "next";
import { MarketingPlaceholderPage } from "@/components/marketing-placeholder-page";

export const metadata: Metadata = {
  title: "Services",
  description: "Consulting services offered by Modern CoS.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return <MarketingPlaceholderPage eyebrow="Services" title="Services" />;
}
