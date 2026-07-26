"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Status = { kind: "idle" | "sending" | "sent" | "error"; message?: string };

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  return (
    <form
      className="mt-8 space-y-6"
      onSubmit={async (event) => {
        event.preventDefault();
        setStatus({ kind: "sending" });

        const supabase = createClient();
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) {
          // Generic message to the visitor; details go to the console only —
          // don't confirm/deny whether an address has an account (that's an
          // enumeration risk), and don't leak provider error internals.
          console.error("signInWithOtp failed", error);
          setStatus({ kind: "error", message: "Something went wrong. Please try again." });
          return;
        }

        setStatus({ kind: "sent" });
      }}
    >
      <div>
        <label htmlFor="email" className="text-navy block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={status.kind === "sending" || status.kind === "sent"}
          className="border-hairline text-navy focus-visible:outline-coral mt-1 block w-full rounded border bg-white px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2"
        />
      </div>

      <button
        type="submit"
        disabled={status.kind === "sending" || status.kind === "sent"}
        className="bg-navy text-offwhite focus-visible:outline-coral rounded px-5 py-2 font-medium focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50"
      >
        {status.kind === "sending" ? "Sending…" : "Send magic link"}
      </button>

      <p role="status" aria-live="polite" className="text-muted text-sm">
        {status.kind === "sent" &&
          "Check your email for a link to sign in. It may take a minute to arrive."}
        {status.kind === "error" && status.message}
      </p>
    </form>
  );
}
