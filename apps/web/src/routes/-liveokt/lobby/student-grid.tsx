import type { Doc } from "@workspace/backend/convex/_generated/dataModel";
import { X } from "lucide-react";

import { pastelFor } from "@/lib/avatar";
import type { Id } from "@/lib/convex";

interface StudentGridProps {
  students: Doc<"sessionStudents">[];
  groupCount: number;
  hasGroups: boolean;
  onRemove: (id: Id<"sessionStudents">) => void;
}

export function StudentGrid({ students, groupCount, hasGroups, onRemove }: StudentGridProps) {
  if (!hasGroups) {
    return <UngroupedList students={students} onRemove={onRemove} />;
  }

  const groups = Array.from({ length: groupCount }, (_, gi) =>
    students.filter((s) => s.groupIndex === gi),
  );

  return (
    <div className="flex flex-wrap gap-4">
      {groups.map((group, gi) => (
        <div
          key={gi}
          className="w-full min-w-[140px] sm:w-[180px]"
          style={{
            animation: "groupFadeIn 0.4s ease both",
            animationDelay: `${gi * 0.08}s`,
          }}
        >
          <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Gruppe {gi + 1}
          </div>
          <div className="flex flex-col gap-2 rounded-xl border-[1.5px] border-border bg-card p-3">
            {group.map((student) => (
              <div key={student._id} className="flex items-center gap-2">
                <div
                  className="flex size-7 shrink-0 items-center justify-center rounded-full text-base leading-none"
                  style={{ background: pastelFor(student._id) }}
                >
                  {student.avatarEmoji ?? student.name[0]}
                </div>
                <span className="text-sm font-semibold text-foreground">{student.name}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function UngroupedList({
  students,
  onRemove,
}: {
  students: Doc<"sessionStudents">[];
  onRemove: (id: Id<"sessionStudents">) => void;
}) {
  return (
    <div className="flex flex-wrap content-start gap-3">
      {students.map((student) => (
        <div
          key={student._id}
          className="flex items-center gap-2 rounded-xl border-[1.5px] border-border bg-card p-2 pr-3 shadow-xs"
          style={{ animation: "cardIn 0.3s ease" }}
        >
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-lg leading-none"
            style={{ background: pastelFor(student._id) }}
          >
            {student.avatarEmoji ?? student.name[0]}
          </div>
          <span className="text-sm font-bold text-foreground">{student.name}</span>
          <button
            type="button"
            onClick={() => onRemove(student._id)}
            className="ml-1 rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="size-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
