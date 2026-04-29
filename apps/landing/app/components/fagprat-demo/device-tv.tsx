"use client";

import { useEffect, useRef } from "react";
import { LOBBY_LAPTOP, TV_FRAME_SRC } from "./constants";
import { hideLaptopNav } from "./inject-styles";
import { useFluidScale } from "./use-fluid-scale";
import type { IframeBuffer } from "./use-iframe-buffer";

type DeviceTVProps = {
  buffer: IframeBuffer;
};

export function DeviceTV({ buffer }: DeviceTVProps) {
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
        </div>
      </div>
    </div>
  );
}
