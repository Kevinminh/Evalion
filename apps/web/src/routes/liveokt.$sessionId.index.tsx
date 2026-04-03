import { useQuery, skipToken } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { cn } from "@workspace/ui/lib/utils";
import { SessionTopBar } from "@workspace/ui/components/live/session-top-bar";
import { useMutation } from "convex/react";
import { Users, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

import { api, fagpratQueries, liveSessionQueries } from "@/lib/convex";
import type { Id } from "@/lib/convex";

export const Route = createFileRoute("/liveokt/$sessionId/")({
  component: TeacherLobbyPage,
});

function WaitingDots() {
  return (
    <span className="ml-1 inline-flex gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-2.5 rounded-full bg-primary/40"
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

function TeacherLobbyPage() {
  const { sessionId } = Route.useParams();
  const navigate = useNavigate();
  const typedSessionId = sessionId as Id<"liveSessions">;

  const { data: session, isPending: sessionLoading } = useQuery(
    liveSessionQueries.getById(typedSessionId),
  );
  const { data: fagprat, isPending: fagpratLoading } = useQuery(
    session?.fagpratId
      ? fagpratQueries.getById(session.fagpratId)
      : { queryKey: ["fagprat", "none"], queryFn: skipToken },
  );
  const { data: students } = useQuery(liveSessionQueries.listStudents(typedSessionId));

  const removeStudentMutation = useMutation(api.liveSessions.removeStudent);
  const createGroupsMutation = useMutation(api.liveSessions.createGroups);
  const updateStepMutation = useMutation(api.liveSessions.updateStep);
  const endSessionMutation = useMutation(api.liveSessions.end);

  const isPending = sessionLoading || fagpratLoading;

  if (isPending) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-muted-foreground">Laster...</p>
      </div>
    );
  }

  if (!session || !fagprat) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-muted-foreground">Økt ikke funnet.</p>
      </div>
    );
  }

  const studentList = students ?? [];
  const hasGroups = studentList.some((s) => s.groupIndex !== undefined);
  const showGroupButton = session.groupsEnabled && !hasGroups;

  const handleCreateGroups = async () => {
    await createGroupsMutation({
      sessionId: session._id,
      groupCount: session.groupCount,
    });
  };

  const dashboardUrl = import.meta.env.DEV ? "http://localhost:3001" : "https://dashboard.evalion.no";

  const handleEnd = async () => {
    await endSessionMutation({ id: session._id });
    window.location.href = dashboardUrl;
  };

  const handleStart = async () => {
    await updateStepMutation({ id: session._id, step: 0 });
    navigate({
      to: "/liveokt/$sessionId/steg/$step",
      params: { sessionId, step: "0" },
    });
  };

  const joinUrl = `${window.location.origin}/delta?code=${session.joinCode}`;

  const groupedStudents = hasGroups
    ? Array.from({ length: session.groupCount }, (_, gi) =>
        studentList.filter((s) => s.groupIndex === gi),
      )
    : null;

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
        <button
          onClick={handleStart}
          className="inline-flex items-center gap-2 rounded-xl bg-sant px-5 py-2 text-sm font-bold text-white shadow-[0_3px_0_oklch(0.45_0.14_142)] transition-all hover:-translate-y-0.5 hover:shadow-[0_5px_0_oklch(0.45_0.14_142)] active:translate-y-0.5 active:shadow-[0_1px_0_oklch(0.45_0.14_142)]"
        >
          Start aktiviteten
        </button>
        <a
          href={dashboardUrl}
          className="inline-flex items-center gap-2 rounded-xl border-2 border-border px-4 py-2 text-sm font-bold text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
        >
          Gå til dashboard
        </a>
        <button
          onClick={handleEnd}
          className="inline-flex items-center gap-2 rounded-xl bg-destructive px-5 py-2 text-sm font-bold text-white shadow-[0_3px_0_oklch(0.45_0.15_25)] transition-all hover:-translate-y-px hover:shadow-[0_4px_0_oklch(0.45_0.15_25)] active:translate-y-0.5 active:shadow-[0_1px_0_oklch(0.45_0.15_25)]"
        >
          Avslutt
        </button>
      </SessionTopBar>

      <div className="flex flex-1 pt-16">
        <div className="m-4 flex w-[38%] min-w-[340px] max-w-[480px] flex-col items-center justify-center gap-4 rounded-2xl bg-card p-8 shadow-lg">
          <img src="/logo.png" alt="Evalion" className="mb-2 h-16 object-contain" />
          <p className="text-sm text-muted-foreground">{window.location.host}/delta</p>
          <p className="text-sm font-semibold text-muted-foreground">
            Skriv inn koden for å bli med:
          </p>
          <div className="rounded-xl border-2 border-primary/30 bg-primary/5 px-8 py-4">
            <span className="font-mono text-4xl font-bold tracking-[0.25em] text-primary">
              {session.joinCode}
            </span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">Eller skann</p>
          <div className="rounded-xl bg-white p-3">
            <QRCodeSVG value={joinUrl} size={130} />
          </div>
        </div>

        <div className="flex flex-1 flex-col">
          <div className="flex-1 overflow-y-auto p-6">
            {groupedStudents === null ? (
              <div className="flex flex-wrap content-start gap-3">
                {studentList.map((student) => (
                  <div
                    key={student._id}
                    className="flex items-center gap-2 rounded-xl border-[1.5px] border-border bg-card p-2 pr-3 shadow-xs"
                    style={{ animation: "cardIn 0.3s ease" }}
                  >
                    <div
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white",
                        student.avatarColor,
                      )}
                    >
                      {student.name[0]}
                    </div>
                    <span className="text-sm font-bold text-foreground">{student.name}</span>
                    <button
                      onClick={() => removeStudentMutation({ id: student._id })}
                      className="ml-1 rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-4">
                {groupedStudents.map((group, gi) => (
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
                        <div key={student._id} className="flex items-center gap-2">
                          <div
                            className={cn(
                              "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white",
                              student.avatarColor,
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
              </div>
            )}
          </div>

          <div className="flex shrink-0 items-center justify-between border-t border-border px-6 py-3">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              Venter på at elever kobler til
              <WaitingDots />
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
              <Users className="size-4" />
              {studentList.length}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: scale(0.9) translateY(4px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes groupFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
