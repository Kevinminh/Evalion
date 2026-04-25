"use client";

import { Play } from "lucide-react";
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
    <div className="relative overflow-hidden rounded-[20px] bg-[var(--color-sage-light)] shadow-xl">
      <video
        ref={videoRef}
        src="/assets/Påstandsgenerator.mp4"
        controls={playing}
        playsInline
        preload="metadata"
        aria-label="Demonstrasjon av påstandsgeneratoren"
        className="block aspect-video w-full"
      />
      {!playing && (
        <button
          type="button"
          onClick={handlePlay}
          aria-label="Spill av demonstrasjonsvideo"
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[var(--color-section-dark)]/30 text-white backdrop-blur-[1px] transition hover:bg-[var(--color-section-dark)]/40"
        >
          <span className="flex size-16 items-center justify-center rounded-full bg-white text-[var(--color-cl-purple)] shadow-lg">
            <Play className="size-7 translate-x-0.5 fill-current" />
          </span>
          <span className="font-medium">Se hvordan Reddi hjelper deg å lage påstander</span>
        </button>
      )}
    </div>
  );
}
