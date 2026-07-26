type MarketingPlaceholderPageProps = {
  title: string;
  eyebrow: string;
};

// /references has no real copy for this page yet (see DECISIONS.md, "Product
// content inventory"). This renders the GEO-required structure — subject,
// audience/problem, process/limitations, Q&A — as labeled placeholder slots
// so the pattern is consistent across pages and just needs real copy dropped
// in once it's supplied (Increment 10).
export function MarketingPlaceholderPage({ title, eyebrow }: MarketingPlaceholderPageProps) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <p className="text-navy text-xs font-semibold tracking-widest uppercase">{eyebrow}</p>
      <h1 className="mt-4 text-4xl">{title}</h1>
      <p className="text-muted mt-4">
        [PLACEHOLDER — page content pending real copy; see DECISIONS.md]
      </p>

      <section className="border-hairline mt-12 border-t pt-8" aria-labelledby="audience-heading">
        <h2 id="audience-heading" className="text-xl">
          Who this is for, and the problem it solves
        </h2>
        <p className="text-muted mt-2">[PLACEHOLDER — audience and problem statement]</p>
      </section>

      <section className="border-hairline mt-12 border-t pt-8" aria-labelledby="process-heading">
        <h2 id="process-heading" className="text-xl">
          How it works, and its limitations
        </h2>
        <p className="text-muted mt-2">[PLACEHOLDER — process and limitations]</p>
      </section>

      <section className="border-hairline mt-12 border-t pt-8" aria-labelledby="qa-heading">
        <h2 id="qa-heading" className="text-xl">
          Questions
        </h2>
        <p className="text-muted mt-2">[PLACEHOLDER — short Q&amp;A block]</p>
      </section>
    </div>
  );
}
