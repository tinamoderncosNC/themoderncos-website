// No CTA here by design (brief: "this page's job is credibility, not
// conversion"). No headshot exists yet (see DECISIONS.md) — ships text-only;
// this wrapper is the slot a future <Image> drops into without a rebuild.
export function AboutHero() {
  return (
    <section className="bg-navy" aria-labelledby="about-hero-heading">
      <div className="mx-auto max-w-3xl px-6 py-24 text-center sm:py-32">
        <p className="text-coral text-xs font-semibold tracking-widest uppercase">
          About The Modern CoS
        </p>
        <h1 id="about-hero-heading" className="text-offwhite mt-4 text-4xl sm:text-5xl">
          Tina Biello, Founder
        </h1>
        <p className="text-offwhite/80 mt-6 text-lg">
          15+ years running go-to-market operations inside enterprise technology companies. Now she
          builds the same systems for founders who don&apos;t have an enterprise team to build them.
        </p>
      </div>
    </section>
  );
}
