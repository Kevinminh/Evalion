"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  LOBBY_ELEV,
  LOBBY_LAPTOP,
  STEG,
  elevUrl,
  reddiKeyFor,
  tabForSteg,
  type PhoneTab,
} from "./constants";
import { DeviceIpad } from "./device-ipad";
import { DevicePhoneOverlay } from "./device-phone-overlay";
import { DeviceTV } from "./device-tv";
import { hideLaptopNav, cleanIpadDoc } from "./inject-styles";
import { useIframeBuffer } from "./use-iframe-buffer";
import { ViewToggle, type ViewMode } from "./view-toggle";

type Stmt = { text: string; color: string };

type StepInfo = {
  stegNum: number | "lobby";
  pastandIdx: number;
  inLobby: boolean;
};

type FagpratDemoProps = {
  onStepChange?: (key: string, info: StepInfo) => void;
  /**
   * `embedded` (default) renders inside the landing demo section: TV + iPad
   * column with the existing 2-way iPad/Phone toggle. `standalone` renders the
   * full-screen mobile-friendly route variant — below `md` (768 px) only one
   * device is shown at a time, picked via a 3-way toggle (TV / iPad / Phone).
   */
  layout?: "embedded" | "standalone";
};

export function FagpratDemo({
  onStepChange,
  layout = "embedded",
}: FagpratDemoProps) {
  const standalone = layout === "standalone";

  // ── State that affects rendering ──
  const [stegIdx, setStegIdx] = useState(0);
  const [pastandIdx, setPastandIdx] = useState(0);
  const [inLobby, setInLobby] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("ipad");
  const [phoneDisabled, setPhoneDisabled] = useState(true);

  // ── State that doesn't need re-renders (relayed to iframes only) ──
  const selectedStmtRef = useRef<Stmt | null>(null);
  const fasitRef = useRef<string | null>(null);
  const explanationRef = useRef<unknown>(null);
  const r1VoteRef = useRef<unknown>(null);
  const r2VoteRef = useRef<unknown>(null);
  const nicknameRef = useRef<string>("Markus");
  const phoneTabRef = useRef<PhoneTab>("runde1");
  const timerRunningRef = useRef(false);
  const actualLaptopIdxRef = useRef(0);
  const prevLaptopStegRef = useRef(-1);
  const currentReasonsRef = useRef<unknown[] | null>(null);
  const currentStatsRef = useRef<unknown>(null);
  const currentR1StatsRef = useRef<unknown>(null);
  const currentChangesRef = useRef<unknown>(null);
  const currentResultatRef = useRef<unknown>(null);
  const onStepChangeRef = useRef(onStepChange);
  onStepChangeRef.current = onStepChange;

  // ── Iframe buffers ──
  const tv = useIframeBuffer({
    initialSrc: LOBBY_LAPTOP,
    onInitialLoad: (f) => hideLaptopNav(f.contentDocument),
  });
  const ipad = useIframeBuffer({
    initialSrc: LOBBY_ELEV,
    onInitialLoad: (f) => cleanIpadDoc(f.contentDocument, nicknameRef.current),
  });
  const phoneIframeRef = useRef<HTMLIFrameElement | null>(null);

  // ── Helpers for postMessage ──
  const postToBoth = useCallback(
    (buffer: typeof tv, msg: unknown) => {
      try {
        buffer.refA.current?.contentWindow?.postMessage(msg, "*");
      } catch {
        /* no-op */
      }
      try {
        buffer.refB.current?.contentWindow?.postMessage(msg, "*");
      } catch {
        /* no-op */
      }
    },
    [],
  );

  const postToPhone = useCallback((msg: unknown) => {
    try {
      phoneIframeRef.current?.contentWindow?.postMessage(msg, "*");
    } catch {
      /* no-op */
    }
  }, []);

  // ── Initial localStorage seed ──
  useEffect(() => {
    try {
      localStorage.setItem("fagprat-demo-statement", "0");
    } catch {
      /* no-op */
    }
  }, []);

  // ── Render effect: load new iframes on step change ──
  const firstRenderRef = useRef(true);
  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    const s = STEG[stegIdx];
    if (!s) return;

    const wasPrev = prevLaptopStegRef.current;
    prevLaptopStegRef.current = s.num;

    if (
      (wasPrev === 1 || wasPrev === 3) &&
      wasPrev !== s.num &&
      timerRunningRef.current
    ) {
      timerRunningRef.current = false;
      postToPhone({ type: "fagprat-timer", action: "finish" });
    }

    actualLaptopIdxRef.current = stegIdx;

    if (inLobby) {
      tv.load(LOBBY_LAPTOP, (frame) => hideLaptopNav(frame.contentDocument));
      ipad.load(LOBBY_ELEV, (frame) =>
        cleanIpadDoc(frame.contentDocument, nicknameRef.current),
      );
    } else {
      tv.load(s.laptop, (frame) => {
        hideLaptopNav(frame.contentDocument);
        const stmt = selectedStmtRef.current;
        if (stmt) {
          try {
            frame.contentWindow?.postMessage(
              { type: "fagprat-statement", text: stmt.text, color: stmt.color },
              "*",
            );
          } catch {
            /* no-op */
          }
        }
        postToPhone({ type: "fagprat-request-stats" });
        if (currentReasonsRef.current || currentStatsRef.current) {
          try {
            frame.contentWindow?.postMessage(
              {
                type: "fagprat-reasons-update",
                reasons: currentReasonsRef.current ?? [],
                stats: currentStatsRef.current ?? null,
                r1Stats: currentR1StatsRef.current ?? null,
                changes: currentChangesRef.current ?? null,
              },
              "*",
            );
          } catch {
            /* no-op */
          }
        }
        if (currentResultatRef.current) {
          try {
            frame.contentWindow?.postMessage(currentResultatRef.current, "*");
          } catch {
            /* no-op */
          }
        }
        postToPhone({ type: "fagprat-request-resultat" });
      });

      ipad.load(elevUrl(s.elev, selectedStmtRef.current, fasitRef.current), (frame) => {
        cleanIpadDoc(frame.contentDocument, nicknameRef.current);
        if (fasitRef.current) {
          try {
            frame.contentWindow?.postMessage(
              { type: "fagprat-fasit", fasit: fasitRef.current },
              "*",
            );
          } catch {
            /* no-op */
          }
        }
        if (explanationRef.current) {
          try {
            frame.contentWindow?.postMessage(explanationRef.current, "*");
          } catch {
            /* no-op */
          }
        }
      });
    }

    const newTab = tabForSteg(s.num);
    if (newTab !== phoneTabRef.current) {
      phoneTabRef.current = newTab;
      postToPhone({ type: "fagprat-switch-tab", tab: newTab });
    }
    postToPhone({ type: "fagprat-steg-num", num: s.num });

    if (s.num === 0) {
      setPhoneDisabled(true);
      setViewMode("ipad");
    }
  }, [stegIdx, pastandIdx, inLobby, tv, ipad, postToPhone]);

  // ── Step-change reporting (Reddi tips driver) ──
  useEffect(() => {
    const cb = onStepChangeRef.current;
    if (!cb) return;
    const idx = Math.max(stegIdx, actualLaptopIdxRef.current);
    cb(reddiKeyFor(inLobby, stegIdx, pastandIdx, actualLaptopIdxRef.current), {
      stegNum: inLobby ? "lobby" : (STEG[idx]?.num ?? 0),
      pastandIdx,
      inLobby,
    });
  }, [stegIdx, pastandIdx, inLobby]);

  // ── Window message listener ──
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      const data = e.data as { type?: string } & Record<string, unknown>;
      if (!data || typeof data.type !== "string") return;

      switch (data.type) {
        case "fagprat-student-nickname": {
          if (typeof data.nickname === "string") {
            nicknameRef.current = data.nickname;
          }
          postToBoth(tv, data);
          return;
        }
        case "fagprat-statement": {
          if (typeof data.text === "string" && typeof data.color === "string") {
            selectedStmtRef.current = { text: data.text, color: data.color };
          }
          if (typeof data.fasit === "string") fasitRef.current = data.fasit;
          if (typeof data.index === "number") {
            setPastandIdx(data.index);
            try {
              localStorage.setItem("fagprat-demo-statement", String(data.index));
            } catch {
              /* no-op */
            }
          }
          setPhoneDisabled(false);
          try {
            tv.getFront()?.contentWindow?.postMessage(data, "*");
          } catch {
            /* no-op */
          }
          try {
            ipad.getFront()?.contentWindow?.postMessage(data, "*");
          } catch {
            /* no-op */
          }
          postToPhone(data);
          return;
        }
        case "fagprat-reasons-update": {
          if (data.r1Stats !== undefined) currentR1StatsRef.current = data.r1Stats;
          currentReasonsRef.current = (data.reasons as unknown[]) ?? [];
          currentStatsRef.current = data.stats ?? null;
          currentChangesRef.current = data.changes ?? null;
          postToBoth(tv, data);
          return;
        }
        case "fagprat-highlight-reason": {
          postToBoth(tv, data);
          return;
        }
        case "fagprat-unhighlight-reason": {
          postToPhone(data);
          return;
        }
        case "fagprat-resultat-update": {
          currentResultatRef.current = data;
          postToBoth(tv, data);
          return;
        }
        case "fagprat-student-ev": {
          postToBoth(tv, data);
          postToPhone(data);
          return;
        }
        case "fagprat-fasit": {
          if (typeof data.fasit === "string") fasitRef.current = data.fasit;
          postToBoth(ipad, data);
          return;
        }
        case "fagprat-explanation": {
          explanationRef.current = data;
          postToBoth(ipad, data);
          return;
        }
        case "fagprat-student-vote": {
          const explicitRound =
            typeof data.round === "number" ? data.round : 0;
          const stegNum = STEG[stegIdx]?.num ?? 0;
          const round =
            explicitRound ||
            (stegNum <= 1 ? 1 : stegNum === 3 ? 2 : 0);
          if (round === 1) {
            r1VoteRef.current = {
              vote: data.vote,
              conf: data.conf,
              reason: data.reason,
            };
          } else if (round === 2) {
            r2VoteRef.current = {
              vote: data.vote,
              conf: data.conf,
              reason: data.reason,
            };
          }
          if (r1VoteRef.current || r2VoteRef.current) {
            const updated = {
              type: "fagprat-my-votes",
              r1: r1VoteRef.current,
              r2: r2VoteRef.current,
            };
            postToBoth(ipad, updated);
          }
          postToPhone(data);
          postToBoth(tv, data);
          return;
        }
        case "fagprat-request-my-votes": {
          if (r1VoteRef.current || r2VoteRef.current) {
            const voteMsg = {
              type: "fagprat-my-votes",
              r1: r1VoteRef.current,
              r2: r2VoteRef.current,
            };
            try {
              (e.source as Window | null)?.postMessage(voteMsg, "*");
            } catch {
              /* no-op */
            }
            postToBoth(ipad, voteMsg);
          }
          return;
        }
        case "fagprat-timer": {
          if (data.action === "start") timerRunningRef.current = true;
          else if (data.action === "stop" || data.action === "finish")
            timerRunningRef.current = false;
          postToBoth(ipad, data);
          postToPhone(data);
          return;
        }
        case "fagprat-steg-loaded": {
          return;
        }
        case "fagprat-nav": {
          const num = typeof data.steg === "number" ? data.steg : -1;
          if (inLobby && num === 0) {
            setInLobby(false);
            setStegIdx(0);
            setPastandIdx(0);
            return;
          }
          const idx = STEG.findIndex((st) => st.num === num);
          if (idx >= 0) {
            if (
              (prevLaptopStegRef.current === 1 ||
                prevLaptopStegRef.current === 3) &&
              prevLaptopStegRef.current !== num &&
              timerRunningRef.current
            ) {
              timerRunningRef.current = false;
              postToPhone({ type: "fagprat-timer", action: "finish" });
            }
            actualLaptopIdxRef.current = idx;
            prevLaptopStegRef.current = num;

            if (num === 0) {
              r1VoteRef.current = null;
              r2VoteRef.current = null;
              const clearMsg = { type: "fagprat-my-votes", r1: null, r2: null };
              postToBoth(ipad, clearMsg);
              setPhoneDisabled(true);
              setViewMode("ipad");
              // Going back to the påstand picker — clear the forward-only
              // stegIdx ratchet so the iPad and Reddi tips don't stay stuck on
              // the previous påstand's last step. (Don't touch pastandIdx
              // here: this branch also fires when the TV iframe re-announces
              // steg=0 after a reload, and clobbering pastandIdx would undo
              // the user's just-made påstand pick.)
              setStegIdx(0);
            }

            ipad.load(
              elevUrl(STEG[idx]!.elev, selectedStmtRef.current, fasitRef.current),
              (frame) => {
                cleanIpadDoc(frame.contentDocument, nicknameRef.current);
                if (fasitRef.current) {
                  try {
                    frame.contentWindow?.postMessage(
                      { type: "fagprat-fasit", fasit: fasitRef.current },
                      "*",
                    );
                  } catch {
                    /* no-op */
                  }
                }
                if (explanationRef.current) {
                  try {
                    frame.contentWindow?.postMessage(explanationRef.current, "*");
                  } catch {
                    /* no-op */
                  }
                }
              },
            );

            const newTab = tabForSteg(num);
            if (newTab !== phoneTabRef.current) {
              phoneTabRef.current = newTab;
              postToPhone({ type: "fagprat-switch-tab", tab: newTab });
            }
            postToPhone({ type: "fagprat-steg-num", num });

            setStegIdx(idx);

            if (num === 2 || num === 4) {
              setTimeout(() => {
                const front = tv.getFront();
                const stmt = selectedStmtRef.current;
                if (stmt) {
                  try {
                    front?.contentWindow?.postMessage(
                      {
                        type: "fagprat-statement",
                        text: stmt.text,
                        color: stmt.color,
                      },
                      "*",
                    );
                  } catch {
                    /* no-op */
                  }
                }
                postToPhone({ type: "fagprat-request-stats" });
                if (currentStatsRef.current) {
                  try {
                    front?.contentWindow?.postMessage(
                      {
                        type: "fagprat-reasons-update",
                        reasons: currentReasonsRef.current ?? [],
                        stats: currentStatsRef.current,
                        changes: currentChangesRef.current ?? null,
                      },
                      "*",
                    );
                  } catch {
                    /* no-op */
                  }
                }
              }, 200);
            }
          }
          return;
        }
        default:
          return;
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [tv, ipad, postToBoth, postToPhone, stegIdx, inLobby]);

  // ── Stage layout ──
  // In standalone mode, below `md` (768 px) only one device is shown at a time
  // — picked via the 3-way toggle. Visibility is controlled via custom CSS in
  // globals.css (scoped to `.fagprat-demo-root--standalone[data-active-view]`)
  // because the base `.fagprat-tv-col { display:flex }` rule has the same
  // specificity as Tailwind's `.hidden` and beats it via source order.
  return (
    <div
      className={
        "fagprat-demo-root" +
        (standalone ? " fagprat-demo-root--standalone" : "")
      }
      data-layout={layout}
      data-active-view={standalone ? viewMode : undefined}
    >
      {standalone ? (
        <div className="fagprat-standalone-toggle">
          <ViewToggle
            value={viewMode}
            onChange={setViewMode}
            phoneDisabled={phoneDisabled}
            showTv
          />
        </div>
      ) : null}
      <div className="fagprat-stage">
        <div className="fagprat-tv-col">
          <DeviceTV buffer={tv} />
        </div>
        <div className="fagprat-ipad-col">
          <div className="fagprat-2way-toggle mb-3 flex justify-center">
            <ViewToggle
              value={viewMode}
              onChange={setViewMode}
              phoneDisabled={phoneDisabled}
            />
          </div>
          <div
            className={
              "fagprat-ipad-wrap" +
              (standalone && viewMode === "phone"
                ? " fagprat-ipad-wrap--mobile-phone"
                : "")
            }
          >
            <DeviceIpad
              buffer={ipad}
              nicknameRef={nicknameRef}
              hidden={viewMode === "phone"}
            />
            <DevicePhoneOverlay
              visible={viewMode === "phone"}
              iframeRef={phoneIframeRef}
              standalone={standalone}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
