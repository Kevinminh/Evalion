import { BarChart3 } from "lucide-react";
import { useMemo, useState } from "react";

import { ColumnChart } from "./column-chart";
import { ConfidenceCircles } from "./confidence-circles";
import { StudentMatrix } from "./student-matrix";
import type { RoundDistribution, ConfidenceData, StudentData } from "./types";

import type { Fasit } from "@/lib/types";

interface RoundAnalyticsProps {
  round: 1 | 2;
  distribution: RoundDistribution;
  confidence: ConfidenceData;
  prevConfidence?: ConfidenceData;
  prevDistribution?: RoundDistribution;
  fasit: Fasit;
  statementText: string;
  totalStudents: number;
  sessionActive: boolean;
  students: StudentData[];
  wrongToRight?: number;
  totalWrong?: number;
}

export function RoundAnalytics({
  round,
  distribution,
  confidence,
  prevConfidence,
  prevDistribution,
  fasit,
  statementText,
  totalStudents,
  sessionActive,
  students,
  wrongToRight,
  totalWrong,
}: RoundAnalyticsProps) {
  const [showConfDetail, setShowConfDetail] = useState(false);

  const voteItems = [
    {
      label: "Sant",
      count: distribution.sant,
      pct: distribution.santPct,
      colorClass: "bg-neutral-300",
      isCorrect: fasit === "sant",
      delta: prevDistribution
        ? { count: distribution.sant - prevDistribution.sant, pct: distribution.santPct - prevDistribution.santPct }
        : undefined,
    },
    {
      label: "Delvis sant",
      count: distribution.delvis,
      pct: distribution.delvisPct,
      colorClass: "bg-delvis",
      isCorrect: fasit === "delvis",
      delta: prevDistribution
        ? { count: distribution.delvis - prevDistribution.delvis, pct: distribution.delvisPct - prevDistribution.delvisPct }
        : undefined,
    },
    {
      label: "Usant",
      count: distribution.usant,
      pct: distribution.usantPct,
      colorClass: "bg-neutral-300",
      isCorrect: fasit === "usant",
      delta: prevDistribution
        ? { count: distribution.usant - prevDistribution.usant, pct: distribution.usantPct - prevDistribution.usantPct }
        : undefined,
    },
  ];

  const matrixCells = useMemo(
    () => (round === 1 ? buildR1MatrixCells(students) : buildR2MatrixCells(students)),
    [round, students],
  );

  const { changedCount, changedPct } = useMemo(() => {
    const count = students.filter(
      (s) => s.round1 && s.round2 && s.round1.vote !== s.round2.vote,
    ).length;
    return { changedCount: count, changedPct: totalStudents > 0 ? Math.round((count / totalStudents) * 100) : 0 };
  }, [students, totalStudents]);

  return (
    <div className="flex flex-col gap-3.5">
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <div className="mx-3.5 mt-3.5 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 p-2.5 text-center">
          <p className="text-xs font-semibold italic leading-relaxed text-purple-800">
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
              Avstemning aktiv
            </div>
          ) : (
            <div className="rounded-full bg-neutral-500 px-3 py-1 text-[9px] font-extrabold uppercase tracking-wider text-white">
              Runde {round} fullført
            </div>
          )}
        </div>

        <div className="px-3.5 pt-0 pb-1">
          <div className="text-[10px] font-semibold text-muted-foreground">Stemmefordeling</div>
        </div>
        <div className="px-2 pb-2">
          <ColumnChart items={voteItems} />
        </div>

        <div className="flex items-center justify-between border-t border-neutral-100 px-3.5 py-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
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
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">
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
          <button
            onClick={() => setShowConfDetail(!showConfDetail)}
            className={`flex size-8 items-center justify-center rounded-[10px] border-[1.5px] transition-all ${
              showConfDetail
                ? "border-primary/30 bg-primary/5"
                : "border-neutral-200 bg-white hover:bg-neutral-100"
            }`}
          >
            <BarChart3
              className={`size-4 ${showConfDetail ? "text-primary" : "text-muted-foreground"}`}
            />
          </button>
        </div>

        {showConfDetail && (
          <div className="border-t border-neutral-100 px-3.5 py-2.5">
            <ConfidenceCircles distribution={confidence.confidenceDistribution} />
            <div className="mt-2.5 flex flex-wrap justify-center gap-6 border-t border-neutral-100 pt-2.5">
              <div className="flex items-center gap-2.5 text-xs font-semibold">
                <span className="text-muted-foreground">Sant:</span>
                <span className="font-mono font-bold">{confidence.confidenceByVote.sant.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold">
                <span className="text-muted-foreground">Delvis sant:</span>
                <span className="font-mono font-bold">{confidence.confidenceByVote.delvis.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold">
                <span className="text-muted-foreground">Usant:</span>
                <span className="font-mono font-bold">{confidence.confidenceByVote.usant.toFixed(1)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {round === 2 && (
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          <div className="px-3.5 py-2.5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
              Endring i standpunkt
            </span>
          </div>
          <div className="px-3.5 pb-3.5">
            <div className="flex flex-col items-center gap-0.5 py-1.5">
              <span className="text-[40px] font-extrabold leading-none text-foreground">
                {changedPct}%
              </span>
              <span className="text-xs font-semibold text-muted-foreground">
                {changedCount} av {totalStudents} elever endret standpunkt
              </span>
            </div>
            {wrongToRight !== undefined && totalWrong !== undefined && totalWrong > 0 && (
              <div className="mt-1 flex items-center justify-center gap-1.5 rounded-[10px] bg-green-50 px-2.5 py-1.5">
                <span className="text-base font-extrabold text-green-700">
                  {wrongToRight}/{totalWrong}
                </span>
                <span className="text-[11px] font-semibold text-green-700">
                  endret fra feil til riktig svar (
                  {Math.round((wrongToRight / totalWrong) * 100)}%)
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <StudentMatrix cells={matrixCells} />
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

  return [
    { label: "Riktig - Høy sikkerhet (4-5)", count: riktigHoy.length, colorClass: "bg-green-50", textClass: "text-green-900", students: mapStudents(riktigHoy) },
    { label: "Riktig - Lav sikkerhet (1-3)", count: riktigLav.length, colorClass: "bg-yellow-50", textClass: "text-yellow-900", students: mapStudents(riktigLav) },
    { label: "Feil - Høy sikkerhet (4-5)", count: feilHoy.length, colorClass: "bg-red-50", textClass: "text-red-900", students: mapStudents(feilHoy) },
    { label: "Feil - Lav sikkerhet (1-3)", count: feilLav.length, colorClass: "bg-orange-50", textClass: "text-orange-900", students: mapStudents(feilLav) },
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
    { label: "Endret til riktig", count: endretTilRiktig.length, colorClass: "bg-green-50", textClass: "text-green-900", students: mapStudents(endretTilRiktig) },
    { label: "Endret fra riktig til feil", count: endretFraRiktig.length, colorClass: "bg-red-50", textClass: "text-red-900", students: mapStudents(endretFraRiktig) },
    { label: "Endret, fortsatt feil", count: endretFortsattFeil.length, colorClass: "bg-orange-50", textClass: "text-orange-900", students: mapStudents(endretFortsattFeil) },
    { label: "Uendret", count: uendret.length, colorClass: "bg-yellow-50", textClass: "text-yellow-900", students: mapStudents(uendret) },
  ];
}
