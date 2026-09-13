const pillars = [
  {
    lead: "Operations-first.",
    body: "Every recommendation has to save time, reduce complexity, or improve clarity. If it doesn't, it doesn't get built.",
  },
  {
    lead: "Built with you, not around you.",
    body: "You keep the keys. We teach your team to run and adjust every system we build, so you're never locked to us.",
  },
  {
    lead: "Right-sized for where you are.",
    body: "Engagements start at a single workflow fix and scale to a fractional Chief of Staff retainer. You don't have to buy the whole relationship on day one.",
  },
];

export function WhatWeDo() {
  return (
    <section className="bg-navy" aria-labelledby="what-we-do-heading">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="what-we-do-heading" className="text-offwhite text-3xl">
            Operations fluency. Practical AI. No jargon.
          </h2>
          <p className="text-offwhite/80 mt-6 text-lg">
            We&apos;re not a tool demo shop and we&apos;re not a strategy consultancy that hands you
            a deck and disappears. We build the systems, SOPs, and automations that actually run
            your business day to day, and we use AI where it removes work, not where it looks
            impressive.
          </p>
        </div>

        <ul className="mt-14 grid list-none gap-10 sm:grid-cols-3">
          {pillars.map((pillar) => (
            <li key={pillar.lead}>
              <p className="text-offwhite font-heading font-semibold">{pillar.lead}</p>
              <p className="text-offwhite/80 mt-2 text-sm">{pillar.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
