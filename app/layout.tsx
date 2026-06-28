import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "./components/BottomNav";

export const metadata: Metadata = {
  title: "KetoMe by Carbbye",
  description: "Deine persönliche Keto & Low Carb App",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="min-h-screen pb-20" style={{ backgroundColor: "#0a0a0a", color: "#f5f5f5" }}>
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
