// No CTA here by design (brief: "this page's job is to build confidence in
// the process, not convert on the first scroll"), same reasoning as the
// about/services/products heroes.
export function HowItWorksHero() {
  return (
    <section className="bg-navy" aria-labelledby="how-it-works-hero-heading">
      <div className="mx-auto max-w-3xl px-6 py-24 text-center sm:py-32">
        <p className="text-coral text-xs font-semibold tracking-widest uppercase">How It Works</p>
        <h1 id="how-it-works-hero-heading" className="text-offwhite mt-4 text-4xl sm:text-5xl">
          No surprises between &quot;let&apos;s do this&quot; and &quot;it&apos;s done.&quot;
        </h1>
        <p className="text-offwhite/80 mt-6 text-lg">
          Every engagement follows the same four steps, whether it&apos;s a single workflow fix or
          an ongoing retainer. Here&apos;s exactly what happens at each one.
        </p>
      </div>
    </section>
  );
}
