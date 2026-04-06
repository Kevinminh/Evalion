import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import { useCopyToClipboard } from "@workspace/ui/hooks/use-copy-to-clipboard";
import { ArrowRight, Check, Copy } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface LaunchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  analyticsUrl: string;
  onGoToSession: () => void;
}

/**
 * Confirmation dialog shown after a teacher creates a live session.
 * Shows a QR code linking to the analytics view on a second device.
 */
export function LaunchModal({ open, onOpenChange, analyticsUrl, onGoToSession }: LaunchModalProps) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Liveøkt opprettet!</AlertDialogTitle>
          <AlertDialogDescription>
            Skann QR-koden for å se sanntidsanalyse på en annen enhet (f.eks. mobil eller nettbrett).
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="rounded-xl border bg-white p-4">
            <QRCodeSVG value={analyticsUrl} size={200} />
          </div>
          <button
            onClick={() => copy(analyticsUrl)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted"
          >
            {copied ? <Check className="size-3 text-sant" /> : <Copy className="size-3" />}
            {copied ? "Kopiert!" : "Kopier analytics-URL"}
          </button>
        </div>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onGoToSession}>
            Gå til liveøkt
            <ArrowRight className="size-4" />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
