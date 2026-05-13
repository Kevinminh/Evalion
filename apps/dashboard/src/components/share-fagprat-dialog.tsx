// Backend for sharing is not designed yet — the URL rendered here is a placeholder
// based on LANDING_URL + fagprat id. Replace once the public viewer route lands.
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@workspace/ui/components/alert-dialog";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { useCopyToClipboard } from "@workspace/ui/hooks/use-copy-to-clipboard";
import { Check, Copy } from "lucide-react";

import { LANDING_URL } from "@/lib/env";
import type { FagPratId } from "@/lib/types";

interface ShareFagPratDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fagpratId: FagPratId;
  title: string;
  stopPropagation?: boolean;
}

export function ShareFagPratDialog({
  open,
  onOpenChange,
  fagpratId,
  title,
  stopPropagation = false,
}: ShareFagPratDialogProps) {
  const { copied, copy } = useCopyToClipboard();
  const url = `${LANDING_URL}/fagprat/${fagpratId}`;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent onClick={stopPropagation ? (e) => e.stopPropagation() : undefined}>
        <AlertDialogHeader>
          <AlertDialogTitle>Del FagPrat</AlertDialogTitle>
          <AlertDialogDescription>
            Kopier lenken og send den til de du vil dele &ldquo;{title}&rdquo; med.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex items-center gap-2">
          <Input
            type="text"
            value={url}
            readOnly
            onFocus={(e) => e.currentTarget.select()}
            aria-label="Delelenke"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={() => copy(url)}
            aria-label={copied ? "Kopiert" : "Kopier lenke"}
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? "Kopiert!" : "Kopier"}
          </Button>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Lukk</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
