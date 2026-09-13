// No CTA here by design (brief: "this page's conversion moment is the ladder
// itself and the final CTA, not the top"), same reasoning as the about page
// hero.
export function ServicesHero() {
  return (
    <section className="bg-navy" aria-labelledby="services-hero-heading">
      <div className="mx-auto max-w-3xl px-6 py-24 text-center sm:py-32">
        <p className="text-coral text-xs font-semibold tracking-widest uppercase">Services</p>
        <h1 id="services-hero-heading" className="text-offwhite mt-4 text-4xl sm:text-5xl">
          Pick the level of help that matches where you are.
        </h1>
        <p className="text-offwhite/80 mt-6 text-lg">
          From a single diagnostic conversation to an ongoing operational partnership. Every tier
          below is built around one rule: it has to save time, reduce complexity, or improve
          clarity, or it doesn&apos;t happen.
        </p>
      </div>
    </section>
  );
}
