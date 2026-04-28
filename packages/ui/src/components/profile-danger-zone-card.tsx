"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Field, FieldDescription, FieldError, FieldLabel } from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import { cn } from "@workspace/ui/lib/utils";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export type ProfileDangerZoneCardProps = {
  email: string;
  isDeleting?: boolean;
  errorMessage?: string;
  onConfirmDelete: () => void | Promise<void>;
  className?: string;
};

function ProfileDangerZoneCard({
  email,
  isDeleting = false,
  errorMessage,
  onConfirmDelete,
  className,
}: ProfileDangerZoneCardProps) {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  useEffect(() => {
    if (!open) {
      setConfirmText("");
    }
  }, [open]);

  const normalizedInput = confirmText.trim().toLowerCase();
  const normalizedEmail = email.trim().toLowerCase();
  const matches = normalizedInput.length > 0 && normalizedInput === normalizedEmail;
  const showMismatch = normalizedInput.length > 0 && !matches;

  const handleOpenChange = (next: boolean) => {
    if (isDeleting) return;
    setOpen(next);
  };

  return (
    <Card className={cn("gap-4 border-destructive/30", className)}>
      <CardHeader>
        <CardTitle>Slett konto</CardTitle>
        <CardDescription>
          Slett kontoen din permanent. Alle dine FagPrat, liveøkter og data fjernes. Denne
          handlingen kan ikke angres.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={() => setOpen(true)}
        >
          Slett konto
        </Button>
        <AlertDialog open={open} onOpenChange={handleOpenChange}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Er du sikker på at du vil slette kontoen?</AlertDialogTitle>
              <AlertDialogDescription>
                Denne handlingen kan ikke angres. Alle dine FagPrat, liveøkter og data slettes
                permanent.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <Field>
              <FieldLabel htmlFor="profile-danger-zone-confirm">
                Skriv inn e-postadressen din for å bekrefte
              </FieldLabel>
              <Input
                id="profile-danger-zone-confirm"
                value={confirmText}
                onChange={(event) => setConfirmText(event.target.value)}
                disabled={isDeleting}
                autoComplete="off"
                aria-invalid={showMismatch}
              />
              <FieldDescription>{email}</FieldDescription>
            </Field>

            {errorMessage ? <FieldError>{errorMessage}</FieldError> : null}

            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Avbryt</AlertDialogCancel>
              <Button
                type="button"
                variant="destructive"
                onClick={onConfirmDelete}
                disabled={!matches || isDeleting}
              >
                {isDeleting ? <Loader2 className="size-4 animate-spin" /> : null}
                {isDeleting ? "Sletter…" : "Slett kontoen min"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}

export { ProfileDangerZoneCard };
