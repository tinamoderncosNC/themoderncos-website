// max-w-prose is Tailwind's 65ch column, matching the brief's "narrower text
// column (max ~65ch), this is a statement section, not a content-dense one."
export function HowDifferentSection() {
  return (
    <section className="bg-navy" aria-labelledby="how-different-heading">
      <div className="mx-auto max-w-prose px-6 py-20 text-center">
        <h2 id="how-different-heading" className="text-offwhite text-3xl">
          What you&apos;re actually paying for
        </h2>
        <p className="text-offwhite/80 mt-6 text-lg">
          Every engagement ends with you owning the system, not renting access to it. Documentation
          and training are part of the deliverable, not an upsell. If a system only works while
          we&apos;re involved, we haven&apos;t finished the job.
        </p>
      </div>
    </section>
  );
}
