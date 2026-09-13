// Deliberately not a fifth ladder card: no border/button styling to match
// the grid above, narrower column, and a smaller heading size so it doesn't
// compete with Card 4's retainer positioning (brief's explicit instruction).
// No CTA — existing clients reach this through direct conversation with
// Tina, not a site form.
export function OnCallSection() {
  return (
    <section className="bg-offwhite" aria-labelledby="on-call-heading">
      <div className="border-hairline mx-auto max-w-2xl border-t px-6 pt-16 pb-20">
        <h2 id="on-call-heading" className="text-xl">
          Already worked with us? There&apos;s a landing spot if your needs change.
        </h2>
        <p className="text-muted mt-4">
          If you&apos;ve completed a Sprint or Implementation Project, or you&apos;re stepping down
          from a retainer, On-Call Support keeps a working relationship in place without the
          commitment of a full retainer. It&apos;s built for existing clients, not new ones.
        </p>
      </div>
    </section>
  );
}
