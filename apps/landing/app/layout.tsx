import type { Metadata } from "next";

import { Footer } from "./components/footer";
import { Header } from "./components/header";
import { SITE_URL } from "./lib/constants";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Evalion – Morsomme læringsspill for lærere og elever",
    template: "%s | Evalion",
  },
  description:
    "Evalion er en gratis plattform for læringsbaserte spill. Lag spørsmål, spill med elevene, og få umiddelbar tilbakemelding.",
  keywords: [
    "læringsspill",
    "klasserom",
    "quiz",
    "skole",
    "lærer",
    "elev",
    "utdanning",
    "gamification",
    "evalion",
  ],
  authors: [{ name: "Evalion" }],
  creator: "Evalion",
  publisher: "Evalion",
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: SITE_URL,
    siteName: "Evalion",
    title: "Evalion – Morsomme læringsspill for lærere og elever",
    description:
      "Evalion er en gratis plattform for læringsbaserte spill. Lag spørsmål, spill med elevene, og få umiddelbar tilbakemelding.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Evalion" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Evalion – Morsomme læringsspill for lærere og elever",
    description: "Evalion er en gratis plattform for læringsbaserte spill.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no">
      <body>
        <div className="min-h-svh bg-white text-foreground">
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
