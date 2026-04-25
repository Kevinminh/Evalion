import type { Metadata } from "next";

import "@workspace/ui/styles/lag-pastander.css";

import { Workspace } from "./workspace";

export const metadata: Metadata = {
  title: "Lag påstander",
  description: "AI-drevet påstandsgenerator for klasseromssamtaler.",
  robots: { index: false, follow: false },
};

export default function LagPastanderPage() {
  return <Workspace />;
}
