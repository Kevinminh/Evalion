"use client";

import { useEffect, useRef, useState } from "react";

const TEXT = "Gi alle elever en stemme";
const CHAR_DELAY = 50;
const START_DELAY = 600;

export function TypewriterHeadline() {
  const [typed, setTyped] = useState("");
  const ref = useRef<HTMLHeadingElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    function start() {
      if (startedRef.current) return;
      startedRef.current = true;
      let i = 0;
      const tick = () => {
        i += 1;
        setTyped(TEXT.slice(0, i));
        if (i < TEXT.length) {
          setTimeout(tick, CHAR_DELAY);
        }
      };
      setTimeout(tick, START_DELAY);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            start();
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <h1
      ref={ref}
      className="font-display whitespace-nowrap text-[clamp(32px,4vw,52px)] leading-[1.15] text-[var(--color-ink)]"
      aria-label={TEXT}
    >
      <span>{typed}</span>
      <span
        aria-hidden="true"
        className="cl-cursor ml-[2px] inline-block h-[0.82em] w-[2.5px] translate-y-[2px] bg-[var(--color-ink)]"
      />
    </h1>
  );
}
