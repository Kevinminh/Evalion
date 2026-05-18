import type { Doc } from "@workspace/backend/convex/_generated/dataModel";
import { Professor } from "@workspace/features/components/live/professor";
import { Users } from "lucide-react";

interface LobbyStateProps {
  joinCode: string;
  students: Doc<"sessionStudents">[];
}

export function LobbyState({ joinCode, students }: LobbyStateProps) {
  const studentCount = students.length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center gap-5 rounded-[16px] border border-neutral-200 bg-white px-5 py-8 text-center">
        <Professor
          size="sm"
          bordered
          animate
          textSize="sm"
          text="Venter på at læreren starter første påstand…"
        />
      </div>

      <div className="rounded-[16px] border border-neutral-200 bg-white p-5">
        <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          Kode for å bli med
        </div>
        <div className="mt-1.5 font-mono text-3xl font-extrabold tracking-[0.2em] text-foreground">
          {joinCode}
        </div>
      </div>

      <div className="rounded-[16px] border border-neutral-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Påkoblede elever
          </div>
          <div className="flex items-center gap-1.5 text-sm font-bold text-muted-foreground">
            <Users className="size-4" />
            {studentCount}
          </div>
        </div>

        {studentCount === 0 ? (
          <p className="mt-3 text-xs text-muted-foreground">
            Ingen elever er koblet til enda.
          </p>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {students.map((student) => (
              <div
                key={student._id}
                className="flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 py-1 pr-3 pl-1"
              >
                <div
                  className="flex size-7 shrink-0 items-center justify-center rounded-full text-base leading-none"
                  style={{ background: student.avatarColor }}
                >
                  {student.avatarEmoji ?? student.name[0]}
                </div>
                <span className="text-xs font-semibold text-foreground">{student.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
