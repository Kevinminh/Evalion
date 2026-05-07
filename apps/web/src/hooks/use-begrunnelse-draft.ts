import { useCallback, useEffect, useState } from "react";

import type { Id } from "@/lib/convex";

export function useBegrunnelseDraft(
  sessionId: Id<"liveSessions"> | undefined,
  studentId: Id<"sessionStudents">,
  statementIndex: number,
) {
  const draftKey = sessionId
    ? `begrunnelse:${sessionId}:${studentId}:${statementIndex}`
    : null;

  const [text, setText] = useState("");

  useEffect(() => {
    if (!draftKey) return;
    try {
      setText(localStorage.getItem(draftKey) ?? "");
    } catch {
      setText("");
    }
  }, [draftKey]);

  useEffect(() => {
    if (!draftKey) return;
    try {
      if (text) {
        localStorage.setItem(draftKey, text);
      } else {
        localStorage.removeItem(draftKey);
      }
    } catch {
      /* localStorage unavailable */
    }
  }, [draftKey, text]);

  const clear = useCallback(() => {
    setText("");
    if (draftKey) {
      try {
        localStorage.removeItem(draftKey);
      } catch {
        /* localStorage unavailable */
      }
    }
  }, [draftKey]);

  return { text, setText, clear };
}
