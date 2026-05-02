"use client";

import { ChevronLeft, ChevronRight, ExternalLinkIcon, Maximize2, Minimize2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { FagpratDemo } from "@/components/fagprat-demo/fagprat-demo";

type StepInfo = {
  stegNum: number | "lobby";
  pastandIdx: number;
  inLobby: boolean;
};

const REDDI_MESSAGES: Record<string, string[]> = {
  lobby: [
    "<p>Hei, jeg er Reddi. Jeg lyser opp når jeg har et godt tips – men du kan utforske helt fritt.</p>" +
      "<p>Dette er venterommet. Her dukker elevene opp når de skanner QR-koden eller skriver inn koden. Meld deg på som elev og gjør deg klar til din første FagPrat.</p>",
  ],
  steg0: [
    "<p>Dette er oversikten over påstandene i denne FagPraten. Påstandene er enten <strong>sant</strong>, <strong>delvis sant</strong> eller <strong>usant</strong>. Læreren velger en og en påstand som klassen skal diskutere.</p>",
  ],
  steg1: [
    "<p>Elevene tenker individuelt. Velg tenketid i <strong>lærerpanelet</strong> og trykk <strong>Start</strong> for å åpne stemmerunden.</p>" +
      "<p>Elevene må ta standpunkt og angi sikkerhet for å bli registrert. Begrunnelse er valgfritt. Følg med på svarene live under <strong>Live-statistikk for lærer</strong>.</p>" +
      "<p>Trykk på stegene nederst i lærervisningen for å gå videre.</p>",
  ],
  steg2: [
    "<p>Nå diskuterer elevene med hverandre. Samtidig kan du analysere live-statistikken og gjøre deg klar til klassediskusjon.</p>" +
      "<p>Se gjennom elevbegrunnelser, stemmefordeling og gjennomsnittlig sikkerhet i <strong>lærerpanelet</strong> sammen med elevene om du vil. Du kan også fremheve konkrete elevbidrag under <strong>Live-statistikk for lærer</strong> ved å trykke på dem.</p>",
  ],
  steg2_p0: [
    "<p>Statistikken viser at <strong>15 av 21</strong> elever har riktig svar (71 %), og at gjennomsnittlig sikkerhet er <strong>3,8</strong>. Her kan det være naturlig å utfordre elevenes begrunnelser og løfte fram elever med gode forklaringer fra kategorien «Riktig svar – Lav sikkerhet».</p>",
  ],
  steg2_p1: [
    "<p>Statistikken viser at <strong>15 av 21</strong> elever har feil svar (71 %), samtidig som sikkerheten er høy (<strong>4,0</strong>). Dette tyder på en kollektiv misoppfatning. Her bør du løfte fram begrunnelser som utfordrer tanken om at elbiler er helt utslippsfrie.</p>",
  ],
  steg2_p2: [
    "<p>Statistikken viser at klassen er delt, med <strong>10 av 21</strong> elever riktig (48 %) og <strong>11</strong> elever feil (52 %). Sikkerheten er lav (<strong>2,5</strong>). Dette tyder på at elevene er usikre. Her kan du la elevene utforske ulike svar før du styrer diskusjonen videre.</p>",
  ],
  steg2_p3: [
    "<p>Statistikken viser en jevn fordeling, med <strong>9 av 21</strong> elever riktig (43 %) og <strong>12</strong> elever feil (57 %). Sikkerheten er <strong>3,0</strong>. Noen elever er også sikre på feil svar. Her bør du være bevisst på hvilke argumenter som løftes fram.</p>",
  ],
  steg3: [
    "<p>Elevene stemmer på nytt individuelt – og nå uten begrunnelse. Velg tenketid og trykk <strong>Start</strong>.</p>" +
      "<p>Følg med på endringene i live-statistikken samtidig som elevene svarer.</p>",
  ],
  steg4: [
    "<p>Fasiten er avslørt. La elevene forklare hvorfor til hverandre og i plenum.</p>" +
      "<p>Under <strong>Live-statistikk for lærer</strong> og i <strong>lærerpanelet</strong> ser du endringer på klasse- og individnivå, delt i fire kategorier. Se spesielt etter elever som har gått fra feil til riktig svar – eller motsatt.</p>",
  ],
  steg4_p0: [
    "<p>På denne påstanden kan det se ut som at diskusjonen har gitt god effekt. Andelen riktige svar har økt fra <strong>15 til 18</strong> elever (71 % → 86 %), og sikkerheten har økt fra <strong>3,8 til 4,0</strong>.</p>",
  ],
  steg4_p1: [
    "<p>Flere elever har endret til riktig svar (fra <strong>6 til 10</strong>, 29 % → 48 %). Samtidig har sikkerheten gått fra <strong>4,0 til 3,6</strong>. Dette kan tyde på at elevene har blitt mer usikre og begynt å reflektere mer.</p>",
  ],
  steg4_p2: [
    "<p>Diskusjonen har gitt god effekt. Antall riktige svar har økt fra <strong>10 til 15</strong> elever (48 % → 71 %), og sikkerheten har økt fra <strong>2,5 til 3,5</strong>.</p>",
  ],
  steg4_p3: [
    "<p>Her ser vi en negativ utvikling. Antall riktige svar har gått fra <strong>9 til 7</strong> elever (43 % → 33 %), samtidig som sikkerheten har gått fra <strong>3,0 til 3,3</strong>. Dette tyder på at noen elever har blitt mer sikre på feil svar.</p>",
  ],
  steg5: [
    "<p><strong>Professoren</strong> gir en presis forklaring. En god elevbegrunnelse blir løftet frem i <strong>lærerpanelet</strong>.</p>",
  ],
  steg6: [
    "<p>Elevene vurderer egen forståelse individuelt.</p>" +
      "<p>Du ser nå både forståelse og stemmefordeling fra begge rundene i <strong>lærerpanelet</strong> og under <strong>Live-statistikk for lærer</strong>.</p>",
  ],
  steg6_p0: [
    "<p>Basert på egenvurderingene (snitt <strong>4,2</strong>) kan det virke som at elevene forstår denne påstanden godt nå, og at det ikke er nødvendig å bruke mye tid på det etter aktiviteten.</p>",
  ],
  steg6_p1: [
    "<p>Forståelsen er noe varierende (snitt <strong>3,1</strong>). Dette kan være nyttig å følge opp senere.</p>",
  ],
  steg6_p2: [
    "<p>Forståelsen er blitt bedre (snitt <strong>3,8</strong>). Dette er en påstand som er enkel å rydde opp i, og det er ikke nødvendig å bruke mye tid på dette senere.</p>",
  ],
  steg6_p3: [
    "<p>Forståelsen er fortsatt variert (snitt <strong>2,7</strong>). Dette tyder på at elevene trenger mer tid på temaet.</p>",
  ],
};

const PER_PASTAND_STEPS = new Set(["steg2", "steg4", "steg6"]);

function messagesFor(key: string, pastandIdx: number): string[] {
  if (key.startsWith("steg1-p")) return REDDI_MESSAGES.steg1 ?? [];
  const base = REDDI_MESSAGES[key];
  if (!base) return [];
  if (PER_PASTAND_STEPS.has(key)) {
    const extra = REDDI_MESSAGES[`${key}_p${pastandIdx}`];
    if (extra) return [...base, ...extra];
  }
  return base;
}

function identityFor(key: string, pastandIdx: number): string {
  if (PER_PASTAND_STEPS.has(key)) return `${key}|p${pastandIdx}`;
  return key;
}

export function DemoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const avatarRef = useRef<HTMLButtonElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const autoShownRef = useRef(false);
  const currentKeyRef = useRef("lobby");
  const pastandIdxRef = useRef(0);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentKey, setCurrentKey] = useState("lobby");
  const [pastandIdx, setPastandIdx] = useState(0);
  const [bubbleOpen, setBubbleOpen] = useState(false);
  const [msgIdx, setMsgIdx] = useState(0);
  const [shown, setShown] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    currentKeyRef.current = currentKey;
  }, [currentKey]);

  useEffect(() => {
    pastandIdxRef.current = pastandIdx;
  }, [pastandIdx]);

  useEffect(() => {
    function sync() {
      setIsFullscreen(document.fullscreenElement === sectionRef.current);
    }
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  const handleStepChange = useCallback((key: string, info: StepInfo) => {
    setCurrentKey(key);
    setPastandIdx(info.pastandIdx);
  }, []);

  // Reset carousel + close bubble whenever the active step or påstand changes,
  // so the avatar re-blinks for the new identity.
  const isFirstIdentityRef = useRef(true);
  useEffect(() => {
    if (isFirstIdentityRef.current) {
      isFirstIdentityRef.current = false;
      return;
    }
    setMsgIdx(0);
    setBubbleOpen(false);
  }, [currentKey, pastandIdx]);

  const markShown = useCallback((identity: string, idx: number) => {
    setShown((prev) => {
      const k = `${identity}|m${idx}`;
      if (prev.has(k)) return prev;
      const next = new Set(prev);
      next.add(k);
      return next;
    });
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
            setMsgIdx(0);
            markShown(identityFor(currentKeyRef.current, pastandIdxRef.current), 0);
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

  const messages = messagesFor(currentKey, pastandIdx);
  const id = identityFor(currentKey, pastandIdx);
  const safeMsgIdx = Math.min(msgIdx, Math.max(messages.length - 1, 0));

  function toggleBubble() {
    if (bubbleOpen) {
      setBubbleOpen(false);
      return;
    }
    if (messages.length === 0) return;
    let nextIdx = safeMsgIdx;
    for (let i = 0; i < messages.length; i++) {
      if (!shown.has(`${id}|m${i}`)) {
        nextIdx = i;
        break;
      }
    }
    setMsgIdx(nextIdx);
    markShown(id, nextIdx);
    setBubbleOpen(true);
  }

  function showPrev() {
    const nextIdx = Math.max(0, safeMsgIdx - 1);
    setMsgIdx(nextIdx);
    markShown(id, nextIdx);
  }

  function showNext() {
    const nextIdx = Math.min(messages.length - 1, safeMsgIdx + 1);
    setMsgIdx(nextIdx);
    markShown(id, nextIdx);
  }

  const hasTip =
    !bubbleOpen &&
    messages.length > 0 &&
    messages.some((_, i) => !shown.has(`${id}|m${i}`));
  const reading = bubbleOpen;
  const bubbleHtml = messages[safeMsgIdx] ?? "";
  const showNav = messages.length > 1;

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
              {showNav ? (
                <div className="reddi-bubble-nav">
                  <button
                    type="button"
                    className="reddi-bubble-nav-btn"
                    onClick={showPrev}
                    disabled={safeMsgIdx === 0}
                    aria-label="Forrige tips"
                  >
                    <ChevronLeft />
                  </button>
                  <span className="reddi-bubble-counter">
                    {safeMsgIdx + 1} / {messages.length}
                  </span>
                  <button
                    type="button"
                    className="reddi-bubble-nav-btn"
                    onClick={showNext}
                    disabled={safeMsgIdx === messages.length - 1}
                    aria-label="Neste tips"
                  >
                    <ChevronRight />
                  </button>
                </div>
              ) : null}
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
        <FagpratDemo onStepChange={handleStepChange} />
      </div>
      <Link href="/fagprat-demo" className="demo-mobile-launch">
        <span className="demo-mobile-launch-eyebrow">Interaktiv demo</span>
        <span className="demo-mobile-launch-title">Åpne FagPrat-demoen</span>
        <span className="demo-mobile-launch-desc">
          Bytt mellom lærervisning, elevvisning og live-statistikk for å se hele flyten – fungerer
          også på mobil.
        </span>
        <span className="demo-mobile-launch-cta">
          Åpne demo
          <ExternalLinkIcon className="size-4" />
        </span>
      </Link>
    </section>
  );
}
