import { VOTE_DOT_COLORS, VOTE_LABELS } from "@workspace/evalion/lib/constants";
import { cn } from "@workspace/ui/lib/utils";

import { useTeacherSession } from "./teacher-session-context";

export function StudentVoteList() {
  const { students, activeRoundVotes } = useTeacherSession();

  return (
    <div className="space-y-2">
      {students.map((s) => {
        const studentVote = activeRoundVotes.find((v) => v.studentId === s._id);
        return (
          <div key={s._id} className="flex items-center gap-2 text-sm">
            <span
              className={cn(
                "size-2.5 shrink-0 rounded-full transition-colors duration-300",
                studentVote ? VOTE_DOT_COLORS[studentVote.vote] : "bg-muted",
              )}
            />
            <span className="truncate font-medium text-foreground">{s.name}</span>
            <span className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
              {studentVote ? (
                <>
                  <span className="font-semibold">{VOTE_LABELS[studentVote.vote]}</span>
                  {studentVote.confidence !== undefined && studentVote.confidence !== null && (
                    <span className="rounded-full bg-muted px-1.5 py-0.5 font-bold tabular-nums">
                      {studentVote.confidence}
                    </span>
                  )}
                </>
              ) : (
                <span className="italic">Venter…</span>
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}
