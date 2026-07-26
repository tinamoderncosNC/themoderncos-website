import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to Modern CoS.",
  alternates: { canonical: "/login" },
};

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/account");
  }

  return (
    <div className="mx-auto max-w-md px-6 py-24">
      <p className="text-navy text-xs font-semibold tracking-widest uppercase">Log In</p>
      <h1 className="mt-4 text-4xl">Log In</h1>
      <p className="text-muted mt-4">
        Enter your email and we&apos;ll send you a link to sign in — no password needed.
      </p>
      <LoginForm />
    </div>
  );
}
