"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Button } from "@workspace/ui/components/button";

const SECTION_LINKS = [
  { href: "/#om-co-lab", label: "Om CO-LAB" },
  { href: "/#slik-fungerer", label: "Slik fungerer FagPrat" },
  { href: "/#generator", label: "Vår påstandsgenerator" },
  { href: "/teamet", label: "Møt teamet" },
];

type MobileMenuProps = {
  authed: boolean;
};

export function MobileMenu({ authed }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node | null;
      if (!target) return;
      if (panelRef.current?.contains(target)) return;
      if (buttonRef.current?.contains(target)) return;
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Lukk meny" : "Åpne meny"}
        aria-expanded={open}
        aria-controls="mobile-menu-panel"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cl-border bg-white/80 text-ink transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>
      {open && (
        <div
          ref={panelRef}
          id="mobile-menu-panel"
          className="absolute inset-x-0 top-full z-40 border-b border-cl-border bg-white/95 shadow-[0_12px_32px_rgba(0,0,0,0.08)] backdrop-blur-md"
        >
          <nav className="mx-auto flex max-w-[1180px] flex-col gap-1 px-6 py-4">
            {SECTION_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-[15px] font-medium text-ink-secondary transition hover:bg-cl-light hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-cl-border pt-4">
              {/* Hidden temporarily — restore by uncommenting
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-center rounded-full"
                render={<a href={PLAY_URL} onClick={() => setOpen(false)} />}
              >
                <Play className="size-3.5" />
                Bli med i spill
              </Button>
              */}
              {!authed && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-center rounded-full"
                    render={<Link href="/logg-inn" onClick={() => setOpen(false)} />}
                  >
                    Logg inn
                  </Button>
                  <Button
                    size="sm"
                    className="w-full justify-center rounded-full"
                    render={<Link href="/registrer-deg" onClick={() => setOpen(false)} />}
                  >
                    Registrer deg
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
