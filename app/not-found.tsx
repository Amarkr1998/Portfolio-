import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main id="main-content" tabIndex={-1} className="outline-none">
      <div className="container-x flex min-h-[70dvh] flex-col justify-center pb-20 pt-[calc(var(--header-h)+3rem)]">
        <p className="annot text-accent">404</p>
        <h1 className="display-lg mt-4 max-w-[18ch]">This page isn&rsquo;t part of the portfolio.</h1>
        <p className="lede mt-4">The link may be outdated. The work, experience and contact details are all on the home page.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-primary">
            <ArrowLeft size={16} aria-hidden="true" /> Back to home
          </Link>
          <Link href="/#work" className="btn btn-secondary">
            Selected work
          </Link>
        </div>
      </div>
    </main>
  );
}
