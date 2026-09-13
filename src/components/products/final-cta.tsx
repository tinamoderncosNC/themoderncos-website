import { PendingCtaButton } from "@/components/pending-cta-button";

// The Scorecard still isn't live (see DECISIONS.md) — same disabled,
// honestly-captioned treatment as home/services. Brief specifies only one
// CTA here (unlike Services' final CTA, which also has a secondary "Talk to
// Tina" link) — no second link is added just to visually match Services,
// per the sitewide rule against competing CTAs.
export function ProductsFinalCta() {
  return (
    <section className="bg-offwhite" aria-labelledby="products-final-cta-heading">
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h2 id="products-final-cta-heading" className="text-3xl">
          Not sure which one to start with?
        </h2>
        <p className="text-muted mt-4 text-lg">
          The Ops Leak Scorecard takes four minutes and points you at the right tool based on where
          you&apos;re actually losing time.
        </p>
        <div className="mt-8 flex justify-center">
          <PendingCtaButton
            label="Take the Free Ops Leak Scorecard"
            note="The Scorecard is launching soon."
            noteId="products-final-cta-scorecard-note"
            tone="coral"
            noteClassName="text-muted"
          />
        </div>
      </div>
    </section>
  );
}
