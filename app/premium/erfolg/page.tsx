"use client";
import { useEffect } from "react";
import Link from "next/link";

export default function PremiumErfolgPage() {
  useEffect(() => {
    // Sync-Flag löschen damit CloudSync Premium-Status vom Server lädt
    sessionStorage.removeItem("ketome_sync_done");
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ backgroundColor: "#0a0a0a" }}>
      <div className="text-6xl mb-4">🎉</div>
      <h1 className="text-2xl font-black mb-2">Willkommen bei Premium!</h1>
      <p className="text-sm mb-8" style={{ color: "#555" }}>
        Dein Zugang wird gerade aktiviert — das dauert nur einen Moment.
      </p>
      <div className="rounded-2xl p-5 mb-8 w-full max-w-sm" style={{ backgroundColor: "#0d1a0d", border: "1px solid #22c55e33" }}>
        <div className="text-sm font-bold mb-3" style={{ color: "#22c55e" }}>Jetzt freigeschaltet:</div>
        <ul className="space-y-2 text-sm text-left" style={{ color: "#aaa" }}>
          <li>✓ Rezeptwerkstatt</li>
          <li>✓ Wochenplan</li>
          <li>✓ Cloud-Sync</li>
          <li>✓ Körpermaße & 30 Fotos/Monat</li>
          <li>✓ Export PDF & CSV</li>
        </ul>
      </div>
      <Link href="/"
        className="w-full max-w-sm py-4 rounded-2xl font-bold text-black text-base text-center block"
        style={{ backgroundColor: "#22c55e" }}>
        Los geht's →
      </Link>
    </main>
  );
}
