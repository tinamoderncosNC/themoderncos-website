import Link from "next/link";

// The page's one real, functioning CTA (brief: don't add a second one to
// fill space). Real coral fill since this genuinely links to /contact, not a
// pending-feature placeholder like the home page's Scorecard CTAs.
export function AboutFinalCta() {
  return (
    <section className="bg-navy" aria-labelledby="about-final-cta-heading">
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h2 id="about-final-cta-heading" className="text-offwhite text-3xl">
          Want to talk through where your operation is losing time?
        </h2>
        <div className="mt-8 flex justify-center">
          <Link
            href="/contact"
            className="bg-coral text-navy focus-visible:outline-offwhite inline-block rounded px-6 py-3 font-medium focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Talk to Tina
          </Link>
        </div>
      </div>
    </section>
  );
}
