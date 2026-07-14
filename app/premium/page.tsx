"use client";
import { useState } from "react";
import Link from "next/link";
import { testFreischalten } from "@/lib/kiGuthaben";

const FEATURES_FREE = [
  "Kalorien & Makros tracken",
  "Lebensmitteldatenbank",
  "Keto-Streak",
  "Täglicher Energie-Check",
  "Gewicht eintragen",
  "Rezepte ansehen",
];

const FEATURES_PREMIUM = [
  "Alles aus Kostenlos",
  "🤖 KI-Coach (100 Anfragen/Monat)",
  "📸 Rezept-Foto & Kühlschrank-Scanner",
  "🧪 Rezeptwerkstatt",
  "📅 Wochenplan",
  "☁️ Cloud-Sync (alle Geräte)",
  "📏 Körpermaße & Fotos (30/Monat)",
  "📤 Export PDF & CSV",
  "Unbegrenzte Einträge",
  "Neue Features zuerst",
];

export default function PremiumPage() {
  const [laden, setLaden] = useState<string | null>(null);
  const [fehler, setFehler] = useState<string | null>(null);
  const [trialGenutzt] = useState(() =>
    typeof window !== "undefined" && localStorage.getItem("ketome_trial_genutzt") === "true"
  );
  const [trialAktiv, setTrialAktiv] = useState(false);

  function trialStarten() {
    const ok = testFreischalten();
    if (ok) setTrialAktiv(true);
  }

  async function kaufen(typ: string) {
    setLaden(typ);
    setFehler(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ typ }),
      });
      const data = await res.json();
      if (data.fehler) { setFehler(data.fehler); setLaden(null); return; }
      window.location.href = data.url;
    } catch {
      setFehler("Verbindungsfehler — bitte nochmal versuchen.");
      setLaden(null);
    }
  }

  return (
    <main className="min-h-screen px-4 py-6 pb-28" style={{ backgroundColor: "#0a0a0a" }}>
      <Link href="/" className="text-xs mb-6 inline-block" style={{ color: "#555" }}>← Zurück</Link>

      <div className="text-center mb-8">
        <div className="text-4xl mb-2">⭐</div>
        <h1 className="text-2xl font-black mb-1">VitaKeto Premium</h1>
        <p className="text-sm" style={{ color: "#555" }}>
          Keto ernstnehmen — mit allen Werkzeugen die du brauchst.
        </p>
      </div>

      {/* Trial */}
      {trialAktiv ? (
        <div className="rounded-2xl p-4 mb-6 text-center" style={{ backgroundColor: "#0d2018", border: "1px solid #22c55e" }}>
          <div className="text-2xl mb-2">🎉</div>
          <div className="font-bold mb-1" style={{ color: "#22c55e" }}>Premium aktiv — viel Spaß!</div>
          <div className="text-xs" style={{ color: "#3a6a3a" }}>3 Tage Premium + 30 KI-Anfragen freigeschaltet.</div>
          <Link href="/" className="mt-3 inline-block text-sm font-bold" style={{ color: "#22c55e" }}>Zur App →</Link>
        </div>
      ) : (
        <div className="rounded-2xl p-4 mb-6" style={{ backgroundColor: "#0d1a0d", border: "1px solid #22c55e33" }}>
          <div className="text-sm font-bold mb-1 text-center" style={{ color: "#22c55e" }}>🎁 3 Tage kostenlos testen</div>
          <div className="text-xs text-center mb-3" style={{ color: "#3a6a3a" }}>
            Alle Premium-Funktionen + 30 KI-Anfragen — ohne Kreditkarte.
          </div>
          {trialGenutzt ? (
            <div className="text-xs text-center" style={{ color: "#555" }}>Du hast den Testzeitraum bereits genutzt.</div>
          ) : (
            <button onClick={trialStarten}
              className="w-full py-3 rounded-xl font-bold text-sm"
              style={{ backgroundColor: "#22c55e22", color: "#22c55e", border: "1px solid #22c55e44" }}>
              Jetzt kostenlos testen
            </button>
          )}
        </div>
      )}

      {/* Preiskarten */}
      <div className="space-y-3 mb-6">

        {/* Monatlich */}
        <div className="rounded-2xl p-5" style={{ backgroundColor: "#111", border: "1px solid #333" }}>
          <div className="flex items-center justify-between mb-1">
            <div className="font-black text-lg">5,99 €</div>
            <div className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: "#1a1a1a", color: "#888" }}>pro Monat</div>
          </div>
          <div className="text-xs mb-4" style={{ color: "#555" }}>Monatlich kündbar · keine Mindestlaufzeit</div>
          <button onClick={() => kaufen("monatlich")} disabled={!!laden}
            className="w-full py-3.5 rounded-xl font-bold text-sm"
            style={{ backgroundColor: laden === "monatlich" ? "#166534" : "#22c55e", color: "#000" }}>
            {laden === "monatlich" ? "⏳ Weiterleitung…" : "Monatlich starten"}
          </button>
        </div>

        {/* Jährlich */}
        <div className="rounded-2xl p-5" style={{ backgroundColor: "#0d1a0d", border: "2px solid #22c55e44" }}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-baseline gap-2">
              <div className="font-black text-lg">49,99 €</div>
              <div className="text-xs line-through" style={{ color: "#444" }}>71,88 €</div>
            </div>
            <div className="text-xs px-2 py-1 rounded-full font-bold" style={{ backgroundColor: "#22c55e22", color: "#22c55e" }}>
              pro Jahr · spare 30%
            </div>
          </div>
          <div className="text-xs mb-4" style={{ color: "#3a6a3a" }}>= 4,17 €/Monat · einmal jährlich</div>
          <button onClick={() => kaufen("jaehrlich")} disabled={!!laden}
            className="w-full py-3.5 rounded-xl font-bold text-sm"
            style={{ backgroundColor: laden === "jaehrlich" ? "#166534" : "#22c55e", color: "#000" }}>
            {laden === "jaehrlich" ? "⏳ Weiterleitung…" : "Jährlich starten — bestes Angebot"}
          </button>
        </div>
      </div>

      {fehler && (
        <div className="rounded-xl p-3 text-sm text-center mb-4" style={{ backgroundColor: "#1a0a0a", color: "#ef4444" }}>
          {fehler}
        </div>
      )}

      {/* Feature-Vergleich */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="rounded-2xl p-4" style={{ backgroundColor: "#111" }}>
          <div className="text-xs font-bold mb-3" style={{ color: "#555" }}>KOSTENLOS</div>
          <ul className="space-y-2">
            {FEATURES_FREE.map(f => (
              <li key={f} className="flex items-start gap-2 text-xs" style={{ color: "#666" }}>
                <span style={{ color: "#333" }}>✓</span> {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl p-4" style={{ backgroundColor: "#0d1a0d", border: "1px solid #22c55e22" }}>
          <div className="text-xs font-bold mb-3" style={{ color: "#22c55e" }}>PREMIUM</div>
          <ul className="space-y-2">
            {FEATURES_PREMIUM.map(f => (
              <li key={f} className="flex items-start gap-2 text-xs" style={{ color: "#aaa" }}>
                <span style={{ color: "#22c55e" }}>✓</span> {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Foto-Paket */}
      <div className="rounded-2xl p-4 mb-6" style={{ backgroundColor: "#111", border: "1px solid #2a2a2a" }}>
        <div className="flex items-center justify-between mb-1">
          <div className="text-sm font-bold">📸 Zusatz-Fotos</div>
          <div className="font-black">1,49 €</div>
        </div>
        <p className="text-xs mb-3" style={{ color: "#555" }}>
          10 weitere Fotos — einmalig, kein Abo. Nur für Premium-Nutzer.
          Inklusive sind bereits 30 Fotos pro Monat.
        </p>
        <button onClick={() => kaufen("foto_paket")} disabled={!!laden}
          className="w-full py-3 rounded-xl font-bold text-sm"
          style={{ backgroundColor: "#1a1a1a", color: "#888", border: "1px solid #333" }}>
          {laden === "foto_paket" ? "⏳ Weiterleitung…" : "10 Fotos kaufen"}
        </button>
      </div>

      {/* Rechtliches */}
      <div className="text-center space-y-1 mb-6">
        <p className="text-xs" style={{ color: "#333" }}>
          Zahlung sicher über Stripe · SSL-verschlüsselt
        </p>
        <p className="text-xs" style={{ color: "#333" }}>
          Abonnement jederzeit kündbar · kein Vertrag
        </p>
        <Link href="/agb" className="text-xs underline" style={{ color: "#333" }}>AGB & Datenschutz</Link>
      </div>
    </main>
  );
}
