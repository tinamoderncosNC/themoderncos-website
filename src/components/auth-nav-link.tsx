"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// Deliberately a small client-side island rather than checking auth in
// SiteHeader itself (a Server Component rendered on every page): reading
// cookies() there would force the entire site — including the static/ISR
// marketing and catalog pages — to render dynamically on every request.
// This way only this link hydrates client-side; everything else stays static.
export function AuthNavLink() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setSignedIn(Boolean(user));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(Boolean(session?.user));
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Link
      href={signedIn ? "/account" : "/login"}
      className="text-navy focus-visible:outline-coral font-medium underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      {signedIn ? "Account" : "Log In"}
    </Link>
  );
}
