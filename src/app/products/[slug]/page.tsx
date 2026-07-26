import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createPublicClient } from "@/lib/supabase/public";

export const revalidate = 3600;

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

async function getProduct(slug: string) {
  const supabase = createPublicClient();
  const { data: product } = await supabase
    .from("products")
    .select("id, slug, name, summary")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  if (!product) return null;

  const { data: version } = await supabase
    .from("product_versions")
    .select("version_label, changelog, created_at")
    .eq("product_id", product.id)
    .eq("is_current", true)
    .maybeSingle();

  return { product, version };
}

export async function generateStaticParams() {
  try {
    const supabase = createPublicClient();
    const { data: products } = await supabase
      .from("products")
      .select("slug")
      .eq("status", "active");

    return (products ?? []).map((p) => ({ slug: p.slug }));
  } catch (error) {
    // Build-time data fetch failed (e.g. transient network issue). Return no
    // params rather than fail the whole build — Next renders each slug
    // on-demand instead (dynamicParams defaults to true).
    console.error("generateStaticParams: failed to list product slugs", error);
    return [];
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getProduct(slug);

  if (!result) {
    return { title: "Product not found" };
  }

  return {
    title: result.product.name,
    description: result.product.summary ?? undefined,
    alternates: { canonical: `/products/${slug}` },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const result = await getProduct(slug);

  if (!result) {
    notFound();
  }

  const { product, version } = result;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.summary ?? undefined,
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c") }}
      />

      <p className="text-navy text-xs font-semibold tracking-widest uppercase">Product</p>
      <h1 className="mt-4 text-4xl">{product.name}</h1>
      {product.summary && <p className="text-muted mt-4">{product.summary}</p>}

      {version && (
        <p className="text-muted mt-2 text-sm">
          Version {version.version_label} · last updated{" "}
          {new Date(version.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      )}

      <div className="mt-8">
        <button
          type="button"
          disabled
          aria-describedby="checkout-pending-note"
          className="bg-navy text-offwhite rounded px-6 py-3 font-medium opacity-50"
        >
          Get Access
        </button>
        <p id="checkout-pending-note" className="text-muted mt-2 text-sm">
          [PLACEHOLDER — checkout isn&apos;t wired up yet; ships in Increment 5]
        </p>
      </div>

      <section
        className="border-hairline mt-12 border-t pt-8"
        aria-labelledby="whats-included-heading"
      >
        <h2 id="whats-included-heading" className="text-xl">
          What&apos;s included
        </h2>
        <p className="text-muted mt-2">[PLACEHOLDER — what&apos;s included, pending real copy]</p>
        {version?.changelog && (
          <p className="text-muted mt-2 text-sm">Changelog: {version.changelog}</p>
        )}
      </section>

      <section className="border-hairline mt-12 border-t pt-8" aria-labelledby="video-heading">
        <h2 id="video-heading" className="text-xl">
          Video preview
        </h2>
        <p className="text-muted mt-2">
          [PLACEHOLDER — video preview pending a video host decision, see DECISIONS.md]
        </p>
      </section>

      <section className="border-hairline mt-12 border-t pt-8" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-xl">
          FAQs
        </h2>
        <p className="text-muted mt-2">[PLACEHOLDER — FAQs pending real copy]</p>
      </section>
    </div>
  );
}
