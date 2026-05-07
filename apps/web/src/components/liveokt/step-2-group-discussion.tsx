import type { Doc } from "@workspace/backend/convex/_generated/dataModel";
import { BegrunnelseCard } from "@workspace/evalion/components/live/begrunnelse-card";
import { BegrunnelseNav } from "@workspace/evalion/components/live/begrunnelse-nav";
import { DistributionChart } from "@workspace/evalion/components/live/distribution-chart";
import { PanelTabs } from "@workspace/evalion/components/live/panel-tabs";
import { Professor } from "@workspace/evalion/components/live/professor";
import { TimerCard } from "@workspace/evalion/components/live/timer-card";
import { StatementCard } from "@workspace/ui/components/statement-card";
import { cn } from "@workspace/ui/lib/utils";

import { StudentVoteList } from "./student-vote-list";
import type { TeacherStep } from "@/types/teacher-step";
import { useTeacherSession } from "./teacher-session-context";

function HighlightedBegrunnelse({
  begrunnelse,
  studentName,
  onToggle,
}: {
  begrunnelse: Doc<"sessionBegrunnelser">;
  studentName: string | undefined;
  onToggle: () => void;
}) {
  return (
    <div className="space-y-2">
      <BegrunnelseCard text={begrunnelse.text} studentName={studentName} />
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "w-full rounded-lg px-3 py-2 text-xs font-bold transition-all",
          begrunnelse.highlighted
            ? "bg-primary text-primary-foreground"
            : "border border-border text-muted-foreground hover:bg-primary/10 hover:text-primary",
        )}
      >
        {begrunnelse.highlighted ? "Fremhevet" : "Fremhev"}
      </button>
    </div>
  );
}

export function useStep2(): TeacherStep {
  const {
    statement,
    panelTab,
    setPanelTab,
    begrunnelser,
    begrunnelseIdx,
    setBegrunnelseIdx,
    students,
    voteBars,
    totalVotes,
    timer,
    highlightBegrunnelse,
  } = useTeacherSession();
  const begrunnelseTab = panelTab === "default" || panelTab === "begrunnelser";

  const main = (
    <div className="flex flex-col items-center gap-6 pt-4">
      {statement && <StatementCard statement={statement} size="lg" />}
      <Professor
        size="md"
        text="Diskuter med læringspartneren din. Forklar hva du tenker og lytt til hva den andre mener."
      />
    </div>
  );

  const currentBegrunnelse = begrunnelser?.[begrunnelseIdx];
  const currentStudentName = currentBegrunnelse
    ? students.find((s) => s._id === currentBegrunnelse.studentId)?.name
    : undefined;

  const panel = (
    <PanelTabs
      tabs={[
        { key: "begrunnelser", label: "Begrunnelser" },
        { key: "stemmefordeling", label: "Stemmefordeling" },
      ]}
      activeTab={begrunnelseTab ? "begrunnelser" : "stemmefordeling"}
      onTabChange={setPanelTab}
    >
      {begrunnelseTab ? (
        <div className="space-y-4">
          <TimerCard {...timer} />
          {!begrunnelser || begrunnelser.length === 0 ? (
            <p className="text-xs italic text-muted-foreground">Ingen begrunnelser ennå</p>
          ) : (
            <>
              <BegrunnelseNav
                current={begrunnelseIdx + 1}
                total={begrunnelser.length}
                onPrev={() => setBegrunnelseIdx((i) => Math.max(0, i - 1))}
                onNext={() => setBegrunnelseIdx((i) => Math.min(begrunnelser.length - 1, i + 1))}
              />
              {currentBegrunnelse && (
                <HighlightedBegrunnelse
                  begrunnelse={currentBegrunnelse}
                  studentName={currentStudentName}
                  onToggle={() => highlightBegrunnelse(currentBegrunnelse)}
                />
              )}
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <StudentVoteList />
          <div className="h-px bg-border" />
          <DistributionChart bars={voteBars} total={totalVotes} />
        </div>
      )}
    </PanelTabs>
  );

  return { main, panel };
}
