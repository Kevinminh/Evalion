"use client";

import { useEffect, useRef } from "react";
import { LOBBY_LAPTOP, TV_FRAME_SRC } from "./constants";
import { hideLaptopNav } from "./inject-styles";
import { useFluidScale } from "./use-fluid-scale";
import type { IframeBuffer } from "./use-iframe-buffer";

type DeviceTVProps = {
  buffer: IframeBuffer;
  showRestart: boolean;
  onRestart: () => void;
};

export function DeviceTV({ buffer, showRestart, onRestart }: DeviceTVProps) {
  const screenRef = useRef<HTMLDivElement | null>(null);
  useFluidScale(screenRef, 1280);

  // Re-inject hideLaptopNav whenever either iframe finishes loading. Matches
  // the original behavior where load handlers are re-armed on each swap.
  useEffect(() => {
    const a = buffer.refA.current;
    const b = buffer.refB.current;
    function handle(this: HTMLIFrameElement) {
      hideLaptopNav(this.contentDocument);
    }
    a?.addEventListener("load", handle);
    b?.addEventListener("load", handle);
    return () => {
      a?.removeEventListener("load", handle);
      b?.removeEventListener("load", handle);
    };
  }, [buffer.refA, buffer.refB]);

  return (
    <div className="fagprat-tv">
      <div className="fagprat-tv-wrap">
        <img
          src={TV_FRAME_SRC}
          alt=""
          className="fagprat-tv-bezel"
          aria-hidden="true"
        />
        <div ref={screenRef} className="fagprat-tv-screen">
          <iframe
            ref={buffer.refA}
            className="fagprat-iframe-scaled fagprat-tv-iframe front"
            src={LOBBY_LAPTOP}
            title="Lærervisning"
          />
          <iframe
            ref={buffer.refB}
            className="fagprat-iframe-scaled fagprat-tv-iframe back"
            src={LOBBY_LAPTOP}
            title=""
            aria-hidden="true"
          />
          {showRestart ? (
            <button
              type="button"
              className="fagprat-tv-restart"
              onClick={onRestart}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
              Start på nytt
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
