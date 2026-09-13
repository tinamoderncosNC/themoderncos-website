import Image from "next/image";
import Link from "next/link";
import { navLinks } from "@/lib/nav-links";
import { AuthNavLink } from "@/components/auth-nav-link";
import { MobileNav } from "@/components/mobile-nav";

// Header follow-up brief, 2026-09-14: supersedes the logo-overlap treatment
// from the original header brief (nav reorder and the bordered Log In
// button stay as before). The square mark needed to break out of the nav
// bar and overlap the content below it — there was no way to fit a tall
// stacked mark into a 64px bar without shrinking it illegibly. The new
// horizontal lockup doesn't have that problem, so it now sits in normal
// flow like an ordinary logo, sized proportionally to the (still fixed)
// nav-bar height. All of the previous absolute-positioning, z-index, and
// three-tier responsive overlap logic is gone — reverted, not layered
// under the new asset.
//
// The row below is still `position: relative`, but now only because
// MobileNav's dropdown panel anchors its `absolute` + `top-full` to it, not
// for the logo.
//
// modern-cos-logo-horizontal.png is a sharp()-trimmed export of the
// as-delivered "Website landscape transparent logo.png": the original file
// is a 2000x2000 square canvas with the actual wordmark sitting in a thin
// horizontal strip in the middle (huge transparent margin above/below), so
// using it directly at a fixed CSS height would render the visible logo far
// smaller than the box — the trimmed file's real content is 1491x510.
// Re-verified 2026-09-15: tested trim thresholds from 1 to 120 against the
// original source and the bounding box barely moves (1491x510 vs 1490x508)
// — this crop is already alpha-tight to the ink, there's no further margin
// to remove. What can look like slack around "THE"/"LLC" is the tagline
// row beneath ("AUTOMATE · OPTIMIZE · GROW") being wider than the title
// text, not empty space in the file. Legibility at nav-bar size is a
// display-height question, not a crop question — sized up accordingly.
export function SiteHeader() {
  return (
    <header className="bg-offwhite border-hairline border-b">
      <div className="relative mx-auto flex h-[52px] max-w-6xl items-center justify-between px-6 md:h-16">
        {/* shrink-0 on the logo: without it, the browser was silently
            compressing its rendered width below its true aspect ratio at
            768-800px (measured 157px vs its natural 169.6px) to make the
            row fit — not a cosmetic issue, it was visibly squeezing the
            wordmark. Confirmed via boundingBox() measurement, then
            confirmed the actual visible symptom by screenshotting 768px:
            nav text ("How It Works") and the Log In button were wrapping
            onto two lines, not just sitting close together. */}
        <Link href="/" aria-label="Modern CoS — home" className="inline-block shrink-0">
          <Image
            src="/brand/modern-cos-logo-horizontal.png"
            alt="Modern CoS"
            width={1491}
            height={510}
            priority
            className="h-[45px] w-auto md:h-[58px]"
          />
        </Link>

        {/* nav + Log In grouped into one flex item, not two separate ones:
            with 3+ independent flex children, `justify-between` splits
            leftover space into N-1 gaps rather than one predictable gap
            next to the logo. `shrink-0`/`whitespace-nowrap` throughout,
            plus gap-4 (was gap-6) and ml-6 (was ml-8), stop this content
            from ever compressing or wrapping instead of just narrowing the
            margin.
            Reveal breakpoint is a custom `min-[800px]:`, not `md:` (768px)
            like the bar height and logo size above: measured the actual
            natural content width needed here (logo 169.6px + this group
            514.4px = 684px) against what's actually available inside the
            row at various widths (row width minus its own px-6 padding
            minus the sitewide gutter margin active in this range) — at
            768px that's only 672px, a 12px deficit that read as the logo
            and "Services" touching with zero gap. 800px gives ~704px
            available, a real ~20px cushion instead of a coincidental one.
            The bar/logo already look "desktop-sized" from 768px; only the
            link row and Log In button wait the extra 32px. */}
        <div className="hidden shrink-0 items-center min-[800px]:flex">
          <nav aria-label="Primary" className="flex items-center gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-navy focus-visible:outline-coral font-medium whitespace-nowrap underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="ml-6 shrink-0">
            <AuthNavLink />
          </div>
        </div>

        <MobileNav />
      </div>
    </header>
  );
}
