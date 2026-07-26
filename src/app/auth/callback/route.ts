import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Deliberately does not accept a "next" redirect target from the query
// string — that would be an open-redirect surface for no real benefit here.
// Always lands on /account.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const response = NextResponse.redirect(`${origin}/account`);
      response.headers.set("X-Robots-Tag", "noindex");
      return response;
    }
  }

  const response = NextResponse.redirect(`${origin}/login`);
  response.headers.set("X-Robots-Tag", "noindex");
  return response;
}
