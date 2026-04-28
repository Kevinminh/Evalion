"use client";

import { useEffect, type RefObject } from "react";

/**
 * Watches `ref` and writes `--s = clientWidth / intrinsicWidth` so child
 * elements can `transform: scale(var(--s))`. Replaces fixed-pixel
 * `transform: scale(0.798)` patterns from the original mockup.
 */
export function useFluidScale(
  ref: RefObject<HTMLElement | null>,
  intrinsicWidth: number,
): void {
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    function update(): void {
      if (!node) return;
      const w = node.clientWidth;
      if (w > 0) {
        node.style.setProperty("--s", String(w / intrinsicWidth));
      }
    }
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, intrinsicWidth]);
}
