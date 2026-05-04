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

export type LiveStatsSnapshot = {
  stats: unknown | null;
  r1Stats: unknown | null;
  changes: unknown | null;
  resultat: unknown | null;
};

type FagpratDemoProps = {
  onStepChange?: (key: string, info: StepInfo) => void;
  onLiveStats?: (snapshot: LiveStatsSnapshot) => void;
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
  onLiveStats,
  layout = "embedded",
}: FagpratDemoProps) {
  const standalone = layout === "standalone";

  // ── State that affects rendering ──
  const [stegIdx, setStegIdx] = useState(0);
  const [pastandIdx, setPastandIdx] = useState(0);
  const [inLobby, setInLobby] = useState(true);
  // Standalone (mobile-only route) shows one device at a time. Default to the
  // teacher TV view so visitors land on the FagPrat overview, not the empty
  // student lobby.
  const [viewMode, setViewMode] = useState<ViewMode>(standalone ? "tv" : "ipad");
  // Live-statistikk is locked while in the lobby or on the påstand picker
  // (steg 0). As soon as a påstand becomes active (steg 1–6) it unlocks. We
  // derive this rather than tracking it via postMessage so the toggle never
  // gets stuck disabled because a `fagprat-statement` didn't arrive.
  const phoneDisabled = inLobby || (STEG[stegIdx]?.num ?? 0) === 0;

  // ── State that doesn't need re-renders (relayed to iframes only) ──
  const selectedStmtRef = useRef<Stmt | null>(null);
  const fasitRef = useRef<string | null>(null);
  const explanationRef = useRef<unknown>(null);
  const r1VoteRef = useRef<unknown>(null);
  const r2VoteRef = useRef<unknown>(null);
  const nicknameRef = useRef<string>("Markus");
  const phoneTabRef = useRef<PhoneTab>("runde1");
  const timerRunningRef = useRef(false);
  // Whether each voting round was actually opened (timer started) for the
  // current påstand. When the viewer jumps past a round without opening it,
  // we fast-forward the phone iframe so the pre-set 21-student fallback
  // statistics are still visible downstream.
  const r1OpenedRef = useRef(false);
  const r2OpenedRef = useRef(false);
  const actualLaptopIdxRef = useRef(0);
  const prevLaptopStegRef = useRef(-1);
  const currentReasonsRef = useRef<unknown[] | null>(null);
  const currentStatsRef = useRef<unknown>(null);
  const currentR1StatsRef = useRef<unknown>(null);
  const currentChangesRef = useRef<unknown>(null);
  const currentResultatRef = useRef<unknown>(null);
  const onStepChangeRef = useRef(onStepChange);
  onStepChangeRef.current = onStepChange;
  const onLiveStatsRef = useRef(onLiveStats);
  onLiveStatsRef.current = onLiveStats;

  const emitLiveStats = useCallback(() => {
    onLiveStatsRef.current?.({
      stats: currentStatsRef.current ?? null,
      r1Stats: currentR1StatsRef.current ?? null,
      changes: currentChangesRef.current ?? null,
      resultat: currentResultatRef.current ?? null,
    });
  }, []);

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

    if (s.num === 0 && !standalone) {
      setViewMode("ipad");
    }
  }, [stegIdx, pastandIdx, inLobby, tv, ipad, postToPhone, standalone]);

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
          // Drop captured stats so consumers don't render last påstand's numbers
          // for the new one until the iframe rebroadcasts.
          currentReasonsRef.current = null;
          currentStatsRef.current = null;
          currentR1StatsRef.current = null;
          currentChangesRef.current = null;
          currentResultatRef.current = null;
          // New påstand → both voting rounds start unopened again.
          r1OpenedRef.current = false;
          r2OpenedRef.current = false;
          emitLiveStats();
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
          emitLiveStats();
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
          emitLiveStats();
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
          if (data.action === "start") {
            timerRunningRef.current = true;
            // Mark the round opened so we don't fast-forward it later.
            const stegNum = STEG[stegIdx]?.num ?? 0;
            if (stegNum === 1) r1OpenedRef.current = true;
            else if (stegNum === 3) r2OpenedRef.current = true;
          } else if (data.action === "stop" || data.action === "finish")
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

            // Fast-forward any voting rounds the viewer has skipped past
            // without opening (no timer ever started). This populates the
            // phone iframe's pre-set 21-student fallback stats so steg 2/4/5/6
            // and the live-statistikk view aren't blank. R1 must run before
            // R2 so R2's broadcast can reference _r1FinalStats.
            if (num >= 2 && !r1OpenedRef.current) {
              r1OpenedRef.current = true;
              postToPhone({ type: "fagprat-fast-forward", round: 1 });
            }
            if (num >= 4 && !r2OpenedRef.current) {
              r2OpenedRef.current = true;
              postToPhone({ type: "fagprat-fast-forward", round: 2 });
            }

            if (num === 0) {
              r1VoteRef.current = null;
              r2VoteRef.current = null;
              const clearMsg = { type: "fagprat-my-votes", r1: null, r2: null };
              postToBoth(ipad, clearMsg);
              if (!standalone) {
                setViewMode("ipad");
              }
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
  }, [tv, ipad, postToBoth, postToPhone, stegIdx, inLobby, emitLiveStats, standalone]);

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
