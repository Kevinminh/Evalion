import type { Metadata } from "next";

import { ProfileClient } from "./profile-client";

export const metadata: Metadata = {
  title: "Min profil",
  description: "Se og endre informasjonen din.",
  robots: { index: false, follow: false },
};

export default function ProfilePage() {
  return <ProfileClient />;
}
