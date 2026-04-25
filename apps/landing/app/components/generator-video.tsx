"use client";

import { useRef, useState } from "react";

export function GeneratorVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  function handlePlay() {
    const v = videoRef.current;
    if (!v) return;
    setPlaying(true);
    void v.play();
  }

  return (
    <div
      className={`group/video relative flex w-full flex-1 items-center justify-center rounded-[24px] bg-[#2A2722] shadow-[0_18px_50px_rgba(0,0,0,0.18)] aspect-video lg:aspect-auto lg:min-h-[340px] ${playing ? "is-playing" : ""}`}
    >
      <video
        ref={videoRef}
        src="/assets/Påstandsgenerator.mp4"
        controls={playing}
        playsInline
        preload="metadata"
        aria-label="Demonstrasjon av påstandsgeneratoren"
        className="absolute inset-0 z-[1] h-full w-full rounded-[inherit] bg-black object-cover"
      />
      {!playing && (
        <>
          <button
            type="button"
            onClick={handlePlay}
            aria-label="Spill av demonstrasjonsvideo"
            className="absolute inset-0 z-[3] grid cursor-pointer place-items-center rounded-[inherit] border-0 bg-[rgba(28,24,16,0.22)] p-6 backdrop-blur-[4px] backdrop-saturate-[1.05] transition focus-visible:outline-3 focus-visible:-outline-offset-6 focus-visible:outline-white/70"
          >
            <span className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full bg-white/95 text-[#1C1810] shadow-[0_14px_40px_rgba(0,0,0,0.35)] transition group-hover/video:scale-[1.06] group-hover/video:bg-white">
              <svg viewBox="0 0 24 24" fill="currentColor" className="ml-[5px] h-10 w-10">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
          <span className="pointer-events-none absolute top-[22px] left-1/2 z-[4] max-w-[calc(100%-48px)] -translate-x-1/2 text-center text-[15px] leading-[1.4] font-semibold tracking-[0.01em] text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]">
            Se hvordan Reddi hjelper deg å lage påstander
          </span>
          <img
            src="/assets/Reddi med skygge.png"
            alt=""
            aria-hidden="true"
            className="cl-reddi-float pointer-events-none absolute right-[-20px] bottom-[-20px] z-[5] h-auto w-[38%] max-w-[220px]"
          />
        </>
      )}
    </div>
  );
}
