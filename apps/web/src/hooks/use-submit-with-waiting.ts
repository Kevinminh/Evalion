import { useCallback, useState } from "react";
import { toast } from "sonner";

interface Options {
  errorMessage: string;
  delayMs?: number;
}

export function useSubmitWithWaiting<TArgs extends unknown[]>(
  mutationFn: (...args: TArgs) => Promise<unknown>,
  options: Options,
) {
  const [sent, setSent] = useState(false);
  const [showWaiting, setShowWaiting] = useState(false);
  const { errorMessage, delayMs = 500 } = options;

  const handleSubmit = useCallback(
    async (...args: TArgs) => {
      setSent(true);
      try {
        await mutationFn(...args);
        setTimeout(() => setShowWaiting(true), delayMs);
      } catch {
        setSent(false);
        toast.error(errorMessage);
      }
    },
    [mutationFn, errorMessage, delayMs],
  );

  return { sent, showWaiting, handleSubmit } as const;
}
