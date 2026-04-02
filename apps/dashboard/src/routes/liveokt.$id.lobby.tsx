import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Users, X } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { fagpratQueries } from "@/lib/convex";
import type { FagPratId } from "@/lib/types";
import { SessionTopBar } from "@/components/live/session-top-bar";

export const Route = createFileRoute("/liveokt/$id/lobby")({
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  validateSearch: (search: Record<string, unknown>) => ({
    groups: search.groups === "true" || search.groups === true,
    groupCount: Number(search.groupCount) || 4,
  }),
  component: LobbyPage,
});

interface Student {
  name: string;
  color: string;
}

const MOCK_STUDENTS: Student[] = [
  { name: "Emma S.", color: "bg-purple-400" },
  { name: "Oliver H.", color: "bg-teal-400" },
  { name: "Sofia L.", color: "bg-pink-400" },
  { name: "Lucas B.", color: "bg-green-500" },
  { name: "Nora K.", color: "bg-orange-400" },
  { name: "Henrik A.", color: "bg-purple-400" },
  { name: "Amalie J.", color: "bg-teal-400" },
  { name: "Mathias R.", color: "bg-pink-400" },
];

function shuffleIntoGroups<T>(items: T[], groupCount: number): T[][] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i]!, shuffled[j]!] = [shuffled[j]!, shuffled[i]!];
  }
  const groups: T[][] = Array.from({ length: groupCount }, () => []);
  shuffled.forEach((item, idx) => {
    groups[idx % groupCount]!.push(item);
  });
  return groups;
}

function WaitingDots() {
  return (
    <span className="ml-1 inline-flex gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-1.5 rounded-full bg-primary/40"
          style={{
            animation: "dotPulse 1.4s ease-in-out infinite both",
            animationDelay: `${i * 0.16}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes dotPulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </span>
  );
}

function LobbyPage() {
  const { id } = Route.useParams();
  const { groups: groupsEnabled, groupCount } = Route.useSearch();
  const navigate = useNavigate();
  const { data: fagprat, isPending } = useQuery(fagpratQueries.getById(id as FagPratId));

  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [groups, setGroups] = useState<Student[][] | null>(null);
  const [groupsCreated, setGroupsCreated] = useState(false);

  const removeStudent = (name: string) => {
    setStudents((prev) => prev.filter((s) => s.name !== name));
  };

  const handleCreateGroups = () => {
    const result = shuffleIntoGroups(students, groupCount);
    setGroups(result);
    setGroupsCreated(true);
  };

  const handleStart = () => {
    navigate({ to: "/liveokt/$id/steg/$step", params: { id, step: "0" } });
  };

  if (isPending) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-muted-foreground">Laster...</p>
      </div>
    );
  }

  if (!fagprat) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-muted-foreground">FagPrat ikke funnet.</p>
      </div>
    );
  }

  const showGroupButton = groupsEnabled && !groupsCreated;
  const showStartButton = !groupsEnabled || groupsCreated;

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <SessionTopBar title={fagprat.title}>
        {showGroupButton && (
          <button
            onClick={handleCreateGroups}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-bold text-white shadow-[0_3px_0_oklch(0.4_0.15_280)] transition-all hover:-translate-y-px hover:shadow-[0_4px_0_oklch(0.4_0.15_280)] active:translate-y-0.5 active:shadow-[0_1px_0_oklch(0.4_0.15_280)]"
          >
            <Users className="size-4" />
            Opprett grupper
          </button>
        )}
        {showStartButton && (
          <button
            onClick={handleStart}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-400 px-5 py-2 text-sm font-bold text-white shadow-[0_3px_0_theme(colors.teal.700)] transition-all hover:-translate-y-px hover:bg-teal-300 hover:shadow-[0_4px_0_theme(colors.teal.700)] active:translate-y-0.5 active:shadow-[0_1px_0_theme(colors.teal.700)]"
          >
            Start aktiviteten
          </button>
        )}
      </SessionTopBar>

      {/* Main content */}
      <div className="flex flex-1 pt-16">
        {/* Left: Join panel */}
        <div className="flex w-[38%] min-w-[340px] max-w-[480px] flex-col items-center justify-center gap-4 border-r border-border bg-card p-8">
          <img src="/logo.png" alt="Evalion" className="mb-2 h-10 object-contain" />

          <p className="text-sm text-muted-foreground">www.evalion.no/delta</p>

          <p className="text-sm font-semibold text-muted-foreground">
            Skriv inn koden for å bli med:
          </p>

          {/* Game code */}
          <div className="rounded-xl border-2 border-primary/30 bg-primary/5 px-8 py-4">
            <span className="font-mono text-4xl font-bold tracking-[0.25em] text-primary">
              UBD2TS
            </span>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">Eller skann</p>

          {/* QR placeholder */}
          <div className="flex size-40 items-center justify-center rounded-xl border-2 border-dashed border-primary/30 bg-primary/5">
            <span className="text-sm text-primary/60">QR-kode</span>
          </div>
        </div>

        {/* Right: Students panel */}
        <div className="flex flex-1 flex-col">
          <div className="flex-1 overflow-y-auto p-6">
            {groups === null ? (
              /* Ungrouped view */
              <div className="flex flex-wrap content-start gap-3">
                {students.map((student) => (
                  <div
                    key={student.name}
                    className="flex items-center gap-2 rounded-xl border-[1.5px] border-border bg-card p-2 pr-3 shadow-xs"
                  >
                    <div
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white",
                        student.color,
                      )}
                    >
                      {student.name[0]}
                    </div>
                    <span className="text-sm font-bold text-foreground">{student.name}</span>
                    <button
                      onClick={() => removeStudent(student.name)}
                      className="ml-1 rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              /* Grouped view */
              <div className="flex flex-wrap gap-4">
                {groups.map((group, gi) => (
                  <div
                    key={gi}
                    className="w-[180px]"
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
                        <div key={student.name} className="flex items-center gap-2">
                          <div
                            className={cn(
                              "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white",
                              student.color,
                            )}
                          >
                            {student.name[0]}
                          </div>
                          <span className="text-sm font-semibold text-foreground">
                            {student.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <style>{`
                  @keyframes groupFadeIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                  }
                `}</style>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex shrink-0 items-center justify-between border-t border-border px-6 py-3">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              Venter på at elever kobler til
              <WaitingDots />
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
              <Users className="size-4" />
              {students.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
