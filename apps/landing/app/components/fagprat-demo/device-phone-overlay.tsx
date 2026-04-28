"use client";

import { useEffect, useRef } from "react";
import { PHONE_SRC } from "./constants";
import { cleanPhoneDoc } from "./inject-styles";
import { useFluidScale } from "./use-fluid-scale";

type DevicePhoneOverlayProps = {
  visible: boolean;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
};

export function DevicePhoneOverlay({ visible, iframeRef }: DevicePhoneOverlayProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  // Intrinsic iframe width is 600px (statistikk page is rendered at that
  // viewport in the original).
  useFluidScale(wrapRef, 600);

  useEffect(() => {
    const f = iframeRef.current;
    if (!f) return;
    function handle() {
      const doc = f?.contentDocument ?? null;
      cleanPhoneDoc(doc);
      setTimeout(() => cleanPhoneDoc(doc), 50);
      setTimeout(() => cleanPhoneDoc(doc), 200);
    }
    f.addEventListener("load", handle);
    return () => f.removeEventListener("load", handle);
  }, [iframeRef]);

  return (
    <div
      ref={wrapRef}
      className="fagprat-phone-overlay"
      style={visible ? undefined : { display: "none" }}
    >
      <iframe
        ref={iframeRef}
        className="fagprat-iframe-scaled fagprat-phone-iframe"
        src={PHONE_SRC}
        title="Live-statistikk"
      />
    </div>
  );
}
