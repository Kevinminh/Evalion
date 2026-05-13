import type { Id } from "@workspace/backend/convex/_generated/dataModel";
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover";
import { cn } from "@workspace/ui/lib/utils";
import { BarChart3 } from "lucide-react";
import { useMemo, useState } from "react";

import type { Fasit } from "@/lib/types";

import { ColumnChart } from "./column-chart";
import { MatrixHint, StudentMatrix } from "./student-matrix";
import {
  getStatementGradient,
  type RoundDistribution,
  type ConfidenceData,
  type StatementColorName,
  type StudentData,
} from "./types";

interface RoundAnalyticsProps {
  round: 1 | 2;
  distribution: RoundDistribution;
  confidence: ConfidenceData;
  prevConfidence?: ConfidenceData;
  prevDistribution?: RoundDistribution;
  fasit: Fasit;
  statementText: string;
  statementColor?: StatementColorName;
  totalStudents: number;
  sessionActive: boolean;
  students: StudentData[];
  onToggleHighlight?: (id: Id<"sessionBegrunnelser">, next: boolean) => void;
}

export function RoundAnalytics({
  round,
  distribution,
  confidence,
  prevConfidence,
  prevDistribution,
  fasit,
  statementText,
  statementColor,
  totalStudents,
  sessionActive,
  students,
  onToggleHighlight,
}: RoundAnalyticsProps) {
  const gradient = getStatementGradient(statementColor);
  const [matrixSelected, setMatrixSelected] = useState<number | null>(null);

  const voteItems = [
    {
      label: "Sant",
      count: distribution.sant,
      pct: distribution.santPct,
      isCorrect: fasit === "sant",
      delta: prevDistribution
        ? {
            count: distribution.sant - prevDistribution.sant,
            pct: distribution.santPct - prevDistribution.santPct,
          }
        : undefined,
    },
    {
      label: "Delvis sant",
      count: distribution.delvis,
      pct: distribution.delvisPct,
      isCorrect: fasit === "delvis",
      delta: prevDistribution
        ? {
            count: distribution.delvis - prevDistribution.delvis,
            pct: distribution.delvisPct - prevDistribution.delvisPct,
          }
        : undefined,
    },
    {
      label: "Usant",
      count: distribution.usant,
      pct: distribution.usantPct,
      isCorrect: fasit === "usant",
      delta: prevDistribution
        ? {
            count: distribution.usant - prevDistribution.usant,
            pct: distribution.usantPct - prevDistribution.usantPct,
          }
        : undefined,
    },
  ];

  const r1Cells = useMemo(() => buildR1MatrixCells(students), [students]);
  const r2Cells = useMemo(() => buildR2MatrixCells(students), [students]);

  const { changedCount, changedPct } = useMemo(() => {
    const count = students.filter(
      (s) => s.round1 && s.round2 && s.round1.vote !== s.round2.vote,
    ).length;
    return {
      changedCount: count,
      changedPct: totalStudents > 0 ? Math.round((count / totalStudents) * 100) : 0,
    };
  }, [students, totalStudents]);

  return (
    <div className="flex flex-col gap-3.5">
      <div className="overflow-hidden rounded-[16px] border border-neutral-200 bg-white">
        <div
          className="mx-3.5 mt-3.5 rounded-[12px] p-2.5 text-center"
          style={{ background: gradient.background }}
        >
          <p
            className="text-xs font-semibold italic leading-relaxed"
            style={{ color: gradient.text }}
          >
            «{statementText}»
          </p>
        </div>

        <div className="flex items-center justify-between px-3.5 py-2.5">
          <span className="text-xs font-bold text-muted-foreground">
            <strong className="font-extrabold text-foreground">{distribution.total}</strong> av{" "}
            {totalStudents} elever har stemt
          </span>
          {sessionActive && round === 1 ? (
            <div className="flex items-center gap-1.5 rounded-full bg-sant px-3 py-1 text-[9px] font-extrabold uppercase tracking-wider text-white">
              <span className="size-1.5 animate-pulse rounded-full bg-white" />
              Avstemning pågår
            </div>
          ) : (
            <div className="rounded-full bg-neutral-500 px-3 py-1 text-[9px] font-extrabold uppercase tracking-wider text-white">
              Runde {round} fullført
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-3.5 py-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold text-muted-foreground">
              Gjennomsnittlig sikkerhet:
            </span>
            {prevConfidence ? (
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold text-muted-foreground">
                  {prevConfidence.avgConfidence.toFixed(1)}
                </span>
                <span className="text-xs text-muted-foreground">→</span>
                <span className="font-mono text-lg font-extrabold text-secondary-foreground">
                  {confidence.avgConfidence.toFixed(1)}
                </span>
                {confidence.avgConfidence !== prevConfidence.avgConfidence && (
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-bold tabular-nums",
                      confidence.avgConfidence > prevConfidence.avgConfidence
                        ? "bg-sant/15 text-sant"
                        : "bg-usant/15 text-usant",
                    )}
                  >
                    {confidence.avgConfidence > prevConfidence.avgConfidence ? "+" : ""}
                    {(confidence.avgConfidence - prevConfidence.avgConfidence).toFixed(1)}
                  </span>
                )}
              </div>
            ) : (
              <span className="font-mono text-lg font-extrabold text-secondary-foreground">
                {confidence.avgConfidence.toFixed(1)}
              </span>
            )}
          </div>
          <Popover>
            <PopoverTrigger
              aria-label="Vis fordelt på kategori"
              className="flex size-8 items-center justify-center rounded-[10px] border-[1.5px] border-neutral-200 bg-white text-muted-foreground transition-all hover:bg-neutral-100 data-[popup-open]:border-primary/30 data-[popup-open]:bg-primary/5 data-[popup-open]:text-primary"
            >
              <BarChart3 className="size-4" />
            </PopoverTrigger>
            <PopoverContent side="bottom" align="end" sideOffset={8} className="w-44 gap-1.5">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span className="text-muted-foreground">Sant:</span>
                <span className="font-mono font-bold">
                  {confidence.confidenceByVote.sant.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm font-semibold">
                <span className="text-muted-foreground">Delvis sant:</span>
                <span className="font-mono font-bold">
                  {confidence.confidenceByVote.delvis.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm font-semibold">
                <span className="text-muted-foreground">Usant:</span>
                <span className="font-mono font-bold">
                  {confidence.confidenceByVote.usant.toFixed(1)}
                </span>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="border-t border-neutral-100 px-3.5 pb-3.5">
          <p className="pt-1.5 text-[10px] font-semibold text-muted-foreground">Stemmefordeling</p>
          <ColumnChart items={voteItems} />
        </div>
      </div>

      {round === 2 && (
        <div className="overflow-hidden rounded-[16px] border border-neutral-200 bg-white">
          <div className="px-3.5 py-2.5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
              Endringer
            </span>
          </div>
          <div className="px-3.5 pb-3.5">
            <div className="flex items-center justify-center gap-2.5 rounded-[14px] bg-primary/15 px-3.5 py-2.5">
              <span className="font-mono text-[20px] font-extrabold leading-none text-secondary-foreground tabular-nums">
                {changedCount}/{totalStudents}
              </span>
              <span className="text-[11px] font-semibold text-muted-foreground">
                har endret mening ({changedPct}%)
              </span>
            </div>
          </div>
        </div>
      )}

      {round === 1 ? (
        <StudentMatrix
          cells={r1Cells}
          layout="r1"
          selectedIdx={matrixSelected}
          onSelect={setMatrixSelected}
          onToggleHighlight={onToggleHighlight}
        />
      ) : (
        <StudentMatrix
          cells={r2Cells}
          title="Kategorier"
          layout="r2"
          selectedIdx={matrixSelected}
          onSelect={setMatrixSelected}
        />
      )}

      {matrixSelected === null && <MatrixHint />}
    </div>
  );
}

function buildR1MatrixCells(students: StudentData[]) {
  const riktigHoy: StudentData[] = [];
  const riktigLav: StudentData[] = [];
  const feilHoy: StudentData[] = [];
  const feilLav: StudentData[] = [];

  for (const s of students) {
    if (!s.round1) continue;
    const correct = s.round1.correct;
    const high = (s.round1.confidence ?? 0) >= 4;
    if (correct && high) riktigHoy.push(s);
    else if (correct && !high) riktigLav.push(s);
    else if (!correct && high) feilHoy.push(s);
    else feilLav.push(s);
  }

  const mapStudents = (arr: StudentData[]) =>
    arr.map((s) => ({
      name: s.name,
      vote: s.round1!.vote as "sant" | "usant" | "delvis",
      confidence: s.round1!.confidence,
      begrunnelse: s.begrunnelseR1,
    }));

  // Order matters: R1Matrix expects [riktigHoy, feilHoy, riktigLav, feilLav]
  return [
    {
      label: "Riktig - Høy sikkerhet (4-5)",
      count: riktigHoy.length,
      students: mapStudents(riktigHoy),
    },
    { label: "Feil - Høy sikkerhet (4-5)", count: feilHoy.length, students: mapStudents(feilHoy) },
    {
      label: "Riktig - Lav sikkerhet (1-3)",
      count: riktigLav.length,
      students: mapStudents(riktigLav),
    },
    { label: "Feil - Lav sikkerhet (1-3)", count: feilLav.length, students: mapStudents(feilLav) },
  ];
}

function buildR2MatrixCells(students: StudentData[]) {
  const endretTilRiktig: StudentData[] = [];
  const endretFraRiktig: StudentData[] = [];
  const endretFortsattFeil: StudentData[] = [];
  const uendret: StudentData[] = [];

  for (const s of students) {
    if (!s.round1 || !s.round2) continue;
    const r1Correct = s.round1.correct;
    const r2Correct = s.round2.correct;
    const changed = s.round1.vote !== s.round2.vote;

    if (!r1Correct && r2Correct) endretTilRiktig.push(s);
    else if (r1Correct && !r2Correct) endretFraRiktig.push(s);
    else if (changed && !r2Correct) endretFortsattFeil.push(s);
    else uendret.push(s);
  }

  const mapStudents = (arr: StudentData[]) =>
    arr.map((s) => ({
      name: s.name,
      vote: s.round1!.vote as "sant" | "usant" | "delvis",
      confidence: s.round2!.confidence,
      begrunnelse: null,
      vote2: s.round2!.vote as "sant" | "usant" | "delvis",
    }));

  return [
    {
      label: "Endret til riktig",
      count: endretTilRiktig.length,
      colorClass: "bg-[#E8F5E9]",
      textClass: "text-[#2E7D32]",
      students: mapStudents(endretTilRiktig),
    },
    {
      label: "Endret fra riktig til feil",
      count: endretFraRiktig.length,
      colorClass: "bg-[#FFEBEE]",
      textClass: "text-[#C62828]",
      students: mapStudents(endretFraRiktig),
    },
    {
      label: "Endret, fortsatt feil",
      count: endretFortsattFeil.length,
      colorClass: "bg-[#FFF3E0]",
      textClass: "text-[#B35C00]",
      students: mapStudents(endretFortsattFeil),
    },
    {
      label: "Uendret",
      count: uendret.length,
      colorClass: "bg-[#FFFDE7]",
      textClass: "text-[#8D6E00]",
      students: mapStudents(uendret),
    },
  ];
}
