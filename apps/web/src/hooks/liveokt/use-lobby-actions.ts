import { useNavigate } from "@tanstack/react-router";
import { liveSessionsMutations } from "@workspace/api/liveSessions";
import { sessionStudentsMutations } from "@workspace/api/sessionStudents";
import type { Id } from "@workspace/api/types";
import { useMutation } from "convex/react";
import { toast } from "sonner";

import { DASHBOARD_URL } from "@/lib/env";

interface LobbyActionsArgs {
  sessionId: Id<"liveSessions">;
  groupCount: number;
}

export function useLobbyActions({ sessionId, groupCount }: LobbyActionsArgs) {
  const navigate = useNavigate();
  const removeStudentMutation = useMutation(sessionStudentsMutations.remove);
  const createGroupsMutation = useMutation(sessionStudentsMutations.createGroups);
  const clearGroupsMutation = useMutation(sessionStudentsMutations.clearGroups);
  const updateStepMutation = useMutation(liveSessionsMutations.updateStep);
  const endSessionMutation = useMutation(liveSessionsMutations.end);

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

  const clearGroups = async () => {
    try {
      await clearGroupsMutation({ sessionId });
    } catch {
      toast.error("Kunne ikke slette grupper. Prøv igjen.");
    }
  };

  const removeStudent = (id: Id<"sessionStudents">) => removeStudentMutation({ id });

  return { start, end, createGroups, clearGroups, removeStudent };
}
