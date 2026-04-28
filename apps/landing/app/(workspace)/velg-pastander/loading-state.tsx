"use client";

import { useEffect } from "react";

export function LoadingState() {
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <div
      className="mx-auto flex w-full max-w-[480px] flex-col items-center gap-4 rounded-[26px] border-[1.5px] border-purple-200 bg-[#f3eeff] px-10 pt-10 pb-11 text-center shadow-[0_16px_40px_rgba(108,63,197,0.14),0_4px_10px_rgba(0,0,0,0.04)]"
      role="status"
      aria-live="polite"
    >
      <img
        className="size-[106px] animate-workspace-bounce object-contain"
        src="/assets/Reddi.png"
        alt="Reddi"
      />
      <div className="text-xl font-extrabold leading-[1.3] text-ink">
        Reddi lager påstandene
        <span className="inline-block animate-[blink_1.4s_ease-in-out_infinite] opacity-25">
          .
        </span>
        <span className="inline-block animate-[blink_1.4s_ease-in-out_infinite] opacity-25 [animation-delay:0.2s]">
          .
        </span>
        <span className="inline-block animate-[blink_1.4s_ease-in-out_infinite] opacity-25 [animation-delay:0.4s]">
          .
        </span>
      </div>
      <div className="max-w-[360px] text-sm leading-relaxed text-ink-secondary">
        Innholdet er generert av AI og kan inneholde feil.
        <br />
        Husk å bruke faglig skjønn!
      </div>
    </div>
  );
}
