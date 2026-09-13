import Link from "next/link";
import { PendingCtaButton } from "@/components/pending-cta-button";

// The Scorecard still isn't live (see DECISIONS.md) — same disabled,
// honestly-captioned treatment as the homepage's PendingCtaButton instances,
// not a working link yet. Secondary CTA renders as a plain text link, not a
// second button of equal weight, per the brief.
export function ServicesFinalCta() {
  return (
    <section className="bg-offwhite" aria-labelledby="services-final-cta-heading">
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h2 id="services-final-cta-heading" className="text-3xl">
          Not sure which tier fits?
        </h2>
        <p className="text-muted mt-4 text-lg">
          The Ops Leak Scorecard routes you to the right starting point based on where you&apos;re
          actually losing time.
        </p>
        <div className="mt-8 flex flex-col items-center gap-6">
          <PendingCtaButton
            label="Take the Free Ops Leak Scorecard"
            note="The Scorecard is launching soon."
            noteId="services-final-cta-scorecard-note"
            tone="coral"
          />
          <Link
            href="/contact"
            className="text-navy focus-visible:outline-coral underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Talk to Tina
          </Link>
        </div>
      </div>
    </section>
  );
}
