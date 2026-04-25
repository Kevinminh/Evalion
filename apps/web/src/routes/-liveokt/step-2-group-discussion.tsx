import type { Doc } from "@workspace/backend/convex/_generated/dataModel";
import { BegrunnelseCard } from "@workspace/evalion/components/live/begrunnelse-card";
import { BegrunnelseNav } from "@workspace/evalion/components/live/begrunnelse-nav";
import { DistributionChart } from "@workspace/evalion/components/live/distribution-chart";
import { PanelTabs } from "@workspace/evalion/components/live/panel-tabs";
import { Professor } from "@workspace/evalion/components/live/professor";
import { TimerCard } from "@workspace/evalion/components/live/timer-card";
import { cn } from "@workspace/ui/lib/utils";
import type { ReactNode } from "react";

interface VoteBar {
  label: string;
  value: number;
  color: string;
}

type Begrunnelse = Doc<"sessionBegrunnelser">;
type Student = Doc<"sessionStudents">;

interface Step2MainProps {
  statementCard: ReactNode;
}

export function Step2Main({ statementCard }: Step2MainProps) {
  return (
    <div className="flex flex-col items-center gap-6 pt-4">
      {statementCard}
      <Professor
        size="sm"
        text="Diskuter med læringspartneren din. Forklar hva du tenker og lytt til hva den andre mener."
      />
    </div>
  );
}

interface Step2PanelProps {
  panelTab: string;
  onPanelTabChange: (tab: string) => void;
  begrunnelser: Begrunnelse[] | undefined;
  begrunnelseIdx: number;
  setBegrunnelseIdx: (updater: (i: number) => number) => void;
  studentList: Student[];
  onHighlight: (begrunnelse: Begrunnelse) => void;
  studentVoteList: ReactNode;
  voteBars: VoteBar[];
  totalVotes: number;
  timerDuration: number | undefined;
  timerStartedAt: number | undefined;
  timerPausedAt: number | undefined;
  timerRemainingAtPause: number | undefined;
  onTimerStart: (duration: number) => void;
  onTimerPause: () => void;
  onTimerStop: () => void;
}

export function Step2Panel({
  panelTab,
  onPanelTabChange,
  begrunnelser,
  begrunnelseIdx,
  setBegrunnelseIdx,
  studentList,
  onHighlight,
  studentVoteList,
  voteBars,
  totalVotes,
  timerDuration,
  timerStartedAt,
  timerPausedAt,
  timerRemainingAtPause,
  onTimerStart,
  onTimerPause,
  onTimerStop,
}: Step2PanelProps) {
  const begrunnelseTab = panelTab === "default" || panelTab === "begrunnelser";
  return (
    <PanelTabs
      tabs={[
        { key: "begrunnelser", label: "Begrunnelser" },
        { key: "stemmefordeling", label: "Stemmefordeling" },
      ]}
      activeTab={begrunnelseTab ? "begrunnelser" : "stemmefordeling"}
      onTabChange={onPanelTabChange}
    >
      {begrunnelseTab ? (
        <div className="space-y-4">
          <TimerCard
            duration={timerDuration}
            startedAt={timerStartedAt}
            pausedAt={timerPausedAt}
            remainingAtPause={timerRemainingAtPause}
            onStart={onTimerStart}
            onPause={onTimerPause}
            onStop={onTimerStop}
          />
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
              {(() => {
                const b = begrunnelser[begrunnelseIdx];
                if (!b) return null;
                const studentName = studentList.find((s) => s._id === b.studentId)?.name;
                return (
                  <div className="space-y-2">
                    <BegrunnelseCard text={b.text} studentName={studentName} />
                    <button
                      onClick={() => onHighlight(b)}
                      className={cn(
                        "w-full rounded-lg px-3 py-2 text-xs font-bold transition-all",
                        b.highlighted
                          ? "bg-primary text-primary-foreground"
                          : "border border-border text-muted-foreground hover:bg-primary/10 hover:text-primary",
                      )}
                    >
                      {b.highlighted ? "Fremhevet" : "Fremhev"}
                    </button>
                  </div>
                );
              })()}
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {studentVoteList}
          <div className="h-px bg-border" />
          <DistributionChart bars={voteBars} total={totalVotes} />
        </div>
      )}
    </PanelTabs>
  );
}
