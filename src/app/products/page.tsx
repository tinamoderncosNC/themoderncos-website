import type { Metadata } from "next";
import Link from "next/link";
import { createPublicClient } from "@/lib/supabase/public";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Products",
  description: "Proprietary prompt products from Modern CoS.",
  alternates: { canonical: "/products" },
};

export default async function ProductsPage() {
  const supabase = createPublicClient();
  const { data: products, error } = await supabase
    .from("products")
    .select("id, slug, name, summary")
    .eq("status", "active")
    .order("name");

  if (error) {
    // RLS already restricts this query to active products; a query error
    // here means something upstream (network/config), not a security event.
    // Fail closed to an empty catalog rather than surface the error detail.
    console.error("Failed to load products", error);
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <p className="text-navy text-xs font-semibold tracking-widest uppercase">Products</p>
      <h1 className="mt-4 text-4xl">Products</h1>

      {products && products.length > 0 ? (
        <ul className="mt-12 space-y-6">
          {products.map((product) => (
            <li key={product.id} className="border-hairline border-t pt-6">
              <Link
                href={`/products/${product.slug}`}
                className="text-navy text-xl font-semibold hover:underline"
              >
                {product.name}
              </Link>
              {product.summary && <p className="text-muted mt-2">{product.summary}</p>}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted mt-12">[PLACEHOLDER — no products published yet]</p>
      )}
    </div>
  );
}
