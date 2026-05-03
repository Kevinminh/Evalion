"use client";

import { ExternalLinkIcon, Maximize2, Minimize2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FagpratDemo } from "@/components/fagprat-demo/fagprat-demo";
import { ReddiTips, type ReddiTipsHandle } from "@/components/fagprat-demo/reddi-tips";

export function DemoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reddiRef = useRef<ReddiTipsHandle>(null);

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
    <section ref={sectionRef} id="demo" className="section-demo">
      <div className="demo-header">
        <div className="section-heading">
          <span className="section-label">Prøv demo</span>
          <h2 className="section-title mt-3">
            Utforsk <em className="accent">FagPrat</em>
          </h2>
        </div>
        <div className="demo-header-controls">
          <ReddiTips
            ref={reddiRef}
            autoShow={{ kind: "intersection", targetRef: sectionRef }}
          />
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Avslutt fullskjerm" : "Fullskjerm"}
            title={isFullscreen ? "Avslutt fullskjerm" : "Fullskjerm"}
            className="demo-fullscreen-btn"
          >
            {isFullscreen ? <Minimize2 /> : <Maximize2 />}
          </button>
        </div>
      </div>
      <div className="demo-embed">
        <FagpratDemo
          onStepChange={(key, info) => reddiRef.current?.handleStepChange(key, info)}
          onLiveStats={(snapshot) => reddiRef.current?.handleLiveStats(snapshot)}
        />
      </div>
      <Link href="/fagprat-demo" className="demo-mobile-launch">
        <span className="demo-mobile-launch-desc">
          Bytt mellom lærervisning, elevvisning og live-statistikk – og se hvordan dialogen utvikler
          seg i sanntid. Best på PC, men fungerer også på mobil og nettbrett.
        </span>
        <span className="demo-mobile-launch-cta">
          Åpne demo
          <ExternalLinkIcon className="size-4" />
        </span>
      </Link>
    </section>
  );
}
