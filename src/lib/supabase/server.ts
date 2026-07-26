import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./types";

// Canonical Supabase client for Server Components / Route Handlers. No user
// session exists yet (Increment 4 adds auth), but this is the pattern that
// increment will reuse, so public catalog reads already go through it rather
// than a second, throwaway client-creation path.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Called from a Server Component with no way to set cookies.
            // Safe to ignore once Increment 4 adds middleware-based session
            // refresh; harmless no-op until then since nothing reads a
            // session cookie yet.
          }
        },
      },
    },
  );
}
