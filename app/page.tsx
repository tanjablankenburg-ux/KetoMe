"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [gewicht, setGewicht] = useState<number | null>(null);
  const [today] = useState(new Date().toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" }));

  useEffect(() => {
    const data = localStorage.getItem("ketome_gewicht");
    if (data) {
      const arr = JSON.parse(data);
      if (arr.length > 0) setGewicht(arr[arr.length - 1].wert);
    }
  }, []);

  const tipps = [
    "Trinke mindestens 2-3 Liter Wasser täglich — Keto entwässert.",
    "Salz nicht vergessen! Elektrolyte sind entscheidend auf Keto.",
    "Keto-Grippe? Normal in den ersten Tagen — Magnesium hilft.",
    "Hunger? Oft ist es Durst. Erst ein Glas Wasser trinken.",
    "Bullet Proof Coffee morgens hält stundenlang satt.",
    "Geduld — Ketose braucht 2-7 Tage. Bleib dran!",
    "Mehr Energie kommt nach der Eingewöhnungsphase — versprochen.",
  ];
  const tipp = tipps[new Date().getDay() % tipps.length];

  return (
    <main className="px-4 py-6">
      <div className="mb-6">
        <div className="text-xs mb-1" style={{ color: "#666" }}>{today}</div>
        <h1 className="text-2xl font-bold">KetoMe <span className="text-sm font-normal" style={{ color: "#666" }}>by Carbbye</span></h1>
      </div>

      <div className="rounded-2xl p-5 mb-4 flex items-center justify-between" style={{ backgroundColor: "#1a1a1a" }}>
        <div>
          <div className="text-xs mb-1" style={{ color: "#666" }}>Aktuelles Gewicht</div>
          <div className="text-3xl font-bold" style={{ color: "#22c55e" }}>
            {gewicht ? `${gewicht} kg` : "– kg"}
          </div>
        </div>
        <Link href="/tracking" className="px-4 py-2 rounded-xl text-sm font-semibold"
          style={{ backgroundColor: "#22c55e", color: "#000" }}>
          Eintragen
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { href: "/wochenplan", icon: "🥗", label: "Wochenplan", sub: "Fertige Keto-Pläne" },
          { href: "/lebensmittel", icon: "🍳", label: "Lebensmittel", sub: "Nährwerte nachschlagen" },
          { href: "/mahlzeiten", icon: "⭐", label: "Favoriten", sub: "Meine Lieblingsmahlzeiten" },
          { href: "/tracking", icon: "📊", label: "Tracking", sub: "Gewicht & Maße" },
        ].map(item => (
          <Link key={item.href} href={item.href} className="rounded-2xl p-4 flex flex-col gap-2"
            style={{ backgroundColor: "#1a1a1a" }}>
            <span className="text-2xl">{item.icon}</span>
            <span className="font-semibold text-sm">{item.label}</span>
            <span className="text-xs" style={{ color: "#666" }}>{item.sub}</span>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl p-4" style={{ backgroundColor: "#0d2018", border: "1px solid #166534" }}>
        <div className="text-xs font-semibold mb-2" style={{ color: "#22c55e" }}>💡 Keto-Tipp des Tages</div>
        <p className="text-sm leading-relaxed" style={{ color: "#ccc" }}>{tipp}</p>
      </div>
    </main>
  );
}
