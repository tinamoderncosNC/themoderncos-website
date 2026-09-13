// No CTA here by design (brief: "the conversion moment is the card grid
// below"), same reasoning as about/services heroes.
export function ProductsHero() {
  return (
    <section className="bg-navy" aria-labelledby="products-hero-heading">
      <div className="mx-auto max-w-3xl px-6 py-24 text-center sm:py-32">
        <p className="text-coral text-xs font-semibold tracking-widest uppercase">Products</p>
        <h1 id="products-hero-heading" className="text-offwhite mt-4 text-4xl sm:text-5xl">
          Start with a tool, not a conversation.
        </h1>
        <p className="text-offwhite/80 mt-6 text-lg">
          No call, no proposal, no waiting. Buy it, open it in your browser, and use it today. If
          you outgrow what a tool can do, that&apos;s what the Services page is for.
        </p>
      </div>
    </section>
  );
}
