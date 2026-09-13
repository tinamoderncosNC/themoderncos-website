// Intentionally short and fact-based, not testimonial-driven — client
// testimonials aren't ready yet (see brief). Structured as its own section so
// testimonials/logos can slot in above or below this block later without a
// rebuild; no client quotes or logos are fabricated to fill space.
export function ProofSection() {
  return (
    <section className="bg-offwhite" aria-labelledby="proof-heading">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <h2 id="proof-heading" className="text-3xl">
          Built by someone who&apos;s done the operations job, not just consulted on it.
        </h2>
        <p className="text-muted mt-6 text-lg">
          15+ years running GTM strategy and enablement inside enterprise teams at Cisco and
          Dimension Data/NTT, most recently as Director of GTM Enablement for Global Cloud and
          Security Services. MBA in Entrepreneurship &amp; Technology Commercialization from NC
          State.
        </p>
      </div>
    </section>
  );
}
