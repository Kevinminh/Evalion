import { useCopyToClipboard } from "@workspace/ui/hooks/use-copy-to-clipboard";
import { Check, Copy } from "lucide-react";

interface CopyUrlButtonProps {
  url: string;
}

export function CopyUrlButton({ url }: CopyUrlButtonProps) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <button
      onClick={() => copy(url)}
      className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted"
    >
      {copied ? <Check className="size-3 text-sant" /> : <Copy className="size-3" />}
      {copied ? "Kopiert!" : "Kopier URL"}
    </button>
  );
}
