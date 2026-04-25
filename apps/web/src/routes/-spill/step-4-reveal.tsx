import { FasitBadge } from "@workspace/evalion/components/live/fasit-badge";
import { FASIT_TEXT } from "@workspace/evalion/lib/constants";

import { CountdownOverlay } from "./countdown-overlay";
import { RecordingDisclaimer } from "./recording-disclaimer";
import { StatementCard } from "@workspace/ui/components/statement-card";

interface Step4RevealProps {
  statement: { text: string; fasit: "sant" | "usant" | "delvis" };
  showCountdown: boolean;
  countdownNumber: number;
  countdownDone: boolean;
  transcriptionEnabled?: boolean;
}

export function Step4Reveal({
  statement,
  showCountdown,
  countdownNumber,
  countdownDone,
  transcriptionEnabled,
}: Step4RevealProps) {
  return (
    <>
      <CountdownOverlay visible={showCountdown} number={countdownNumber} />
      <div className="flex w-full flex-col items-center gap-6">
        {countdownDone && <FasitBadge fasit={statement.fasit} animated />}

        <StatementCard statement={statement} />

        {countdownDone && (
          <div className="flex items-center gap-4">
            <div className="size-20 shrink-0 overflow-hidden rounded-full">
              <img
                src="/professoren.png"
                alt="Professoren"
                className="size-full animate-[gentle-bounce_3s_ease-in-out_infinite] object-cover"
              />
            </div>
            <div className="relative">
              <div
                className="absolute top-1/2 -left-2 size-0 -translate-y-1/2 border-8 border-transparent border-r-white"
                style={{ filter: "drop-shadow(-1px 0 0 #e5e7eb)" }}
              />
              <div className="rounded-2xl border border-neutral-200 bg-white px-5 py-4">
                <p className="text-sm font-medium italic text-foreground/80">
                  Forklar til læringspartneren din hvorfor påstanden er{" "}
                  {FASIT_TEXT[statement.fasit]}. Bruk fagbegreper, sammenligninger og eksempler.
                </p>
              </div>
            </div>
          </div>
        )}

        {countdownDone && transcriptionEnabled && <RecordingDisclaimer />}
      </div>
    </>
  );
}
