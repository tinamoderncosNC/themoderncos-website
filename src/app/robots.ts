import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Disallow rules for routes already locked in DECISIONS.md's route map, even
// before they're built — defense in depth alongside the per-page noindex
// meta tag each of those routes will carry once it exists.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/account", "/library", "/auth/callback"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
