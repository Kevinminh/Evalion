"use client";

import { Maximize2, Minimize2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function DemoSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    function sync() {
      setIsFullscreen(document.fullscreenElement === sectionRef.current);
    }
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  function toggleFullscreen() {
    const node = sectionRef.current;
    if (!node) return;
    if (document.fullscreenElement === node) {
      void document.exitFullscreen?.();
    } else {
      void node.requestFullscreen?.();
    }
  }

  return (
    <section
      ref={sectionRef}
      id="demo"
      className="relative bg-[var(--color-section-dark)] py-16 px-6"
    >
      <div className="mx-auto flex max-w-[1180px] flex-col gap-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="section-label !text-white/50">Prøv demo</span>
            <h2 className="font-display mt-2 text-[clamp(26px,3vw,34px)] text-white">
              Utforsk{" "}
              <em className="font-display-italic text-[var(--color-cl-purple)]">FagPrat</em>
            </h2>
          </div>
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Avslutt fullskjerm" : "Fullskjerm"}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 text-white/70 transition hover:border-white/50 hover:text-white"
          >
            {isFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
          </button>
        </div>
        <div className="overflow-hidden rounded-[20px] border border-white/10 shadow-2xl">
          <iframe
            src="/demo/fagprat-demo.html#embedded"
            title="FagPrat demo"
            loading="lazy"
            className="block aspect-[16/9] w-full bg-white"
          />
        </div>
      </div>
    </section>
  );
}
