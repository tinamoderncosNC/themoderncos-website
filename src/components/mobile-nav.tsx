"use client";

import Link from "next/link";
import { useState } from "react";
import { navLinks } from "@/lib/nav-links";
import { AuthNavLink } from "@/components/auth-nav-link";

// No hamburger/mobile-menu pattern existed anywhere on the site before this
// — needed once the nav bar shrank to a fixed 52px on mobile, since five
// links plus a bordered Log In button can't fit inline at that height
// without one. Panel is `absolute` against the header row's own
// `position: relative`, so `top-full` drops it right below the nav bar with
// no extra plumbing.
//
// Hides at the same custom `min-[800px]:` breakpoint SiteHeader's desktop
// nav group appears at (not `md:`/768px) — they must match exactly, or
// there'd be a width range with neither the hamburger nor the full nav
// visible, or both at once.
export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-[800px]:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
        className="text-navy focus-visible:outline-coral rounded p-2 focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6">
          {open ? (
            <path
              d="M6 6l12 12M18 6L6 18"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : (
            <path
              d="M4 7h16M4 12h16M4 17h16"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>
      </button>

      {open && (
        <div
          id="mobile-nav-panel"
          className="border-hairline bg-offwhite absolute inset-x-0 top-full z-10 border-b px-6 py-6"
        >
          <nav aria-label="Primary" className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-navy focus-visible:outline-coral font-medium underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6">
            <AuthNavLink />
          </div>
        </div>
      )}
    </div>
  );
}
