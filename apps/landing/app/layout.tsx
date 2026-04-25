import type { Metadata } from "next";

import { Providers } from "./components/providers";
import { getToken } from "./lib/auth-server";
import { SITE_URL } from "./lib/constants";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "CO-LAB – Gi alle elever en stemme",
    template: "%s | CO-LAB",
  },
  description:
    "CO-LAB gjør den faglige samtalen til en strukturert økt i seks steg. Fra påstand og anonym avstemning til pardiskusjon og oppsummering.",
  keywords: [
    "klassesamtale",
    "FagPrat",
    "lærer",
    "elev",
    "skole",
    "påstand",
    "didaktikk",
    "co-lab",
  ],
  authors: [{ name: "CO-LAB" }],
  creator: "CO-LAB AS",
  publisher: "CO-LAB AS",
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: SITE_URL,
    siteName: "CO-LAB",
    title: "CO-LAB – Gi alle elever en stemme",
    description:
      "Et lærerstyrt verktøy som gjør klassesamtalen engasjerende og tilgjengelig for alle elevene.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "CO-LAB" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CO-LAB – Gi alle elever en stemme",
    description:
      "Et lærerstyrt verktøy som gjør klassesamtalen engasjerende og tilgjengelig for alle elevene.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const token = await getToken();
  return (
    <html lang="nb">
      <body className="theme-co-lab antialiased">
        <Providers initialToken={token}>{children}</Providers>
      </body>
    </html>
  );
}
