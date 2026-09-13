type PendingCtaButtonProps = {
  label: string;
  note: string;
  noteId: string;
  tone: "coral" | "navy";
};

// The Ops Leak Scorecard and CoS Sprint pages don't exist yet (see
// DECISIONS.md, "Homepage content — Increment ..."). Rendered as a real,
// full-strength button (not grayed out) so the page reads as finished, but
// genuinely disabled with an honest caption rather than faking a working
// link — same principle as the Increment 3b product-page CTA, in plainer
// customer-facing language since this page's copy is final, not a WIP note.
// Moved out of components/home in Increment 3e (Services page) once a second
// page needed the same pattern for the same not-yet-shipped Scorecard.
export function PendingCtaButton({ label, note, noteId, tone }: PendingCtaButtonProps) {
  const buttonClasses = tone === "coral" ? "bg-coral text-navy" : "bg-navy text-offwhite";
  const noteClasses = tone === "coral" ? "text-offwhite/80" : "text-muted";

  return (
    <div>
      <button
        type="button"
        disabled
        aria-describedby={noteId}
        className={`rounded px-6 py-3 font-medium disabled:cursor-not-allowed ${buttonClasses}`}
      >
        {label}
      </button>
      <p id={noteId} className={`mt-2 text-sm ${noteClasses}`}>
        {note}
      </p>
    </div>
  );
}
