// Ranges below are checked against actual weekly capacity (5-10 hours) and
// the same per-workflow estimate (18-25 hours) used for the Sprint pricing
// math. Implementation Project is capped at two workflows so its price band
// still holds a fair hourly rate — see DECISIONS.md and the Services
// ladder-section.tsx comment for the corresponding pricing fix. This isn't
// restated as a number here, just reflected in the timeline, per this
// page's own scope note against duplicating Services' pricing.
export function TimelinesSection() {
  return (
    <section className="bg-offwhite" aria-labelledby="timelines-heading">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <h2 id="timelines-heading" className="text-center text-3xl">
          Realistic timelines, not sales timelines
        </h2>
        <p className="text-muted mt-6 text-lg">
          A Guided Diagnostic is a single working session plus a few business days for the written
          brief. A Build Sprint runs two to four weeks once the scope is locked. An Implementation
          Project, covering two connected workflows, runs four to ten weeks. None of that includes
          how long it takes you to decide, that part&apos;s up to you.
        </p>
      </div>
    </section>
  );
}
