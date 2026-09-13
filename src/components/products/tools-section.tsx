import { PendingCtaButton } from "@/components/pending-cta-button";
import { WaitlistCta } from "@/components/products/waitlist-cta";

// Same 4-color ladder-progression system as the Services page (navy -> amber
// -> sage -> coral), reusing the exact card structure locked in there, per
// the brief's own "these two pages should feel like siblings" instruction.
//
// Card 1 (free Scorecard) keeps its disabled PendingCtaButton — untouched,
// tied to the separate Scorecard popup work. Cards 2-4 collect waitlist
// interest instead of a real purchase: no checkout exists yet (Lemon
// Squeezy integration is still Increment 5 per DECISIONS.md's Architecture
// section), so these three now render <WaitlistCta>, which inserts into
// Supabase's waitlist_signups table on submit. `price` on those three
// surfaces as a small tag near the name, since it no longer appears inside
// the CTA label the way "Buy for $25" once did.
const tools = [
  {
    name: "Ops Leak Scorecard",
    price: null,
    description:
      "A 4-minute assessment that scores your operation across documentation, handoffs, tool sprawl, and founder dependency, and names your top three leaks in order.",
    includes: ["Scored result page", "One routed next step based on your worst category"],
    bestFor: "You're not sure yet where the time is actually going.",
    tone: "navy" as const,
  },
  {
    name: "GEO/AEO Content Prompt Builder",
    price: "$25",
    description:
      "Assembles a prompt that turns your input into an article built to get cited by AI answer engines, not just ranked by a search box. The prompt encodes the actual structural rules that make content citable: answer-first openings, entity clarity, sourced claims, no fabricated stats.",
    includes: [
      "Live preview before you copy anything",
      "Sourcing guardrails so it can't quietly invent a stat you'd end up publishing",
      "A CONFIG block you edit once to brand it for your own business",
      "One fully worked example",
    ],
    bestFor: "You want the flagship tool on its own, nothing else.",
    tone: "amber" as const,
  },
  {
    name: "Full Prompt-Builder Bundle",
    price: "$35",
    description:
      "The GEO/AEO builder plus its companion social-post builder and the paste guide that tells you which AI design tool to use for what. The two builders chain together, article in, on-brand social post out, without losing the facts or the hook.",
    includes: [
      "Both tools",
      "The paste guide",
      "Twelve months of updates",
      "A license for use inside your own business",
    ],
    bestFor: "You want the whole content pipeline, not just one piece of it.",
    tone: "sage" as const,
  },
  {
    name: "Bundle + Workflow Tier Diagnostic",
    price: "$49",
    description:
      "Everything in the bundle, plus a self-serve diagnostic on one workflow of your choosing. It classifies the workflow's automation tier and hands you a build brief specific enough to give a developer, even one who isn't us.",
    includes: [
      "Everything in the Full Prompt-Builder Bundle",
      "Guided intake on one workflow",
      "Automatic tier classification",
      "A scoped build brief with an effort estimate",
    ],
    bestFor:
      "You've got a workflow problem bigger than content, and want a scoped brief before spending on a build.",
    tone: "coral" as const,
  },
];

export function ToolsSection() {
  return (
    <section className="bg-offwhite" aria-labelledby="tools-heading">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 id="tools-heading" className="text-center text-3xl">
          Four ways to get started on your own
        </h2>

        {/* Default grid align-items (stretch) makes every card match the
            tallest one in its row; each card is a flex column so mt-auto on
            the CTA wrapper pins every button to the same bottom edge
            regardless of how much copy is above it, matching the Services
            ladder pattern exactly. */}
        <ul className="mt-14 grid list-none gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool) => (
            <li
              key={tool.name}
              className="border-hairline flex flex-col rounded-lg border bg-white p-8"
            >
              {tool.price && (
                <p className="text-coral text-xs font-semibold tracking-widest uppercase">
                  {tool.price}
                </p>
              )}
              <h3 className={tool.price ? "mt-1 text-xl" : "text-xl"}>{tool.name}</h3>
              <p className="text-muted mt-3 text-sm">{tool.description}</p>

              <p className="text-navy mt-4 text-xs font-semibold tracking-widest uppercase">
                Includes
              </p>
              <ul className="text-muted mt-2 list-disc space-y-1 pl-5 text-sm">
                {tool.includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <p className="text-muted mt-4 text-sm">
                <span className="text-navy font-semibold">Best for:</span> {tool.bestFor}
              </p>

              <div className="mt-auto pt-6">
                {tool.tone === "navy" ? (
                  <PendingCtaButton
                    label="Get Your Score"
                    note="The Scorecard is launching soon."
                    noteId="tool-navy-note"
                    tone="navy"
                    noteClassName="text-muted"
                  />
                ) : (
                  <WaitlistCta tierName={tool.name} tierPrice={tool.price!} tone={tool.tone} />
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
