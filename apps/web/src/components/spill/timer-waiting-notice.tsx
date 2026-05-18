import { Professor } from "@workspace/features/components/live/professor";

interface TimerWaitingNoticeProps {
  text?: string;
}

export function TimerWaitingNotice({
  text = "Venter på at læreren starter nedtellingen…",
}: TimerWaitingNoticeProps = {}) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-5 rounded-[16px] border border-neutral-200 bg-white px-5 py-10 text-center">
      <Professor size="sm" bordered animate textSize="sm" text={text} />
      <div className="flex items-center gap-1.5">
        <span
          className="size-2 animate-pulse rounded-full bg-muted-foreground/70"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="size-2 animate-pulse rounded-full bg-muted-foreground/70"
          style={{ animationDelay: "200ms" }}
        />
        <span
          className="size-2 animate-pulse rounded-full bg-muted-foreground/70"
          style={{ animationDelay: "400ms" }}
        />
      </div>
    </div>
  );
}
