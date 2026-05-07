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
      <StatementCard statement={statement} />

      <h2 className="text-xl font-extrabold text-foreground">Snakk sammen!</h2>

      <Professor
        size="sm"
        bounce
        textSize="sm"
        text="Enige? Lag en god begrunnelse sammen! Uenige? Prøv å overbevise hverandre!"
      />

      {groupMembers.length > 0 && (
        <div className="w-full max-w-md">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Din gruppe
          </p>
          <div className="flex flex-wrap gap-2">
            {groupMembers.map((m) => (
              <div
                key={m._id}
                className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 shadow-xs"
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

      {session.transcriptionEnabled && <RecordingDisclaimer />}
    </div>
  );
}
