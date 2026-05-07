import { QRCodeSVG } from "qrcode.react";

interface JoinCardProps {
  joinCode: string;
  joinUrl: string;
  joinHost: string;
}

export function JoinCard({ joinCode, joinUrl, joinHost }: JoinCardProps) {
  return (
    <div className="w-full p-4 lg:w-[38%] lg:min-w-[340px] lg:max-w-[480px]">
      <div className="flex h-full flex-col items-center justify-center gap-4 rounded-2xl bg-card p-6 shadow-lg sm:p-8">
        <img src="/logo.png" alt="Evalion" className="mb-2 h-12 object-contain sm:h-16" />
        <p className="text-sm text-muted-foreground">{joinHost}/delta</p>
        <p className="text-sm font-semibold text-muted-foreground">Skriv inn koden for å bli med:</p>
        <div className="rounded-xl border-2 border-primary/30 bg-primary/5 px-6 py-3 sm:px-8 sm:py-4">
          <span className="font-mono text-2xl font-bold tracking-[0.25em] text-primary sm:text-4xl">
            {joinCode}
          </span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">Eller skann</p>
        <div className="rounded-xl bg-white p-3">
          <QRCodeSVG value={joinUrl} size={130} />
        </div>
      </div>
    </div>
  );
}
