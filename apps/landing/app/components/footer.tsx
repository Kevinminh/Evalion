import Link from "next/link";

import { CONTACT_EMAIL } from "../lib/constants";
import { EmailSignupForm } from "./email-signup-form";
import { RevealOnScroll } from "./reveal-on-scroll";

export function Footer() {
  return (
    <>
      <section id="signup" className="bg-[var(--color-section-dark)] px-4 py-16 sm:px-6 sm:py-20">
        <RevealOnScroll className="mx-auto max-w-[820px]">
          <div className="relative overflow-hidden rounded-[24px] border border-[var(--color-cl-border)] bg-white p-6 shadow-xl sm:p-10 md:p-12">
            <img
              src="/assets/Professoren (med skygge).png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -right-4 -bottom-6 hidden h-[180px] w-auto opacity-90 md:block"
            />
            <div className="relative max-w-[480px]">
              <h2 className="font-display text-[clamp(24px,2.6vw,32px)] leading-tight">
                Få beskjed når vi lanserer
              </h2>
              <p className="mt-3 text-sm text-[var(--color-ink-secondary)]">
                Legg igjen e-posten din, så hører du fra oss!
              </p>
              <div className="mt-6">
                <EmailSignupForm source="landing-footer" />
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </section>
      <footer className="bg-[var(--color-section-dark)] text-white/80">
        <div className="mx-auto flex max-w-[1180px] flex-col items-center gap-3 px-4 py-10 text-center sm:px-6 sm:py-12">
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
    </>
  );
}
