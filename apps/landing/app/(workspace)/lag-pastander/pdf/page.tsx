import type { Metadata } from "next";

import { PdfExport } from "../pdf-export";

export const metadata: Metadata = {
  title: "Lag PDF",
  description: "Lag en utskriftsklar PDF av påstandene dine.",
  robots: { index: false, follow: false },
};

export default function LagPastanderPdfPage() {
  return <PdfExport />;
}
