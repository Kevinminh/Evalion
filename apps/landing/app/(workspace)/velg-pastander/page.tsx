import type { Metadata } from "next";
import { Suspense } from "react";

import { SelectionView } from "./selection-view";

export const metadata: Metadata = {
  title: "Velg påstander",
  description: "Velg de AI-genererte påstandene du vil legge til i samlingen din.",
  robots: { index: false, follow: false },
};

export default function VelgPastanderPage() {
  return (
    <Suspense fallback={null}>
      <SelectionView />
    </Suspense>
  );
}
