import type { Metadata } from "next";
import { ContactFormPlaceholder } from "@/components/contact-form-placeholder";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Modern CoS.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <p className="text-navy text-xs font-semibold tracking-widest uppercase">Contact</p>
      <h1 className="mt-4 text-4xl">Contact</h1>
      <p className="text-muted mt-4">
        [PLACEHOLDER — contact page copy pending real content; form below is display-only until
        Increment 7 wires up submission handling]
      </p>
      <ContactFormPlaceholder />
    </div>
  );
}
