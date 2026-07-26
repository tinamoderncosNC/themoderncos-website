import Image from "next/image";
import Link from "next/link";
import { AuthNavLink } from "@/components/auth-nav-link";

const navLinks = [
  { href: "/products", label: "Products" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="border-hairline bg-offwhite border-b">
      {/* Brand Guide v1.0: never recreate the wordmark — use the master file
          directly, never below 150px wide on screen. Clear space should equal
          the height of the "C" in CoS on every side; no cropped mark exists
          to measure that precisely yet, so generous padding stands in until
          one is supplied. */}
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-6 py-6">
        <Link href="/" aria-label="Modern CoS — home" className="inline-block">
          <Image
            src="/brand/modern-cos-logo.png"
            alt="Modern CoS"
            width={1254}
            height={1254}
            priority
            className="h-auto w-40 sm:w-44"
          />
        </Link>
        <nav aria-label="Primary" className="flex flex-wrap gap-x-6 gap-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-navy focus-visible:outline-coral font-medium underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {link.label}
            </Link>
          ))}
          <AuthNavLink />
        </nav>
      </div>
    </header>
  );
}
