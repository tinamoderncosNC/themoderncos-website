import Link from "next/link";

// max-w-prose is Tailwind's 65ch column, matching the brief's "narrower text
// column (max ~65ch)". The CTA is a plain underlined text link, not a
// button, since the brief calls this "a routing note, not a sales moment" —
// same weight as the Home hero's secondary "See how it works" link, which
// sits on the same navy background.
export function NeedMoreSection() {
  return (
    <section className="bg-navy" aria-labelledby="need-more-heading">
      <div className="mx-auto max-w-prose px-6 py-20 text-center">
        <h2 id="need-more-heading" className="text-offwhite text-3xl">
          If the problem is bigger than content, that&apos;s a different page.
        </h2>
        <p className="text-offwhite/80 mt-6 text-lg">
          These tools solve a specific, contained problem well. If what you&apos;re looking at is a
          workflow that&apos;s broken end to end, or an operation that needs someone accountable for
          it long term, the Services page has that ladder instead.
        </p>
        <div className="mt-8">
          <Link
            href="/services"
            className="text-offwhite focus-visible:outline-coral underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            See the Services Ladder →
          </Link>
        </div>
      </div>
    </section>
  );
}
