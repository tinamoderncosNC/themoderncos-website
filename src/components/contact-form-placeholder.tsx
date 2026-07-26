"use client";

import { useState } from "react";

// Display-only per Increment 3's scope: submission handling, validation, and
// contact_inquiries storage are Increment 7. This still needs client
// interactivity (onSubmit) to tell a real visitor what's actually happening,
// rather than silently doing nothing or pretending to send the message.
export function ContactFormPlaceholder() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      className="mt-8 space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <div>
        <label htmlFor="name" className="text-navy block text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          className="border-hairline text-navy focus-visible:outline-coral mt-1 block w-full rounded border bg-white px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2"
        />
      </div>

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
          className="border-hairline text-navy focus-visible:outline-coral mt-1 block w-full rounded border bg-white px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2"
        />
      </div>

      <div>
        <label htmlFor="message" className="text-navy block text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="border-hairline text-navy focus-visible:outline-coral mt-1 block w-full rounded border bg-white px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2"
        />
      </div>

      <button
        type="submit"
        className="bg-navy text-offwhite focus-visible:outline-coral rounded px-5 py-2 font-medium focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        Send message
      </button>

      <p role="status" aria-live="polite" className="text-muted text-sm">
        {submitted
          ? "[PLACEHOLDER — this form isn't wired up yet; submissions ship in Increment 7]"
          : ""}
      </p>
    </form>
  );
}
