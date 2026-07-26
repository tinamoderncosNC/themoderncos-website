import type { MetadataRoute } from "next";
import { createPublicClient } from "@/lib/supabase/public";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["/", "/how-it-works", "/services", "/about", "/contact", "/products"];

  const staticEntries = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));

  let productEntries: MetadataRoute.Sitemap = [];
  try {
    const supabase = createPublicClient();
    const { data: products } = await supabase
      .from("products")
      .select("slug, updated_at")
      .eq("status", "active");

    productEntries = (products ?? []).map((product) => ({
      url: `${siteUrl}/products/${product.slug}`,
      lastModified: new Date(product.updated_at),
    }));
  } catch (error) {
    // Don't fail sitemap generation over a transient DB issue — ship the
    // static routes rather than a 500.
    console.error("sitemap: failed to list product slugs", error);
  }

  return [...staticEntries, ...productEntries];
}
