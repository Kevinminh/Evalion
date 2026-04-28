"use client";

import { useEffect, useRef } from "react";
import { LOBBY_ELEV } from "./constants";
import { cleanIpadDoc } from "./inject-styles";
import { useFluidScale } from "./use-fluid-scale";
import type { IframeBuffer } from "./use-iframe-buffer";

type DeviceIpadProps = {
  buffer: IframeBuffer;
  nicknameRef: React.MutableRefObject<string>;
  hidden: boolean;
};

export function DeviceIpad({ buffer, nicknameRef, hidden }: DeviceIpadProps) {
  const holderRef = useRef<HTMLDivElement | null>(null);
  // Intrinsic iframe width is 760px; scale to fit the holder.
  useFluidScale(holderRef, 760);

  useEffect(() => {
    const a = buffer.refA.current;
    const b = buffer.refB.current;
    function handle(this: HTMLIFrameElement) {
      cleanIpadDoc(this.contentDocument, nicknameRef.current);
    }
    a?.addEventListener("load", handle);
    b?.addEventListener("load", handle);
    return () => {
      a?.removeEventListener("load", handle);
      b?.removeEventListener("load", handle);
    };
  }, [buffer.refA, buffer.refB, nicknameRef]);

  return (
    <div
      ref={holderRef}
      className="fagprat-ipad"
      style={hidden ? { display: "none" } : undefined}
    >
      <iframe
        ref={buffer.refA}
        className="fagprat-iframe-scaled fagprat-ipad-iframe front"
        src={LOBBY_ELEV}
        title="Elevvisning"
      />
      <iframe
        ref={buffer.refB}
        className="fagprat-iframe-scaled fagprat-ipad-iframe back"
        src={LOBBY_ELEV}
        title=""
        aria-hidden="true"
      />
    </div>
  );
}
