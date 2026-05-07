import { BegrunnelseCard } from "@workspace/evalion/components/live/begrunnelse-card";
import { DistributionChart } from "@workspace/evalion/components/live/distribution-chart";
import { PanelTabs } from "@workspace/evalion/components/live/panel-tabs";
import { Professor } from "@workspace/evalion/components/live/professor";
import { resolveStatementHex } from "@workspace/evalion/lib/constants";
import { StatementCard } from "@workspace/ui/components/statement-card";
import { Smartphone } from "lucide-react";

import type { TeacherStep } from "@/types/teacher-step";

import { useTeacherSession } from "./teacher-session-context";

export function useStep2(): TeacherStep {
  const {
    statement,
    panelTab,
    setPanelTab,
    begrunnelser,
    students,
    voteBars,
    totalVotes,
    activeRoundVotes,
    selectedIdx,
  } = useTeacherSession();
  const begrunnelseTab = panelTab === "default" || panelTab === "begrunnelser";

  const statementColor = resolveStatementHex(statement?.color, selectedIdx);

  const main = (
    <div className="flex flex-col items-center gap-10 pt-2 sm:gap-14">
      {statement && (
        <StatementCard statement={statement} size="lg" color={statementColor} gradient />
      )}
      <Professor
        size="md"
        bordered
        animate
        textSize="lg"
        text="Diskuter med læringspartneren din. Forklar hva du tenker og lytt til hva den andre mener."
      />
    </div>
  );

  const highlighted = begrunnelser?.find((b) => b.highlighted) ?? null;
  const highlightedStudent = highlighted
    ? students.find((s) => s._id === highlighted.studentId)
    : undefined;
  const highlightedVote = highlighted
    ? activeRoundVotes.find((v) => v.studentId === highlighted.studentId)?.vote
    : undefined;

  const withConfidence = activeRoundVotes.filter((v) => typeof v.confidence === "number");
  const avgConfidence = withConfidence.length
    ? withConfidence.reduce((sum, v) => sum + (v.confidence ?? 0), 0) / withConfidence.length
    : null;

  const panel = (
    <div className="space-y-3">
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
        Elevsvar – Første stemmerunde
      </p>
      <PanelTabs
        tabs={[
          { key: "begrunnelser", label: "Begrunnelser" },
          { key: "stemmefordeling", label: "Stemmefordeling" },
        ]}
        activeTab={begrunnelseTab ? "begrunnelser" : "stemmefordeling"}
        onTabChange={setPanelTab}
      >
        {begrunnelseTab ? (
          highlighted ? (
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-primary">
                Fremhevet
              </p>
              <BegrunnelseCard
                text={highlighted.text}
                studentName={highlightedStudent?.name}
                vote={highlightedVote}
                highlighted
              />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card/40 p-8 text-center">
              <Smartphone className="size-8 text-muted-foreground/40" />
              <p className="text-xs italic leading-relaxed text-muted-foreground">
                Trykk på begrunnelser i live-statistikken på din eksterne enhet for å fremheve dem
                her.
              </p>
            </div>
          )
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
              <span className="text-sm font-semibold text-muted-foreground">
                Gjennomsnittlig sikkerhet
              </span>
              <span className="text-lg font-bold tabular-nums text-primary">
                {avgConfidence !== null ? avgConfidence.toFixed(1).replace(".", ",") : "–"}
              </span>
            </div>
            <DistributionChart
              key={`s${selectedIdx}-discussion`}
              bars={voteBars}
              total={totalVotes}
            />
          </div>
        )}
      </PanelTabs>
    </div>
  );

  return { main, panel, panelFooter: null };
}
