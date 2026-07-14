import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "./components/BottomNav";
import SwRegister from "./components/SwRegister";
import SplashScreen from "./components/SplashScreen";
import FotoReset from "./components/FotoReset";
import CloudSync from "./components/CloudSync";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "VitaKeto – Kostenlose Keto App auf Deutsch | Keto & Low Carb tracken",
  description: "VitaKeto ist die kostenlose Keto-App für Einsteiger & Fortgeschrittene. Mahlzeiten tracken, Keto-Rezepte, Intervallfasten-Timer, Gewicht verfolgen & Keto-Wissen – alles gratis auf Deutsch!",
  manifest: "/manifest.json",
  themeColor: "#22c55e",
  keywords: ["keto app", "keto app deutsch", "kostenlose keto app", "low carb app", "keto tracker", "ketose", "ketogene ernährung app", "intervallfasten app", "keto rezepte", "keto anfänger", "vitaketo", "carbbye"],
  authors: [{ name: "Carbbye", url: "https://carbbye.de" }],
  openGraph: {
    title: "VitaKeto – Deine kostenlose Keto App auf Deutsch",
    description: "Mahlzeiten tracken, Keto-Rezepte entdecken, Gewicht verfolgen & Intervallfasten – alles gratis. Die Keto-App die wirklich einfach zu bedienen ist.",
    url: "https://www.vitaketo.app",
    siteName: "VitaKeto",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "VitaKeto – Kostenlose Keto App",
    description: "Keto & Low Carb tracken, Intervallfasten, Rezepte – kostenlos auf Deutsch.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.vitaketo.app",
  },
  verification: {
    google: "Nxpg99o2GvJO-t3OOx2YVR5qgZgWkdDuwpDoq76KgkI",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "VitaKeto",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="min-h-screen pb-20" style={{ backgroundColor: "#080b08", color: "#f0f4f0" }}>
        <SplashScreen />
        <FotoReset />
        <CloudSync />
        {children}
        <BottomNav />
        <SwRegister />
        <Analytics />
      </body>
    </html>
  );
}

