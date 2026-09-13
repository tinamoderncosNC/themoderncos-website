const steps = [
  {
    number: "01",
    text: "Buy and open the tool in your browser. Nothing to install, nothing to log into.",
  },
  {
    number: "02",
    text: "Fill in your business info once in the setup block, then reuse it every time you open the tool.",
  },
  {
    number: "03",
    text: "Fill out the form, copy the assembled prompt, and paste it into whatever AI tool you already use.",
  },
];

// Continues directly from ToolsSection with no visual break (same
// bg-offwhite, no border/rule between them) since the brief frames this as
// part of the same buying decision, not a new topic.
export function HowItWorksSection() {
  return (
    <section className="bg-offwhite" aria-labelledby="how-it-works-heading">
      <div className="mx-auto max-w-5xl px-6 pb-20">
        <h2 id="how-it-works-heading" className="text-center text-3xl">
          No install, no login, three steps
        </h2>

        <ol className="mt-14 grid list-none gap-10 lg:grid-cols-3">
          {steps.map((step) => (
            <li key={step.number}>
              <p className="text-coral font-heading text-2xl font-bold">{step.number}</p>
              <p className="text-muted mt-2">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
