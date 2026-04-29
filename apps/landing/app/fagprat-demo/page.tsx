import type { Metadata } from "next";
import { FagpratDemoPage } from "./_components/fagprat-demo-page";

export const metadata: Metadata = {
  title: "FagPrat – demo",
  description:
    "Utforsk FagPrat-demoen direkte i nettleseren. Bytt mellom lærervisning, elevvisning og live-statistikk.",
  robots: { index: false, follow: true },
};

export default function Page() {
  return <FagpratDemoPage />;
}
