"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
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
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";

export type ProfileInfoCardProps = {
  name: string;
  email: string;
  imageUrl?: string | null;
  isSaving?: boolean;
  errorMessage?: string;
  onSave: (next: { name: string }) => void | Promise<void>;
  className?: string;
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function ProfileInfoCard({
  name,
  email,
  imageUrl,
  isSaving = false,
  errorMessage,
  onSave,
  className,
}: ProfileInfoCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(name);

  useEffect(() => {
    if (!isEditing) {
      setDraftName(name);
    }
  }, [name, isEditing]);

  const trimmed = draftName.trim();
  const isUnchanged = trimmed === name.trim();
  const isInvalid = trimmed.length === 0;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isInvalid || isUnchanged) return;
    await onSave({ name: trimmed });
    setIsEditing(false);
  };

  return (
    <Card className={cn("gap-6", className)}>
      <CardHeader className="flex-row items-center gap-4 space-y-0">
        <Avatar size="lg">
          {imageUrl ? <AvatarImage src={imageUrl} alt={name} /> : null}
          <AvatarFallback className="bg-primary text-primary-foreground font-extrabold">
            {getInitials(name) || "?"}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <CardTitle>{name}</CardTitle>
          <CardDescription>{email}</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="px-0">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field>
              <FieldLabel htmlFor="profile-name">Navn</FieldLabel>
              <Input
                id="profile-name"
                value={draftName}
                onChange={(event) => setDraftName(event.target.value)}
                autoFocus
                disabled={isSaving}
                aria-invalid={isInvalid}
              />
              {isInvalid ? <FieldError>Navn kan ikke være tomt.</FieldError> : null}
            </Field>

            <Field>
              <FieldLabel htmlFor="profile-email">E-post</FieldLabel>
              <Input id="profile-email" value={email} disabled readOnly />
              <FieldDescription>E-post kan ikke endres her.</FieldDescription>
            </Field>

            {errorMessage ? <FieldError>{errorMessage}</FieldError> : null}

            <div className="flex gap-2">
              <Button type="submit" size="sm" disabled={isSaving || isInvalid || isUnchanged}>
                {isSaving ? "Lagrer…" : "Lagre"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setDraftName(name);
                  setIsEditing(false);
                }}
                disabled={isSaving}
              >
                Avbryt
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-4">
            <Field>
              <FieldLabel>Navn</FieldLabel>
              <p className="text-sm text-foreground">{name}</p>
            </Field>
            <Field>
              <FieldLabel>E-post</FieldLabel>
              <p className="text-sm text-foreground">{email}</p>
            </Field>
            <div>
              <Button type="button" variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Pencil />
                Endre navn
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { ProfileInfoCard };
