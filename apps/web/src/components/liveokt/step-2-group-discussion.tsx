import { BackButton } from "@workspace/features/components/live/back-button";
import { BreakdownRow } from "@workspace/features/components/live/breakdown-row";
import { DistributionChart } from "@workspace/features/components/live/distribution-chart";
import { FremhevetCarousel } from "@workspace/features/components/live/fremhevet-carousel";
import { PanelTabs } from "@workspace/features/components/live/panel-tabs";
import { Professor } from "@workspace/features/components/live/professor";
import { TeacherStepLayout } from "@workspace/features/components/live/teacher-step-layout";
import { resolveStatementHex } from "@workspace/features/lib/constants";
import { formatDecimal1 } from "@workspace/features/lib/format";
import { PanelCard } from "@workspace/ui/components/panel-card";
import { PanelSectionLabel } from "@workspace/ui/components/panel-section-label";
import { StatementCard } from "@workspace/ui/components/statement-card";
import { BarChart3 } from "lucide-react";
import { useState } from "react";

import type { TeacherStep } from "@/types/teacher-step";

import { useTeacherSession } from "./teacher-session-context";

export function useStep2(): TeacherStep {
  const {
    statement,
    panelTab,
    setPanelTab,
    begrunnelser,
    voteBars,
    totalVotes,
    activeRoundVotes,
    avgConfidenceR1,
    avgConfidenceR1ByVote,
    selectedIdx,
    goToStep,
    highlightJustification,
  } = useTeacherSession();
  const begrunnelseTab = panelTab === "default" || panelTab === "begrunnelser";
  const [showAvgBreakdown, setShowAvgBreakdown] = useState(false);

  const statementColor = resolveStatementHex(statement?.color, selectedIdx);

  const main = (
    <TeacherStepLayout
      top={
        <div className="flex w-full items-center justify-between">
          <BackButton onClick={() => goToStep(0)} />
        </div>
      }
      statement={
        statement && (
          <StatementCard statement={statement} size="lg" color={statementColor} gradient />
        )
      }
      professor={
        <Professor
          size="md"
          bordered
          animate
          textSize="lg"
          text="Diskuter med læringspartneren din. Forklar hva du tenker og lytt til hva den andre mener."
        />
      }
    />
  );

  const panel = (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <PanelSectionLabel>Elevsvar – Første stemmerunde</PanelSectionLabel>
      <PanelTabs
        tabs={[
          { key: "begrunnelser", label: "Begrunnelser" },
          { key: "stemmefordeling", label: "Stemmefordeling" },
        ]}
        activeTab={begrunnelseTab ? "begrunnelser" : "stemmefordeling"}
        onTabChange={setPanelTab}
      >
        {begrunnelseTab ? (
          <PanelCard gap="2">
            <FremhevetCarousel
              begrunnelser={begrunnelser}
              votes={activeRoundVotes}
              round={1}
              onDismiss={(b) => void highlightJustification(b)}
            />
          </PanelCard>
        ) : (
          <PanelCard>
            <div className="relative flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-[var(--color-text-ink-soft)]">
                Gjennomsnittlig sikkerhet:
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xl font-extrabold leading-none tabular-nums text-[var(--color-turkis-500)]">
                  {formatDecimal1(avgConfidenceR1)}
                </span>
                <button
                  type="button"
                  aria-label="Vis sikkerhet fordelt på kategori"
                  aria-pressed={showAvgBreakdown}
                  onClick={() => setShowAvgBreakdown((s) => !s)}
                  className={
                    "flex size-8 items-center justify-center rounded-xl border-[1.5px] border-[var(--color-divider-soft)] text-[var(--color-text-ink-faint)] transition-colors " +
                    (showAvgBreakdown
                      ? "bg-[var(--color-divider-soft)] text-[var(--color-text-ink-soft)]"
                      : "bg-white hover:bg-[var(--color-divider-soft)]")
                  }
                >
                  <BarChart3 className="size-4" strokeWidth={2} />
                </button>
              </div>
              {showAvgBreakdown && (
                <div className="absolute top-full right-0 z-10 mt-2 flex min-w-[160px] flex-col gap-1.5 rounded-xl border-[1.5px] border-[var(--color-divider-soft)] bg-white p-3 shadow-[var(--shadow-card-soft)]">
                  <BreakdownRow label="Sant:" value={avgConfidenceR1ByVote.sant} />
                  <BreakdownRow label="Delvis sant:" value={avgConfidenceR1ByVote.delvis} />
                  <BreakdownRow label="Usant:" value={avgConfidenceR1ByVote.usant} />
                </div>
              )}
            </div>
            <div className="h-px bg-[var(--color-divider-soft)]" />
            <div className="flex-1 min-h-0 py-2">
              <DistributionChart
                key={`s${selectedIdx}-discussion`}
                bars={voteBars}
                total={totalVotes}
              />
            </div>
          </PanelCard>
        )}
      </PanelTabs>
    </div>
  );

  return { main, panel, panelFooter: null };
}
