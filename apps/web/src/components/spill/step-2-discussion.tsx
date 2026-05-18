import { Professor } from "@workspace/features/components/live/professor";
import { resolveStatementStudentHex } from "@workspace/features/lib/constants";
import { StatementCard } from "@workspace/ui/components/statement-card";
import { StudentAvatar } from "@workspace/ui/components/student-avatar";

import { useStudentGame } from "./student-game-context";

export function Step2Discussion() {
  const { statement, statementIndex, groupMembers } = useStudentGame();
  if (!statement) return null;

  const statementColor = resolveStatementStudentHex(statement.color, statementIndex);

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
                <StudentAvatar name={m.name} avatarColor={m.avatarColor} size="xs" />
                <span className="text-sm font-medium text-foreground">{m.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <StatementCard statement={statement} color={statementColor} />

      <h2 className="text-xl font-extrabold text-foreground">Snakk sammen!</h2>
      <p className="-mt-3 max-w-[380px] text-center text-sm leading-relaxed text-muted-foreground">
        Diskuter påstanden med læringspartneren din. Avslør hva du stemte, og forsøk å forklare
        hvordan du tenker.
      </p>

      <Professor
        size="sm"
        bordered
        bounce
        textSize="sm"
        text={
          <span className="block text-left">
            <span className="block">
              <span className="font-bold">Enige?</span> Lag en god begrunnelse sammen!
            </span>
            <span className="block">
              <span className="font-bold">Uenige?</span> Prøv å overbevise hverandre!
            </span>
          </span>
        }
      />
    </div>
  );
}
