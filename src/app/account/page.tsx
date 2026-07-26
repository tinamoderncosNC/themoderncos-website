import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOutAction } from "./actions";

export const metadata: Metadata = {
  title: "Account",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <p className="text-navy text-xs font-semibold tracking-widest uppercase">Account</p>
      <h1 className="mt-4 text-4xl">Account</h1>
      <p className="text-muted mt-4">Signed in as {user.email}</p>

      <form action={signOutAction} className="mt-8">
        <button
          type="submit"
          className="border-hairline text-navy focus-visible:outline-coral rounded border px-5 py-2 font-medium focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}
