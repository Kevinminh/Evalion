import { BegrunnelseCard } from "@workspace/evalion/components/live/begrunnelse-card";
import { BegrunnelseNav } from "@workspace/evalion/components/live/begrunnelse-nav";
import { DistributionChart } from "@workspace/evalion/components/live/distribution-chart";
import { PanelTabs } from "@workspace/evalion/components/live/panel-tabs";
import { Professor } from "@workspace/evalion/components/live/professor";
import { TimerCard } from "@workspace/evalion/components/live/timer-card";
import { StatementCard } from "@workspace/ui/components/statement-card";
import { cn } from "@workspace/ui/lib/utils";

import { StudentVoteList } from "./student-vote-list";
import { useTeacherSession } from "./teacher-session-context";

export function Step2Main() {
  const { statement } = useTeacherSession();
  return (
    <div className="flex flex-col items-center gap-6 pt-4">
      {statement && <StatementCard statement={statement} size="lg" />}
      <Professor
        size="md"
        text="Diskuter med læringspartneren din. Forklar hva du tenker og lytt til hva den andre mener."
      />
    </div>
  );
}

export function Step2Panel() {
  const {
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

  return (
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
              {(() => {
                const b = begrunnelser[begrunnelseIdx];
                if (!b) return null;
                const studentName = students.find((s) => s._id === b.studentId)?.name;
                return (
                  <div className="space-y-2">
                    <BegrunnelseCard text={b.text} studentName={studentName} />
                    <button
                      onClick={() => highlightBegrunnelse(b)}
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
          <StudentVoteList />
          <div className="h-px bg-border" />
          <DistributionChart bars={voteBars} total={totalVotes} />
        </div>
      )}
    </PanelTabs>
  );
}
