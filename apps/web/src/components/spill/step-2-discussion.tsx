import { Professor } from "@workspace/evalion/components/live/professor";
import { RecordingDisclaimer } from "@workspace/ui/components/recording-disclaimer";
import { StatementCard } from "@workspace/ui/components/statement-card";
import { cn } from "@workspace/ui/lib/utils";

import { useStudentGame } from "./student-game-context";

export function Step2Discussion() {
  const { statement, groupMembers, session } = useStudentGame();
  if (!statement) return null;

  return (
    <div className="flex w-full flex-col items-center gap-6">
      {groupMembers.length > 0 && (
        <div className="flex w-full max-w-md flex-col items-center gap-2">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Din gruppe
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {groupMembers.map((m) => (
              <div
                key={m._id}
                className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-xs"
              >
                <div
                  className={cn(
                    "flex size-6 items-center justify-center rounded-full text-xs font-bold text-white",
                    m.avatarColor,
                  )}
                >
                  {m.name?.[0]?.toUpperCase() ?? "?"}
                </div>
                <span className="text-sm font-medium text-foreground">{m.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <StatementCard statement={statement} />

      <h2 className="text-xl font-extrabold text-foreground">Snakk sammen!</h2>
      <p className="-mt-3 max-w-[380px] text-center text-sm leading-relaxed text-muted-foreground">
        Diskuter påstanden med læringspartneren din. Avslør hva du stemte, og forsøk å forklare
        hvordan du tenker.
      </p>

      <Professor
        size="sm"
        bounce
        textSize="sm"
        text="Enige? Lag en god begrunnelse sammen! Uenige? Prøv å overbevise hverandre!"
      />

      {session.transcriptionEnabled && <RecordingDisclaimer />}
    </div>
  );
}
