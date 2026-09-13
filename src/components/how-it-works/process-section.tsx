const steps = [
  {
    number: "01",
    name: "Find the leak",
    whatHappens:
      "Start with the free Ops Leak Scorecard for a quick read, or book a Guided Diagnostic if you want a working session and a written brief. Either way, you leave knowing exactly where the hours are going and what fixing it would actually take.",
    youGet:
      "A ranked list of what's costing you the most time, and a fixed quote for fixing the top one.",
  },
  {
    number: "02",
    name: "Lock the scope",
    whatHappens:
      "Before any work starts, you get a scope lock document: what's included, what isn't, what it costs, and how long it takes. No open-ended hours you can't predict, no scope creep disguised as “just one more thing.”",
    youGet: "A signed agreement with a real price and a real timeline, not an estimate.",
  },
  {
    number: "03",
    name: "We build it in your accounts",
    whatHappens:
      "The workflow gets built inside your own tools, not ours. You're never locked into our infrastructure to keep it running. Anything that posts, sends, or publishes externally has a human approval step wired in before it goes live.",
    youGet:
      "A recorded walkthrough of the finished system and a named point of contact on both sides.",
  },
  {
    number: "04",
    name: "You own it",
    whatHappens:
      "Every build ends with documentation and training, not a black box. If a system only works while we're involved, the job isn't finished. From here, you can stop, book another Sprint for the next workflow, or move into an ongoing retainer.",
    youGet:
      "A tool-agnostic SOP, a tool-specific appendix, and a 30-day window to catch anything that doesn't work as scoped.",
  },
];

// A vertical sequence, not a grid: the brief is explicit that these
// shouldn't read as "cards competing for attention" and that step 3 (the
// longest) shouldn't be squeezed to match the others. A side-by-side grid
// would force exactly that comparison even with align-items left alone, so
// this stays a single reading column instead.
export function ProcessSection() {
  return (
    <section className="bg-offwhite" aria-labelledby="process-heading">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <h2 id="process-heading" className="text-center text-3xl">
          Four steps, every time
        </h2>

        <ol className="mt-14 list-none space-y-12">
          {steps.map((step) => (
            <li key={step.number} className="flex gap-6">
              <span className="font-heading text-coral shrink-0 text-3xl font-bold">
                {step.number}
              </span>
              <div>
                <h3 className="text-xl">{step.name}</h3>
                <p className="text-muted mt-2">{step.whatHappens}</p>
                <p className="text-muted mt-3 text-sm">
                  <span className="text-navy font-semibold">You get:</span> {step.youGet}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
