import Link from "next/link";
import { PendingCtaButton } from "@/components/pending-cta-button";

// Simplified 3-rung view of the internal 7-stage ladder (Scorecard -> Sprint
// -> Retainer), for a first-time visitor who needs one next step. Self-serve
// digital tools and the guided diagnostic can get their own products/pricing
// page later without reworking this section.
export function OfferLadder() {
  return (
    <section id="how-to-start" className="bg-offwhite" aria-labelledby="offer-ladder-heading">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <h2 id="offer-ladder-heading" className="text-center text-3xl">
          Start wherever makes sense for you.
        </h2>

        <ul className="mt-14 grid list-none gap-8 md:grid-cols-3">
          <li className="border-hairline flex flex-col rounded-lg border bg-white p-8">
            <p className="text-coral text-xs font-semibold tracking-widest uppercase">Free</p>
            <h3 className="mt-3 text-xl">Ops Leak Scorecard</h3>
            <p className="text-muted mt-3 flex-1 text-sm">
              A 4-minute assessment that scores your operation across documentation, handoffs, tool
              sprawl, and founder dependency, and tells you where you&apos;re losing the most hours.
            </p>
            <div className="mt-6">
              <PendingCtaButton
                label="Get Your Score"
                note="Launching soon."
                noteId="offer-scorecard-note"
                tone="navy"
              />
            </div>
          </li>

          <li className="border-hairline flex flex-col rounded-lg border bg-white p-8">
            <p className="text-coral text-xs font-semibold tracking-widest uppercase">Project</p>
            <h3 className="mt-3 text-xl">CoS Sprint™</h3>
            <p className="text-muted mt-3 flex-1 text-sm">
              A fixed-scope engagement to fix one workflow: mapped, documented, and automated where
              it makes sense. Clear deliverable, clear price, clear timeline.
            </p>
            <div className="mt-6">
              <PendingCtaButton
                label="See What's Included"
                note="Launching soon."
                noteId="offer-sprint-note"
                tone="navy"
              />
            </div>
          </li>

          <li className="border-hairline flex flex-col rounded-lg border bg-white p-8">
            <p className="text-coral text-xs font-semibold tracking-widest uppercase">Retainer</p>
            <h3 className="mt-3 text-xl">Fractional Chief of Staff</h3>
            <p className="text-muted mt-3 flex-1 text-sm">
              Ongoing operational partnership for businesses that have outgrown ad hoc fixes and
              need someone owning the system, not just a project.
            </p>
            <div className="mt-6">
              <Link
                href="/contact"
                className="bg-navy text-offwhite focus-visible:outline-coral inline-block rounded px-6 py-3 font-medium focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Talk to Tina
              </Link>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}
