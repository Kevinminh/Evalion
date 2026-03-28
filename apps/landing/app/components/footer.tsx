import Link from "next/link";

import { CONTACT_EMAIL } from "../lib/constants";

export function Footer() {
  return (
    <footer className="relative mt-20">
      {/* Wave SVG */}
      <div className="relative -mb-1">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          preserveAspectRatio="none"
        >
          <path d="M0 60C240 120 480 0 720 60C960 120 1200 0 1440 60V120H0V60Z" fill="#2196F3" />
          <path d="M0 80C240 40 480 120 720 80C960 40 1200 120 1440 80V120H0V80Z" fill="#1E88E5" />
          <path d="M0 95C240 75 480 115 720 95C960 75 1200 115 1440 95V120H0V95Z" fill="#1976D2" />
        </svg>
      </div>

      {/* Footer Content */}
      <div className="bg-[#1976D2] px-6 pb-8 pt-12 text-white">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-extrabold">Produkt</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link href="/priser" className="hover:text-white">
                  Oppgrader
                </Link>
              </li>
              <li>
                <Link href="/priser" className="hover:text-white">
                  Gruppeplaner
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-extrabold">Kontakt</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link href="/hjelpesenter" className="hover:text-white">
                  Hjelpesenter
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-white">
                  {CONTACT_EMAIL}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-extrabold">Mer</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link href="/personvern" className="hover:text-white">
                  Personvern
                </Link>
              </li>
              <li>
                <Link href="/vilkar" className="hover:text-white">
                  Vilkår
                </Link>
              </li>
              <li>
                <Link href="/informasjonskapsler" className="hover:text-white">
                  Informasjonskapsler
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-extrabold">Følg oss</h3>
            <div className="flex gap-4 text-white/80">
              <a href="#" className="hover:text-white" aria-label="Facebook">
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="#" className="hover:text-white" aria-label="Instagram">
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a href="#" className="hover:text-white" aria-label="YouTube">
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-5xl border-t border-white/20 pt-6 text-center text-sm text-white/60">
          Copyright © {new Date().getFullYear()} Evalion. Alle rettigheter reservert.
        </div>
      </div>
    </footer>
  );
}
