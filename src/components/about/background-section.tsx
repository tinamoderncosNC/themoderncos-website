// The brief's own credentials strip used em dashes as a degree/institution
// separator, which conflicts with this build's global "no em dashes" rule —
// swapped for a middle dot rather than silently keeping the dash. Flagged in
// DECISIONS.md.
const credentials = [
  "MBA, Entrepreneurship & Technology Commercialization · NC State University",
  "BA, Marketing · Notre Dame College of Ohio",
  "2022 Goodmon Fellow, Leadership Triangle",
  "Based in Raleigh-Durham, North Carolina",
];

// Plain text, tightly spaced, per the brief — resist turning this into
// decorated icon/badge cards.
export function BackgroundSection() {
  return (
    <section className="bg-navy" aria-labelledby="background-heading">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <h2 id="background-heading" className="text-offwhite text-3xl">
          Where the experience comes from
        </h2>
        <p className="text-offwhite/80 mt-6 text-lg">
          Before founding The Modern CoS, Tina spent 15+ years in go-to-market strategy and
          enablement roles at Cisco, NTT (formerly Dimension Data), and AppLogic Networks. Most
          recently, she was Director of GTM Enablement for NTT&apos;s Global Cloud &amp; Security
          divisions. Earlier in her career, as a Lean Portfolio Manager, she drove pipeline growth
          to 125% of target for a new managed service. At AppLogic Networks, she launched the
          company&apos;s flagship product and built its go-to-market function from scratch.
        </p>

        <ul className="text-offwhite/70 mt-8 list-none space-y-1 text-sm">
          {credentials.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
