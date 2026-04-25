import Link from "next/link";

import { CONTACT_EMAIL } from "../lib/constants";

export function Footer() {
  return (
    <footer className="bg-[var(--color-section-dark)] text-white/80">
      <div className="mx-auto flex max-w-[1180px] flex-col items-center gap-3 px-6 py-12 text-center">
        <img
          src="/assets/CO-LAB (Hoved) - uten skygge.png"
          alt="CO-LAB"
          className="h-8 w-auto opacity-90"
        />
        <p className="text-sm">Laget av lærere i Norge · CO-LAB AS</p>
        <nav className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
          <Link href="/teamet" className="hover:text-white">
            Teamet
          </Link>
          <Link href="/personvern-og-vilkar" className="hover:text-white">
            Personvern og vilkår
          </Link>
          <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-white">
            {CONTACT_EMAIL}
          </a>
        </nav>
        <p className="mt-2 text-xs text-white/50">
          © {new Date().getFullYear()} CO-LAB AS. Alle rettigheter reservert.
        </p>
      </div>
    </footer>
  );
}
