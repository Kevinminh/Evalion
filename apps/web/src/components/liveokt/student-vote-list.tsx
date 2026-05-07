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
                "size-2.5 shrink-0 rounded-full",
                studentVote ? VOTE_DOT_COLORS[studentVote.vote] : "bg-muted",
              )}
            />
            <span className="font-medium text-foreground">{s.name}</span>
            <span className="text-muted-foreground">
              {studentVote ? VOTE_LABELS[studentVote.vote] : "Venter..."}
            </span>
          </div>
        );
      })}
    </div>
  );
}
