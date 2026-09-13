import { PendingCtaButton } from "@/components/pending-cta-button";

// Brand rule for this section (brief, "Global notes"): navy background, coral
// reserved for the eyebrow label and the primary CTA only. The secondary CTA
// is a plain text link, not coral, per the same rule.
export function Hero() {
  return (
    <section className="bg-navy" aria-labelledby="hero-heading">
      <div className="mx-auto max-w-3xl px-6 py-24 text-center sm:py-32">
        <p className="text-coral text-xs font-semibold tracking-widest uppercase">
          Operations advisory, powered by AI
        </p>
        <h1 id="hero-heading" className="text-offwhite mt-4 text-4xl sm:text-5xl">
          Your business outgrew your operations. We fix that.
        </h1>
        <p className="text-offwhite/80 mt-6 text-lg">
          The Modern CoS helps founder-led businesses replace chaos with systems, using practical AI
          instead of more headcount.
        </p>

        <div className="mt-10 flex flex-col items-center gap-6">
          <PendingCtaButton
            label="Take the Free Ops Leak Scorecard"
            note="The Scorecard is launching soon."
            noteId="hero-scorecard-note"
            tone="coral"
          />
          <a
            href="#the-problem"
            className="text-offwhite focus-visible:outline-coral underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            See how it works ↓
          </a>
        </div>
      </div>
    </section>
  );
}
