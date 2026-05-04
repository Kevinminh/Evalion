"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  forwardRef,
  type RefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import type { LiveStatsSnapshot } from "@/components/fagprat-demo/fagprat-demo";

export type StepInfo = {
  stegNum: number | "lobby";
  pastandIdx: number;
  inLobby: boolean;
};

export type ReddiTipsHandle = {
  handleStepChange: (key: string, info: StepInfo) => void;
  handleLiveStats: (snapshot: LiveStatsSnapshot) => void;
};

export type ReddiAutoShow =
  | { kind: "intersection"; targetRef: RefObject<HTMLElement | null> }
  | { kind: "mount" }
  | { kind: "none" };

type Props = {
  autoShow: ReddiAutoShow;
  variant?: "default" | "navbar";
};

type Vote = "sant" | "delvis" | "usant";
type Counts = { sant: number; delvis: number; usant: number };

type StatsSlice = {
  counts: Counts;
  avgTotal: number;
};

type ResultatSlice = { avgConf: number };

const FASIT_BY_PASTAND: readonly Vote[] = ["sant", "usant", "usant", "delvis"];

function totalOf(c: Counts): number {
  return c.sant + c.delvis + c.usant;
}

function pctOf(num: number, denom: number): number {
  if (denom <= 0) return 0;
  return Math.round((num / denom) * 100);
}

function fmtAvg(n: number): string {
  return n.toFixed(1).replace(".", ",");
}

function asStats(value: unknown): StatsSlice | null {
  if (!value || typeof value !== "object") return null;
  const v = value as { counts?: unknown; avgTotal?: unknown };
  if (!v.counts || typeof v.counts !== "object") return null;
  const c = v.counts as Record<string, unknown>;
  if (typeof c.sant !== "number" || typeof c.delvis !== "number" || typeof c.usant !== "number") {
    return null;
  }
  if (c.sant + c.delvis + c.usant === 0) return null;
  return {
    counts: { sant: c.sant, delvis: c.delvis, usant: c.usant },
    avgTotal: typeof v.avgTotal === "number" ? v.avgTotal : 0,
  };
}

function asResultat(value: unknown): ResultatSlice | null {
  if (!value || typeof value !== "object") return null;
  const v = value as { avgConf?: unknown };
  if (typeof v.avgConf !== "number") return null;
  return { avgConf: v.avgConf };
}

const FALLBACK_R1: readonly StatsSlice[] = [
  { counts: { sant: 15, delvis: 3, usant: 3 }, avgTotal: 80 / 21 },
  { counts: { sant: 10, delvis: 5, usant: 6 }, avgTotal: 84 / 21 },
  { counts: { sant: 9, delvis: 2, usant: 10 }, avgTotal: 53 / 21 },
  { counts: { sant: 7, delvis: 9, usant: 5 }, avgTotal: 62 / 21 },
];

const FALLBACK_R2: readonly StatsSlice[] = [
  { counts: { sant: 18, delvis: 2, usant: 1 }, avgTotal: 84 / 21 },
  { counts: { sant: 8, delvis: 3, usant: 10 }, avgTotal: 76 / 21 },
  { counts: { sant: 5, delvis: 1, usant: 15 }, avgTotal: 74 / 21 },
  { counts: { sant: 6, delvis: 11, usant: 4 }, avgTotal: 64 / 21 },
];

const FALLBACK_RESULTAT: readonly ResultatSlice[] = [
  { avgConf: 4.2 },
  { avgConf: 3.1 },
  { avgConf: 3.8 },
  { avgConf: 2.7 },
];

const STATIC_MESSAGES: Record<string, string[]> = {
  lobby: [
    "<p>Hei, jeg heter Reddi. Jeg lyser opp når jeg har et godt tips - men du kan utforske helt fritt om du vil det.</p>" +
      "<p>Dette er venterommet. Her dukker elevene opp når de skanner QR-koden eller skriver inn koden på sin digitale enhet.</p>" +
      "<p>Denne FagPraten er i naturfag om <strong>klima og bærekraft</strong>, og er laget som en oppsummering for elever på 10. trinn med gode forkunnskaper. Meld deg på som elev og gjør deg klar til din første FagPrat.</p>",
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
  steg3: [
    "<p>Elevene stemmer på nytt individuelt – og nå uten begrunnelse. Velg tenketid og trykk <strong>Start</strong>.</p>" +
      "<p>Følg med på endringene i live-statistikken samtidig som elevene svarer.</p>",
  ],
  steg4: [
    "<p>Fasiten er avslørt. La elevene forklare hvorfor til hverandre og i plenum.</p>" +
      "<p>Under <strong>Live-statistikk for lærer</strong> og i <strong>lærerpanelet</strong> ser du endringer på klasse- og individnivå, delt i fire kategorier. Se spesielt etter elever som har gått fra feil til riktig svar – eller motsatt.</p>",
  ],
  steg5: [
    "<p><strong>Professoren</strong> gir en presis forklaring. En god elevbegrunnelse blir løftet frem i <strong>lærerpanelet</strong>.</p>",
  ],
  steg6: [
    "<p>Elevene vurderer egen forståelse individuelt.</p>" +
      "<p>Du ser nå både forståelse og stemmefordeling fra begge rundene i <strong>lærerpanelet</strong> og under <strong>Live-statistikk for lærer</strong>.</p>",
  ],
};

function buildSteg2Tip(pastandIdx: number, stats: StatsSlice): string {
  const fasit = FASIT_BY_PASTAND[pastandIdx] ?? "sant";
  const total = totalOf(stats.counts);
  const correct = stats.counts[fasit];
  const wrong = total - correct;
  const cPct = pctOf(correct, total);
  const wPct = pctOf(wrong, total);
  const avg = fmtAvg(stats.avgTotal);

  switch (pastandIdx) {
    case 0:
      return (
        `<p>Statistikken viser at <strong>${correct} av ${total}</strong> elever har riktig svar (${cPct} %), ` +
        `og at gjennomsnittlig sikkerhet er <strong>${avg}</strong>. ` +
        `Her kan det være naturlig å utfordre elevenes begrunnelser og løfte fram elever med gode forklaringer ` +
        `fra kategorien «Riktig svar – Lav sikkerhet».</p>`
      );
    case 1:
      return (
        `<p>Kun <strong>${cPct} %</strong> av elevene har svart riktig, samtidig som sikkerheten er høy (<strong>${avg}</strong>). ` +
        `Dette tyder på en kollektiv misoppfatning. ` +
        `Her bør du løfte fram begrunnelser som utfordrer tanken om at elbiler er helt utslippsfrie.</p>`
      );
    case 2:
      return (
        `<p>Statistikken viser at klassen er delt, med <strong>${correct} av ${total}</strong> elever riktig (${cPct} %) ` +
        `og <strong>${wrong}</strong> elever feil (${wPct} %). Sikkerheten er lav (<strong>${avg}</strong>). ` +
        `Dette tyder på at elevene er usikre. Her kan du la elevene utforske ulike svar før du styrer diskusjonen videre.</p>`
      );
    default:
      return (
        `<p>Statistikken viser en jevn fordeling, med <strong>${correct} av ${total}</strong> elever riktig (${cPct} %) ` +
        `og <strong>${wrong}</strong> elever feil (${wPct} %). Sikkerheten er <strong>${avg}</strong>. ` +
        `Noen elever er også sikre på feil svar. Her bør du være bevisst på hvilke argumenter som løftes fram.</p>`
      );
  }
}

function buildSteg4Tip(pastandIdx: number, r1: StatsSlice, r2: StatsSlice): string {
  const fasit = FASIT_BY_PASTAND[pastandIdx] ?? "sant";
  const r1Total = totalOf(r1.counts);
  const r2Total = totalOf(r2.counts);
  const r1Correct = r1.counts[fasit];
  const r2Correct = r2.counts[fasit];
  const r1Pct = pctOf(r1Correct, r1Total);
  const r2Pct = pctOf(r2Correct, r2Total);
  const r1Avg = fmtAvg(r1.avgTotal);
  const r2Avg = fmtAvg(r2.avgTotal);

  switch (pastandIdx) {
    case 0:
      return (
        `<p>På denne påstanden kan det se ut som at diskusjonen har gitt god effekt. ` +
        `Andelen riktige svar har gått fra <strong>${r1Correct} til ${r2Correct}</strong> elever ` +
        `(${r1Pct} % → ${r2Pct} %), og sikkerheten har gått fra <strong>${r1Avg} til ${r2Avg}</strong>.</p>`
      );
    case 1:
      return (
        `<p>Flere elever har endret til riktig svar (fra <strong>${r1Correct} til ${r2Correct}</strong>, ` +
        `${r1Pct} % → ${r2Pct} %). Samtidig har sikkerheten gått fra <strong>${r1Avg} til ${r2Avg}</strong>. ` +
        `Dette kan tyde på at elevene har blitt mer usikre og begynt å reflektere mer.</p>`
      );
    case 2:
      return (
        `<p>Diskusjonen har gitt god effekt. Antall riktige svar har gått fra ` +
        `<strong>${r1Correct} til ${r2Correct}</strong> elever (${r1Pct} % → ${r2Pct} %), ` +
        `og sikkerheten har gått fra <strong>${r1Avg} til ${r2Avg}</strong>.</p>`
      );
    default:
      return (
        `<p>Her er det verdt å merke seg utviklingen. Antall riktige svar har gått fra ` +
        `<strong>${r1Correct} til ${r2Correct}</strong> elever (${r1Pct} % → ${r2Pct} %), ` +
        `samtidig som sikkerheten har gått fra <strong>${r1Avg} til ${r2Avg}</strong>. ` +
        `Vær bevisst på hvilke argumenter som løftes fram.</p>`
      );
  }
}

function buildSteg6Tip(pastandIdx: number, resultat: ResultatSlice): string {
  const avg = fmtAvg(resultat.avgConf);
  switch (pastandIdx) {
    case 0:
      return (
        `<p>Basert på egenvurderingene (snitt <strong>${avg}</strong>) kan det virke som at elevene ` +
        `forstår denne påstanden godt nå, og at det ikke er nødvendig å bruke mye tid på det etter aktiviteten.</p>`
      );
    case 1:
      return (
        `<p>Forståelsen er noe varierende (snitt <strong>${avg}</strong>). ` +
        `Dette kan være nyttig å følge opp senere.</p>`
      );
    case 2:
      return (
        `<p>Forståelsen er blitt bedre (snitt <strong>${avg}</strong>). Dette er en påstand som er enkel å rydde opp i, ` +
        `og det er ikke nødvendig å bruke mye tid på dette senere.</p>`
      );
    default:
      return (
        `<p>Forståelsen er fortsatt variert (snitt <strong>${avg}</strong>). ` +
        `Dette tyder på at elevene trenger mer tid på temaet.</p>`
      );
  }
}

const PER_PASTAND_STEPS = new Set(["steg2", "steg4", "steg6"]);

function messagesFor(key: string, pastandIdx: number, snapshot: LiveStatsSnapshot): string[] {
  if (key.startsWith("steg1-p")) return STATIC_MESSAGES.steg1 ?? [];

  const base = STATIC_MESSAGES[key];
  if (!base) return [];

  if (!PER_PASTAND_STEPS.has(key)) return base;

  const idx = Math.max(0, Math.min(pastandIdx, FASIT_BY_PASTAND.length - 1));

  if (key === "steg2") {
    const stats = asStats(snapshot.stats) ?? FALLBACK_R1[idx]!;
    return [...base, buildSteg2Tip(idx, stats)];
  }
  if (key === "steg4") {
    const r1 = asStats(snapshot.r1Stats) ?? FALLBACK_R1[idx]!;
    const r2 = asStats(snapshot.stats) ?? FALLBACK_R2[idx]!;
    return [...base, buildSteg4Tip(idx, r1, r2)];
  }
  if (key === "steg6") {
    const resultat = asResultat(snapshot.resultat) ?? FALLBACK_RESULTAT[idx]!;
    return [...base, buildSteg6Tip(idx, resultat)];
  }
  return base;
}

function identityFor(key: string, pastandIdx: number): string {
  if (PER_PASTAND_STEPS.has(key)) return `${key}|p${pastandIdx}`;
  return key;
}

const EMPTY_SNAPSHOT: LiveStatsSnapshot = {
  stats: null,
  r1Stats: null,
  changes: null,
  resultat: null,
};

export const ReddiTips = forwardRef<ReddiTipsHandle, Props>(function ReddiTips(
  { autoShow, variant = "default" },
  ref,
) {
  const avatarRef = useRef<HTMLButtonElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const autoShownRef = useRef(false);
  const currentKeyRef = useRef("lobby");
  const pastandIdxRef = useRef(0);

  const [currentKey, setCurrentKey] = useState("lobby");
  const [pastandIdx, setPastandIdx] = useState(0);
  const [bubbleOpen, setBubbleOpen] = useState(false);
  const [msgIdx, setMsgIdx] = useState(0);
  const [shown, setShown] = useState<Set<string>>(() => new Set());
  const [liveStats, setLiveStats] = useState<LiveStatsSnapshot>(EMPTY_SNAPSHOT);

  useEffect(() => {
    currentKeyRef.current = currentKey;
  }, [currentKey]);

  useEffect(() => {
    pastandIdxRef.current = pastandIdx;
  }, [pastandIdx]);

  const markShown = useCallback((identity: string, idx: number) => {
    setShown((prev) => {
      const k = `${identity}|m${idx}`;
      if (prev.has(k)) return prev;
      const next = new Set(prev);
      next.add(k);
      return next;
    });
  }, []);

  const isFirstIdentityRef = useRef(true);
  useEffect(() => {
    if (isFirstIdentityRef.current) {
      isFirstIdentityRef.current = false;
      return;
    }
    setMsgIdx(0);
    setBubbleOpen(false);
  }, [currentKey, pastandIdx]);

  useImperativeHandle(
    ref,
    () => ({
      handleStepChange(key, info) {
        setCurrentKey(key);
        setPastandIdx(info.pastandIdx);
      },
      handleLiveStats(snapshot) {
        setLiveStats(snapshot);
      },
    }),
    [],
  );

  const triggerOpen = useCallback(() => {
    if (autoShownRef.current) return;
    autoShownRef.current = true;
    setMsgIdx(0);
    markShown(identityFor(currentKeyRef.current, pastandIdxRef.current), 0);
    setBubbleOpen(true);
  }, [markShown]);

  useEffect(() => {
    if (autoShow.kind === "none") return;

    if (autoShow.kind === "mount") {
      const id = setTimeout(triggerOpen, 400);
      return () => clearTimeout(id);
    }

    const node = autoShow.targetRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.25) continue;
          if (autoShownRef.current) return;
          observer.disconnect();
          setTimeout(triggerOpen, 400);
        }
      },
      { threshold: [0.25] },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [autoShow, triggerOpen]);

  const messages = messagesFor(currentKey, pastandIdx, liveStats);
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
    !bubbleOpen && messages.length > 0 && messages.some((_, i) => !shown.has(`${id}|m${i}`));
  const reading = bubbleOpen;
  const bubbleHtml = messages[safeMsgIdx] ?? "";
  const showNav = messages.length > 1;
  const cornerClass = variant === "navbar" ? "reddi-corner reddi-corner--navbar" : "reddi-corner";

  return (
    <div className={cornerClass}>
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
  );
});
