import { QRCodeSVG } from "qrcode.react";

interface JoinCardProps {
  joinCode: string;
  joinUrl: string;
  joinHost: string;
}

export function JoinCard({ joinCode, joinUrl, joinHost }: JoinCardProps) {
  return (
    <div className="w-full p-4 lg:w-[38%] lg:min-w-[360px] lg:max-w-[480px]">
      <div className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl border-[1.5px] border-border bg-card p-6 shadow-lg sm:p-8">
        <img src="/co-lab-logo.png" alt="CO-LAB" className="mb-2 h-16 object-contain" />
        <p className="text-base tracking-wide text-muted-foreground">{joinHost}/delta</p>
        <p className="text-base font-semibold text-muted-foreground">
          Skriv inn koden for å bli med:
        </p>
        <div className="rounded-xl border-[2.5px] border-primary/30 bg-primary/5 px-10 py-5">
          <span className="font-mono text-4xl font-bold tracking-[0.25em] text-primary">
            {joinCode}
          </span>
        </div>
        <p className="text-base text-muted-foreground">Eller skann</p>
        <div className="rounded-xl bg-white p-3">
          <QRCodeSVG value={joinUrl} size={130} />
        </div>
      </div>
    </div>
  );
}
