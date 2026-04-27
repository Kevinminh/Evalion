"use client";

import { Maximize2, Minimize2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const REDDI_MESSAGES: Record<string, string> = {
  lobby:
    "<p>Hei, jeg er Reddi. Jeg lyser opp når jeg har et godt tips – men du kan utforske helt fritt.</p>" +
    "<p>Dette er venterommet. Her dukker elevene opp når de skanner QR-koden eller skriver inn koden. Meld deg på som elev og gjør deg klar til din første FagPrat.</p>",
  steg0:
    "<p>Dette er oversikten over påstandene i denne FagPraten. Påstandene er enten <strong>sant</strong>, <strong>delvis sant</strong> eller <strong>usant</strong>. Læreren velger en og en påstand som klassen skal diskutere.</p>",
  steg1:
    "<p>Elevene tenker individuelt. Velg tenketid i <strong>lærerpanelet</strong> og trykk <strong>Start</strong> for å åpne stemmerunden.</p>" +
    "<p>Elevene må ta standpunkt og angi sikkerhet for å bli registrert. Begrunnelse er valgfritt. Følg med på svarene live under <strong>Live-statistikk for lærer</strong>.</p>" +
    "<p>Trykk på stegene nederst i lærervisningen for å gå videre.</p>",
  steg2:
    "<p>Nå diskuterer elevene med hverandre. Samtidig kan du analysere live-statistikken og gjøre deg klar til klassediskusjon.</p>" +
    "<p>Se gjennom elevbegrunnelser, stemmefordeling og gjennomsnittlig sikkerhet i <strong>lærerpanelet</strong> sammen med elevene om du vil. Du kan også fremheve konkrete elevbidrag under <strong>Live-statistikk for lærer</strong> ved å trykke på dem.</p>",
  steg3:
    "<p>Elevene stemmer på nytt individuelt – og nå uten begrunnelse. Velg tenketid og trykk <strong>Start</strong>.</p>" +
    "<p>Følg med på endringene i live-statistikken samtidig som elevene svarer.</p>",
  steg4:
    "<p>Fasiten er avslørt. La elevene forklare hvorfor til hverandre og i plenum.</p>" +
    "<p>Under <strong>Live-statistikk for lærer</strong> og i <strong>lærerpanelet</strong> ser du endringer på klasse- og individnivå, delt i fire kategorier. Se spesielt etter elever som har gått fra feil til riktig svar – eller motsatt.</p>",
  steg5:
    "<p><strong>Professoren</strong> gir en presis forklaring. En god elevbegrunnelse blir løftet frem i <strong>lærerpanelet</strong>.</p>",
  steg6:
    "<p>Elevene vurderer egen forståelse individuelt.</p>" +
    "<p>Du ser nå både forståelse og stemmefordeling fra begge rundene i <strong>lærerpanelet</strong> og under <strong>Live-statistikk for lærer</strong>.</p>",
};

function messageFor(key: string): string | null {
  if (key.startsWith("steg1-p")) return REDDI_MESSAGES.steg1;
  return REDDI_MESSAGES[key] ?? null;
}

export function DemoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const avatarRef = useRef<HTMLButtonElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const autoShownRef = useRef(false);
  const currentKeyRef = useRef("lobby");

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentKey, setCurrentKey] = useState("lobby");
  const [bubbleOpen, setBubbleOpen] = useState(false);
  const [shown, setShown] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    currentKeyRef.current = currentKey;
  }, [currentKey]);

  useEffect(() => {
    function sync() {
      setIsFullscreen(document.fullscreenElement === sectionRef.current);
    }
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      const data = e.data as { type?: string; key?: string } | null;
      if (!data || data.type !== "fagprat-demo-step" || !data.key) return;
      setCurrentKey(data.key);
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    if (!bubbleOpen) return;
    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node | null;
      if (!target) return;
      if (avatarRef.current?.contains(target)) return;
      if (bubbleRef.current?.contains(target)) return;
      setBubbleOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [bubbleOpen]);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.25) continue;
          if (autoShownRef.current) return;
          autoShownRef.current = true;
          observer.disconnect();
          setTimeout(() => {
            setShown((prev) => {
              if (prev.has(currentKeyRef.current)) return prev;
              const next = new Set(prev);
              next.add(currentKeyRef.current);
              return next;
            });
            setBubbleOpen(true);
          }, 400);
        }
      },
      { threshold: [0.25] },
    );
    observer.observe(node);
    return () => observer.disconnect();
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

  function toggleBubble() {
    if (bubbleOpen) {
      setBubbleOpen(false);
      return;
    }
    if (!messageFor(currentKey)) return;
    setShown((prev) => {
      if (prev.has(currentKey)) return prev;
      const next = new Set(prev);
      next.add(currentKey);
      return next;
    });
    setBubbleOpen(true);
  }

  const hasTip = !bubbleOpen && !shown.has(currentKey) && messageFor(currentKey) !== null;
  const reading = bubbleOpen;
  const bubbleHtml = messageFor(currentKey) ?? "";

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
          <div className="reddi-corner">
            <button
              ref={avatarRef}
              type="button"
              onClick={toggleBubble}
              className={`reddi-avatar-btn${hasTip ? " has-tip" : ""}${reading ? " reading" : ""}`}
              aria-label="Reddi - trykk for tips"
              title="Trykk for tips fra Reddi"
            >
              <img src="/assets/Reddi.png" alt="" className="reddi-avatar-img" />
            </button>
            <div
              ref={bubbleRef}
              className={`reddi-bubble${bubbleOpen ? " visible" : ""}`}
              role="dialog"
              aria-labelledby="reddi-name"
              aria-hidden={!bubbleOpen}
            >
              <div className="reddi-speech-header">
                <span className="reddi-name" id="reddi-name">
                  Reddi
                </span>
                <button
                  type="button"
                  className="reddi-close"
                  onClick={() => setBubbleOpen(false)}
                  aria-label="Lukk"
                >
                  ✕
                </button>
              </div>
              <div
                className="reddi-text"
                // eslint-disable-next-line react/no-danger -- copy is curated, hardcoded above
                dangerouslySetInnerHTML={{ __html: bubbleHtml }}
              />
            </div>
          </div>
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
        <iframe
          src="/demo/fagprat-demo.html#embedded"
          title="FagPrat demo"
          loading="lazy"
          className="demo-embed-frame"
        />
      </div>
      <a
        href="/demo/fagprat-demo.html"
        target="_blank"
        rel="noopener noreferrer"
        className="demo-mobile-launch"
      >
        <span className="demo-mobile-launch-eyebrow">Interaktiv demo</span>
        <span className="demo-mobile-launch-title">Åpne FagPrat-demoen</span>
        <span className="demo-mobile-launch-desc">
          Demoen er bygget for stor skjerm. Trykk for å åpne i ny fane – best opplevelse på nettbrett
          eller PC.
        </span>
        <span className="demo-mobile-launch-cta">
          Åpne demo
          <Maximize2 className="size-4" />
        </span>
      </a>
    </section>
  );
}
