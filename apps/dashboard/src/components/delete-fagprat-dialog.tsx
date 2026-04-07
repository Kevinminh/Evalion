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
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteFagPratDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  onConfirm: () => void | Promise<void>;
  stopPropagation?: boolean;
}

export function DeleteFagPratDialog({
  open,
  onOpenChange,
  title,
  onConfirm,
  stopPropagation = false,
}: DeleteFagPratDialogProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onConfirm();
    } catch {
      toast.error("Kunne ikke slette FagPraten. Prøv igjen.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={deleting ? undefined : onOpenChange}>
      <AlertDialogContent onClick={stopPropagation ? (e) => e.stopPropagation() : undefined}>
        <AlertDialogHeader>
          <AlertDialogTitle>Er du sikker?</AlertDialogTitle>
          <AlertDialogDescription>
            Denne handlingen kan ikke angres. FagPraten &ldquo;{title}&rdquo; vil bli
            permanent slettet.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Avbryt</AlertDialogCancel>
          <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
            {deleting && <Loader2 className="size-4 animate-spin" />}
            {deleting ? "Sletter..." : "Slett"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
