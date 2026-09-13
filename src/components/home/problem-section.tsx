export function ProblemSection() {
  return (
    <section id="the-problem" className="bg-offwhite" aria-labelledby="problem-heading">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <h2 id="problem-heading" className="text-3xl">
          You&apos;re the bottleneck, and you know it.
        </h2>
        <p className="text-muted mt-6 text-lg">
          Growing past a few employees means the founder stops being able to hold the whole
          operation in their head. Handoffs get shaky. The same fire gets put out three times.
          Everything routes through you because nothing was ever written down.
        </p>
        <p className="text-muted mt-4 text-lg">
          That&apos;s not a discipline problem. It&apos;s a systems problem, and it&apos;s fixable
          without hiring a full ops team you can&apos;t afford yet.
        </p>
      </div>
    </section>
  );
}
