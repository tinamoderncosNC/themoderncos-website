import { PendingCtaButton } from "@/components/home/pending-cta-button";

export function FinalCta() {
  return (
    <section className="bg-navy" aria-labelledby="final-cta-heading">
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h2 id="final-cta-heading" className="text-offwhite text-3xl">
          Find out where you&apos;re leaking time.
        </h2>
        <p className="text-offwhite/80 mt-4 text-lg">
          Four minutes. No sales call required to see your results.
        </p>
        <div className="mt-8 flex justify-center">
          <PendingCtaButton
            label="Take the Free Ops Leak Scorecard"
            note="The Scorecard is launching soon."
            noteId="final-cta-scorecard-note"
            tone="coral"
          />
        </div>
      </div>
    </section>
  );
}
