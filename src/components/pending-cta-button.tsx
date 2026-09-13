type PendingCtaButtonProps = {
  label: string;
  note: string;
  noteId: string;
  tone: "coral" | "navy" | "amber" | "sage";
  /** Override the default note text color. Needed when a tone's default
   * assumption (coral => on a navy section, else => on a light section) does
   * not hold — e.g. Products page cards, where every tone sits on a white
   * card regardless of fill color. */
  noteClassName?: string;
};

// The Ops Leak Scorecard and CoS Sprint pages don't exist yet (see
// DECISIONS.md, "Homepage content — Increment ..."). Rendered as a real,
// full-strength button (not grayed out) so the page reads as finished, but
// genuinely disabled with an honest caption rather than faking a working
// link — same principle as the Increment 3b product-page CTA, in plainer
// customer-facing language since this page's copy is final, not a WIP note.
// Moved out of components/home in Increment 3e (Services page) once a second
// page needed the same pattern for the same not-yet-shipped Scorecard.
// Extended with amber/sage tones and a noteClassName override in Increment
// 3g (Products page) once real checkout-pending CTAs needed the same
// 4-color system already used for Services' ladder CTAs.
const buttonToneClasses: Record<PendingCtaButtonProps["tone"], string> = {
  navy: "bg-navy text-offwhite",
  coral: "bg-coral text-navy",
  amber: "bg-amber text-navy",
  sage: "bg-sage text-navy",
};

export function PendingCtaButton({
  label,
  note,
  noteId,
  tone,
  noteClassName,
}: PendingCtaButtonProps) {
  const buttonClasses = buttonToneClasses[tone];
  const defaultNoteClasses = tone === "coral" ? "text-offwhite/80" : "text-muted";
  const noteClasses = noteClassName ?? defaultNoteClasses;

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
