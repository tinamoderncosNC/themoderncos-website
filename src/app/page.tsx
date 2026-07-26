import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <p className="text-navy text-xs font-semibold tracking-widest uppercase">Modern CoS</p>
      <h1 className="mt-4 text-4xl">[PLACEHOLDER — homepage content pending real copy]</h1>
      <p className="text-muted mt-4">
        Modern CoS sells individual proprietary prompt products, starting with Found by AI. Real
        homepage copy and the product catalog land once Supabase is connected.
      </p>
    </div>
  );
}
