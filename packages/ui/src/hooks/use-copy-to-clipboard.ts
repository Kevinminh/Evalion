import { useCallback, useRef, useState, useEffect } from "react";

const DEFAULT_RESET_MS = 2000;

/**
 * Copies a string to the clipboard and flips `copied` to true for a
 * short window so callers can show "Kopiert!" feedback.
 *
 * Usage:
 *   const { copied, copy } = useCopyToClipboard();
 *   <button onClick={() => copy(url)}>{copied ? "Kopiert!" : "Kopier"}</button>
 */
export function useCopyToClipboard(resetMs: number = DEFAULT_RESET_MS) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setCopied(false), resetMs);
      } catch {
        setCopied(false);
      }
    },
    [resetMs],
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { copied, copy };
}
