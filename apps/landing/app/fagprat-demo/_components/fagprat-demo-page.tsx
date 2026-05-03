"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { FagpratDemo } from "@/components/fagprat-demo/fagprat-demo";
import { ReddiTips, type ReddiTipsHandle } from "@/components/fagprat-demo/reddi-tips";

export function FagpratDemoPage() {
  const reddiRef = useRef<ReddiTipsHandle>(null);

  return (
    <div className="bg-cl-light flex min-h-svh flex-col">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur-md">
        <div className="mx-auto grid w-full max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 py-3 md:px-6 md:py-4">
          <div className="justify-self-start">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-bold text-[#2a1810] transition-colors hover:bg-black/5"
              aria-label="Tilbake til forsiden"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
              Tilbake
            </Link>
          </div>
          <div className="justify-self-center">
            <ReddiTips
              ref={reddiRef}
              autoShow={{ kind: "mount" }}
              variant="navbar"
            />
          </div>
          <div className="justify-self-end">
            <span className="rounded-md bg-[#1A1A1A] px-3 py-1 text-xs font-extrabold tracking-wide text-white md:text-sm">
              DEMO
            </span>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col py-4 md:py-8">
        <FagpratDemo
          layout="standalone"
          onStepChange={(key, info) => reddiRef.current?.handleStepChange(key, info)}
          onLiveStats={(snapshot) => reddiRef.current?.handleLiveStats(snapshot)}
        />
      </main>
    </div>
  );
}
