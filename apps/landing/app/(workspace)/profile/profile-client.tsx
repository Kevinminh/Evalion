"use client";

import { ProfileContactCard } from "@workspace/ui/components/profile-contact-card";
import {
  ProfileInfoCard,
  type ProfileInfoCardProps,
} from "@workspace/ui/components/profile-info-card";
import {
  ProfileLegalCard,
  type ProfileLegalLink,
} from "@workspace/ui/components/profile-legal-card";
import Link from "next/link";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";
import { CONTACT_EMAIL } from "@/lib/constants";

const legalLinks: ProfileLegalLink[] = [
  { label: "Personvern og vilkår", href: "/personvern-og-vilkar" },
  { label: "Om Evalion", href: "/teamet" },
];

export function ProfileClient() {
  const { data: session, isPending } = authClient.useSession();
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const handleSave: ProfileInfoCardProps["onSave"] = async ({ name }) => {
    setIsSaving(true);
    setErrorMessage(undefined);
    try {
      const { error } = await authClient.updateUser({ name });
      if (error) {
        setErrorMessage(error.message ?? "Kunne ikke lagre. Prøv igjen.");
        throw new Error(error.message);
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
      <main className="mx-auto w-full max-w-2xl px-6 py-10">
        <p className="text-sm text-muted-foreground">Laster…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-10">
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

      <ProfileLegalCard
        links={legalLinks}
        renderLink={(link, children) => <Link href={link.href}>{children}</Link>}
      />

      <ProfileContactCard email={CONTACT_EMAIL} />
    </main>
  );
}
