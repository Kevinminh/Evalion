"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { FagpratDemo } from "@/components/fagprat-demo/fagprat-demo";

export function FagpratDemoPage() {
  return (
    <div className="bg-cl-light flex min-h-svh flex-col">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-4 py-3 md:px-6 md:py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-bold text-[#2a1810] transition-colors hover:bg-black/5"
            aria-label="Tilbake til forsiden"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
            Tilbake
          </Link>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-[#1A1A1A] px-3 py-1 text-xs font-extrabold tracking-wide text-white md:text-sm">
              DEMO
            </span>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col py-4 md:py-8">
        <FagpratDemo layout="standalone" />
      </main>
    </div>
  );
}
