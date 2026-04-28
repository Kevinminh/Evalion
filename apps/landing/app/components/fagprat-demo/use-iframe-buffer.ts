"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type OnLoadFn = (iframe: HTMLIFrameElement) => void;

export type IframeBuffer = {
  refA: React.RefObject<HTMLIFrameElement | null>;
  refB: React.RefObject<HTMLIFrameElement | null>;
  /** Returns the currently visible iframe (or null before mount). */
  getFront: () => HTMLIFrameElement | null;
  /** Returns the hidden iframe (or null before mount). */
  getBack: () => HTMLIFrameElement | null;
  /** Loads `src` into the back buffer, swaps front/back when ready. */
  load: (src: string, onReady?: OnLoadFn) => void;
};

/**
 * Double-buffer iframe loader. Mirrors the bufferLoad() pattern from the
 * original fagprat-demo.html: a generation counter ensures rapid navigations
 * do not race; the back iframe loads silently then swaps in atomically.
 */
export function useIframeBuffer(opts: {
  initialSrc: string;
  onInitialLoad?: OnLoadFn;
}): IframeBuffer {
  const refA = useRef<HTMLIFrameElement | null>(null);
  const refB = useRef<HTMLIFrameElement | null>(null);
  const frontKey = useRef<"a" | "b">("a");
  const gen = useRef(0);
  const [, force] = useState(0);
  const initialOnLoadRef = useRef(opts.onInitialLoad);
  initialOnLoadRef.current = opts.onInitialLoad;

  const getFront = useCallback(
    (): HTMLIFrameElement | null =>
      frontKey.current === "a" ? refA.current : refB.current,
    [],
  );
  const getBack = useCallback(
    (): HTMLIFrameElement | null =>
      frontKey.current === "a" ? refB.current : refA.current,
    [],
  );

  // Wire initial-load callback once each iframe mounts. The front iframe
  // starts with `initialSrc` set declaratively so first paint is correct.
  useEffect(() => {
    const front = getFront();
    if (!front) return;
    function handler() {
      const cb = initialOnLoadRef.current;
      if (cb && front) cb(front);
    }
    front.addEventListener("load", handler);
    return () => front.removeEventListener("load", handler);
  }, [getFront]);

  const load = useCallback(
    (src: string, onReady?: OnLoadFn): void => {
      const myGen = ++gen.current;
      const back = getBack();
      if (!back) return;
      back.style.visibility = "hidden";
      function handler() {
        if (!back) return;
        back.removeEventListener("load", handler);
        if (myGen !== gen.current) return; // a newer load superseded us
        if (onReady) onReady(back);
        const oldFront = getFront();
        back.style.visibility = "visible";
        back.classList.remove("back");
        back.classList.add("front");
        if (oldFront) {
          oldFront.classList.remove("front");
          oldFront.classList.add("back");
          oldFront.style.visibility = "hidden";
        }
        frontKey.current = frontKey.current === "a" ? "b" : "a";
        // Force a render so consumers reading getFront() in render get fresh refs;
        // not strictly needed since refs are mutable, but keeps things tidy.
        force((n) => n + 1);
      }
      back.addEventListener("load", handler);
      const sep = src.includes("?") ? "&" : "?";
      back.src = `${src}${sep}_v=${Date.now()}`;
    },
    [getBack, getFront],
  );

  return { refA, refB, getFront, getBack, load };
}
