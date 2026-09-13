// Names the specific mechanisms (vault handoff, approval gate, defect
// window) rather than asserting trustworthiness in the abstract, per the
// brief: "concrete beats reassuring." Distinct from About's brand-promise
// section, not a repeat of it.
export function GuardrailsSection() {
  return (
    <section className="bg-navy" aria-labelledby="guardrails-heading">
      <div className="mx-auto max-w-prose px-6 py-20 text-center">
        <h2 id="guardrails-heading" className="text-offwhite text-3xl">
          What&apos;s actually protecting you
        </h2>
        <p className="text-offwhite/80 mt-6 text-lg">
          Access and credentials get handed off through a dedicated vault, not email or shared docs,
          and revocation steps are documented the moment an engagement closes. Nothing that touches
          customers or money goes live without a human checking it first. And every build comes with
          a defect window, so if something doesn&apos;t work the way it was scoped, that&apos;s on
          us to fix, not a new invoice.
        </p>
      </div>
    </section>
  );
}
