import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { SkipLink } from "@/components/skip-link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const description =
  "Modern CoS sells individual proprietary prompt products, starting with Found by AI.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Modern CoS",
    template: "%s | Modern CoS",
  },
  // PLACEHOLDER — replace with real marketing copy once supplied.
  description,
  openGraph: {
    type: "website",
    siteName: "Modern CoS",
    title: "Modern CoS",
    description,
    images: [{ url: "/brand/modern-cos-logo.png", width: 1254, height: 1254, alt: "Modern CoS" }],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Modern CoS, LLC",
  url: siteUrl,
  logo: `${siteUrl}/brand/modern-cos-logo.png`,
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Modern CoS",
  url: siteUrl,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {/* Gutter frame: no background of its own, so body's background
            image (globals.css) shows through as a border around the page.
            Purely additive spacing — every section/header/footer inside is
            untouched. Drops to 0 margin on mobile per the brief. */}
        <div className="flex flex-1 flex-col sm:mx-6 sm:my-6 lg:mx-10 lg:my-10">
          <SkipLink />
          <SiteHeader />
          {/* bg-offwhite here, not on the image itself: several pages
              (contact, products, how-it-works, and any placeholder page)
              render text on a bare div with no section background of its
              own, and/or are shorter than the viewport. Without this, the
              floral background shows directly behind live body copy on
              those pages, which is unreadable wherever the image's darker
              regions land — confirmed by screenshot before adding this. */}
          <main id="main-content" className="bg-offwhite flex-1">
            {children}
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
