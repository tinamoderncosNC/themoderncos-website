"use client";

import { useId, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Tone = "amber" | "sage" | "coral";
type Status = "closed" | "open" | "submitting" | "success" | "error";

type WaitlistCtaProps = {
  tierName: string;
  tierPrice: string;
  tone: Tone;
};

const toneButtonClasses: Record<Tone, string> = {
  amber: "bg-amber text-navy",
  sage: "bg-sage text-navy",
  coral: "bg-coral text-navy",
};

const ctaBase =
  "inline-block rounded px-6 py-3 font-medium focus-visible:outline-coral focus-visible:outline-2 focus-visible:outline-offset-2";

// Same basic pattern enforced server-side by the waitlist_signups CHECK
// constraint — this is a UX nicety (catch obvious typos before a round
// trip), not the real validation boundary. The database constraint is.
const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// No checkout exists yet (see DECISIONS.md), so Cards 2-4 collect interest
// instead of payment. Card 1 (the free Scorecard) is untouched — it keeps
// its own PendingCtaButton, tied to the separate Scorecard popup work.
export function WaitlistCta({ tierName, tierPrice, tone }: WaitlistCtaProps) {
  const [status, setStatus] = useState<Status>("closed");
  const [email, setEmail] = useState("");
  const emailId = useId();
  const statusId = useId();

  if (status === "success") {
    return (
      <p id={statusId} role="status" aria-live="polite" className="text-muted text-sm">
        You&apos;re on the list. We&apos;ll email you the moment this is live.
      </p>
    );
  }

  if (status === "closed") {
    return (
      <button
        type="button"
        onClick={() => setStatus("open")}
        className={`${ctaBase} ${toneButtonClasses[tone]}`}
      >
        Join the Waitlist
      </button>
    );
  }

  const submitting = status === "submitting";

  return (
    <form
      className="space-y-2"
      onSubmit={async (event) => {
        event.preventDefault();

        if (!EMAIL_PATTERN.test(email)) {
          setStatus("error");
          return;
        }

        setStatus("submitting");

        const supabase = createClient();
        const { error } = await supabase
          .from("waitlist_signups")
          .insert({ email, tier_name: tierName, tier_price: tierPrice });

        if (error) {
          // 23505 = unique_violation on (email, tier_name): this visitor
          // already joined this tier's waitlist. Treat it as success rather
          // than surfacing a confusing "error" for something that isn't one
          // from their perspective.
          if (error.code === "23505") {
            setStatus("success");
            return;
          }

          console.error("waitlist_signups insert failed", error);
          setStatus("error");
          return;
        }

        setStatus("success");
      }}
    >
      <label htmlFor={emailId} className="sr-only">
        Email
      </label>
      <input
        id={emailId}
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder="you@yourbusiness.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        disabled={submitting}
        aria-describedby={status === "error" ? statusId : undefined}
        className="border-hairline text-navy focus-visible:outline-coral block w-full rounded border bg-white px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2"
      />
      <button
        type="submit"
        disabled={submitting}
        className={`${ctaBase} w-full disabled:cursor-not-allowed disabled:opacity-50 ${toneButtonClasses[tone]}`}
      >
        {submitting ? "Joining…" : "Join the Waitlist"}
      </button>
      <p id={statusId} role="status" aria-live="polite" className="text-muted text-sm">
        {status === "error" && "Something went wrong. Please check your email and try again."}
      </p>
    </form>
  );
}
