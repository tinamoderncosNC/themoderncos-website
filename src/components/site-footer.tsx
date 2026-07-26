import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-hairline bg-offwhite border-t">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Link href="/" aria-label="Modern CoS — home" className="inline-block">
          <Image
            src="/brand/modern-cos-logo.png"
            alt="Modern CoS"
            width={1254}
            height={1254}
            className="h-auto w-40"
          />
        </Link>
        <p className="text-muted mt-6 text-sm">
          &copy; {year} Modern CoS, LLC. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
