import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { toast } from "sonner";

import { api } from "@/lib/convex";
import type { Id } from "@/lib/convex";
import { DASHBOARD_URL } from "@/lib/env";

interface LobbyActionsArgs {
  sessionId: Id<"liveSessions">;
  groupCount: number;
}

export function useLobbyActions({ sessionId, groupCount }: LobbyActionsArgs) {
  const navigate = useNavigate();
  const removeStudentMutation = useMutation(api.liveSessions.removeStudent);
  const createGroupsMutation = useMutation(api.liveSessions.createGroups);
  const updateStepMutation = useMutation(api.liveSessions.updateStep);
  const endSessionMutation = useMutation(api.liveSessions.end);

  const start = async () => {
    try {
      await updateStepMutation({ id: sessionId, step: 0 });
      await navigate({
        to: "/liveokt/$sessionId/steg/$step",
        params: { sessionId, step: "0" },
      });
    } catch {
      toast.error("Kunne ikke starte økten. Prøv igjen.");
    }
  };

  const end = async () => {
    try {
      await endSessionMutation({ id: sessionId });
      window.location.href = DASHBOARD_URL;
    } catch {
      toast.error("Kunne ikke avslutte økten. Prøv igjen.");
    }
  };

  const createGroups = async () => {
    try {
      await createGroupsMutation({ sessionId, groupCount });
    } catch {
      toast.error("Kunne ikke opprette grupper. Prøv igjen.");
    }
  };

  const removeStudent = (id: Id<"sessionStudents">) => removeStudentMutation({ id });

  return { start, end, createGroups, removeStudent };
}
