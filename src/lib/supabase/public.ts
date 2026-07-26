import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Plain client for public, unauthenticated reads only (catalog listing,
// generateStaticParams, sitemap). No cookies — safe to use in build-time and
// static/ISR contexts where no HTTP request exists yet, unlike the
// cookie-aware client in server.ts. RLS still applies; this has no more
// access than any anonymous visitor.
export function createPublicClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
