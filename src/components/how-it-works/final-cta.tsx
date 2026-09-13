import Link from "next/link";
import { PendingCtaButton } from "@/components/pending-cta-button";

// Navy, matching the Home hero/final-cta pattern (coral PendingCtaButton +
// plain offwhite text link) rather than Services/Products' off-white final
// CTA — keeps this page's five sections in a clean navy/off-white
// alternation ending on navy, same shape as About's section sequence.
export function HowItWorksFinalCta() {
  return (
    <section className="bg-navy" aria-labelledby="how-it-works-final-cta-heading">
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h2 id="how-it-works-final-cta-heading" className="text-offwhite text-3xl">
          Ready to see where you&apos;re starting?
        </h2>
        <p className="text-offwhite/80 mt-4 text-lg">
          Take the free Ops Leak Scorecard, or skip straight to a conversation if you already know
          what&apos;s broken.
        </p>
        <div className="mt-8 flex flex-col items-center gap-6">
          <PendingCtaButton
            label="Take the Free Ops Leak Scorecard"
            note="The Scorecard is launching soon."
            noteId="how-it-works-final-cta-scorecard-note"
            tone="coral"
          />
          <Link
            href="/contact"
            className="text-offwhite focus-visible:outline-coral underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Talk to Tina
          </Link>
        </div>
      </div>
    </section>
  );
}
