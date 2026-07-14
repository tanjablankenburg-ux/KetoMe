import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "./components/BottomNav";
import SwRegister from "./components/SwRegister";
import SplashScreen from "./components/SplashScreen";
import FotoReset from "./components/FotoReset";
import CloudSync from "./components/CloudSync";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "VitaKeto by Carbbye",
  description: "Deine persönliche Keto & Low Carb App",
  manifest: "/manifest.json",
  themeColor: "#22c55e",
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

