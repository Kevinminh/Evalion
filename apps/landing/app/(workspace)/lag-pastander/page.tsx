import type { Metadata } from "next";

import { Workspace } from "./workspace";

import "./styles.css";

export const metadata: Metadata = {
  title: "Lag påstander",
  description: "AI-drevet påstandsgenerator for klasseromssamtaler.",
  robots: { index: false, follow: false },
};

export default function LagPastanderPage() {
  return <Workspace />;
}
