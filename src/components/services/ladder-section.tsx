import Link from "next/link";

// No dollar figures anywhere per the brief — pricing is locked internally
// (see the AI Workflow Support Partnership one-pager) but every CTA below
// routes to a conversation, not a price. No distinct booking page or
// calendar link exists yet for any tier, so all four CTAs point at the same
// /contact route today, differentiated only by label. Flagged in
// DECISIONS.md as an assumption to revisit once a real booking flow exists.
//
// CTA `tone` is a 4-color ladder progression (navy -> amber -> sage -> coral)
// per Tina's direct instruction, superseding this brief's original
// navy-on-cards-1-3/coral-on-card-4 pairing. Text color per tone was picked
// by WCAG AA contrast, not by the brief's literal color call: amber/coral
// with white text and sage with either text color all measured under 4.5:1
// (amber caught by Tina, sage/coral caught in review) — see DECISIONS.md for
// the exact ratios and the --color-sage lightening this required.
const tiers = [
  {
    name: "Guided Diagnostic",
    description:
      "A working session plus a written brief that names your top operational leaks and what fixing each one would take.",
    includes: [
      "Live working session",
      "Written diagnostic brief",
      "A scoped recommendation for next steps (not a generic report)",
    ],
    bestFor:
      "You know something's off but need it named and prioritized before committing to a build.",
    cta: "Book a Diagnostic Call",
    tone: "navy" as const,
  },
  {
    name: "Build Sprint",
    description:
      "A fixed-scope engagement to fix one workflow end to end: mapped, documented, and automated where it makes sense.",
    includes: ["Workflow map", "Documentation", "Automation build", "Handoff training"],
    bestFor: "You've already identified the one thing costing you the most hours.",
    cta: "Get a Sprint Quote",
    tone: "amber" as const,
  },
  {
    name: "Implementation Project",
    description:
      "A larger, multi-workflow build for operations that need more than one fix, delivered as a single coordinated project.",
    includes: [
      "Everything in a Sprint, scaled across multiple connected workflows",
      "A project plan",
      "Milestone check-ins",
    ],
    bestFor: "The problem isn't one workflow, it's how several of them interact.",
    cta: "Discuss Your Project",
    tone: "sage" as const,
  },
  {
    name: "Fractional Chief of Staff",
    description:
      "Ongoing operational partnership. Someone owns the system, not just a project, with monthly capacity for new builds and fixes as they come up.",
    includes: [
      "Monthly retainer hours",
      "Ongoing SOP maintenance",
      "Priority access",
      "Recurring strategy check-ins",
    ],
    bestFor:
      "You've outgrown one-off fixes and need someone accountable for the operation long term.",
    cta: "Talk to Tina About a Retainer",
    tone: "coral" as const,
  },
];

const ctaBase =
  "inline-block rounded px-6 py-3 font-medium focus-visible:outline-coral focus-visible:outline-2 focus-visible:outline-offset-2";
const ctaToneClasses: Record<(typeof tiers)[number]["tone"], string> = {
  navy: "bg-navy text-offwhite",
  amber: "bg-amber text-navy",
  sage: "bg-sage text-navy",
  coral: "bg-coral text-navy",
};

export function LadderSection() {
  return (
    <section className="bg-offwhite" aria-labelledby="ladder-heading">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 id="ladder-heading" className="text-center text-3xl">
          Four ways to work together
        </h2>

        {/* Default grid align-items (stretch) makes every card match the
            tallest one in its row; each card is a flex column so mt-auto on
            the CTA wrapper pins every button to the same bottom edge
            regardless of how much copy is above it, per Tina's direction. */}
        <ul className="mt-14 grid list-none gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((tier) => (
            <li
              key={tier.name}
              className="border-hairline flex flex-col rounded-lg border bg-white p-8"
            >
              <h3 className="text-xl">{tier.name}</h3>
              <p className="text-muted mt-3 text-sm">{tier.description}</p>

              <p className="text-navy mt-4 text-xs font-semibold tracking-widest uppercase">
                Includes
              </p>
              <ul className="text-muted mt-2 list-disc space-y-1 pl-5 text-sm">
                {tier.includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <p className="text-muted mt-4 text-sm">
                <span className="text-navy font-semibold">Best for:</span> {tier.bestFor}
              </p>

              <div className="mt-auto pt-6">
                <Link href="/contact" className={`${ctaBase} ${ctaToneClasses[tier.tone]}`}>
                  {tier.cta}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
