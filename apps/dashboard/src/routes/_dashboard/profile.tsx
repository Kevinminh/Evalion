import { createFileRoute } from "@tanstack/react-router";
import { ProfileContactCard } from "@workspace/ui/components/profile-contact-card";
import {
  ProfileInfoCard,
  type ProfileInfoCardProps,
} from "@workspace/ui/components/profile-info-card";
import {
  ProfileLegalCard,
  type ProfileLegalLink,
} from "@workspace/ui/components/profile-legal-card";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";
import { CONTACT_EMAIL, OM_EVALION_URL, PERSONVERN_URL } from "@/lib/external-links";

export const Route = createFileRoute("/_dashboard/profile")({
  component: ProfilePage,
});

const legalLinks: ProfileLegalLink[] = [
  { label: "Personvern og vilkår", href: PERSONVERN_URL, external: true },
  { label: "Om Evalion", href: OM_EVALION_URL, external: true },
];

function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const handleSave: ProfileInfoCardProps["onSave"] = async ({ name }) => {
    setIsSaving(true);
    setErrorMessage(undefined);
    try {
      const { error } = await authClient.updateUser({ name });
      if (error) {
        const message = error.message ?? "Kunne ikke lagre. Prøv igjen.";
        setErrorMessage(message);
        throw new Error(message);
      }
    } catch (err) {
      if (!errorMessage) {
        setErrorMessage(err instanceof Error ? err.message : "Kunne ikke lagre. Prøv igjen.");
      }
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  if (isPending || !session?.user) {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <p className="text-sm text-muted-foreground">Laster…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-semibold">Min profil</h1>
        <p className="text-sm text-muted-foreground">Administrer kontoinformasjonen din.</p>
      </header>

      <ProfileInfoCard
        name={session.user.name ?? ""}
        email={session.user.email ?? ""}
        imageUrl={session.user.image}
        isSaving={isSaving}
        errorMessage={errorMessage}
        onSave={handleSave}
      />

      <ProfileLegalCard links={legalLinks} />

      <ProfileContactCard email={CONTACT_EMAIL} />
    </div>
  );
}
