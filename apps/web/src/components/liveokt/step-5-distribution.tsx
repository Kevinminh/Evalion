import { BegrunnelseCard } from "@workspace/evalion/components/live/begrunnelse-card";
import { FasitBadge } from "@workspace/evalion/components/live/fasit-badge";
import { Professor } from "@workspace/evalion/components/live/professor";

import type { TeacherStep } from "@/types/teacher-step";
import { useTeacherSession } from "./teacher-session-context";

export function useStep5(): TeacherStep {
  const { statement, r2CorrectCount, r2Total, begrunnelser, students } = useTeacherSession();
  const highlightedBegrunnelse = begrunnelser?.find((b) => b.highlighted);
  const highlightedStudent = highlightedBegrunnelse
    ? students.find((s) => s._id === highlightedBegrunnelse.studentId)
    : null;

  const main = (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 pt-8">
      {statement && <FasitBadge fasit={statement.fasit} />}
      <div className="w-full max-h-[392px] overflow-y-auto rounded-2xl border border-primary/20 shadow-sm animate-[fadeInUp_0.5s_ease_0.2s_both]">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6">
          <p className="text-center text-lg font-bold text-foreground">{statement?.text}</p>
        </div>
        <div className="bg-white p-6">
          <div className="flex gap-4">
            <Professor size="md" bordered className="shrink-0" />
            <div>
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-primary/70">
                Forklaring
              </div>
              <p className="text-sm leading-relaxed text-foreground/85">
                {statement?.explanation}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const panel = (
    <div className="space-y-4">
      <div className="rounded-xl bg-sant/10 p-4">
        <div className="text-xs font-bold uppercase tracking-wider text-sant">Svarte riktig</div>
        <p className="text-lg font-extrabold text-sant tabular-nums">
          {r2CorrectCount}/{r2Total}
        </p>
      </div>
      <div>
        <div className="mb-2 text-xs font-bold uppercase tracking-wider text-primary/70">
          Fremhevet begrunnelse
        </div>
        {highlightedBegrunnelse ? (
          <BegrunnelseCard
            text={highlightedBegrunnelse.text}
            studentName={highlightedStudent?.name}
            highlighted
          />
        ) : (
          <div className="rounded-2xl border border-primary/15 bg-primary/[0.04] p-5">
            <p className="text-sm italic text-muted-foreground">
              Ingen fremhevet begrunnelse ennå.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return { main, panel };
}
