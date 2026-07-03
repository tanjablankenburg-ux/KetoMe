"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

type EnergieCheck = {
  datum: string;
  energie: number;   // 1=müde 2=okay 3=top
  schlaf: number;    // 1=schlecht 2=okay 3=gut
  hunger: number;    // 1=sehr hungrig 2=normal 3=kaum
};

function getTipp(e: EnergieCheck): { emoji: string; titel: string; text: string } {
  const score = e.energie + e.schlaf + e.hunger;

  // Spezifische Kombinationen zuerst
  if (e.energie === 1 && e.schlaf === 1) return {
    emoji: "😴",
    titel: "Schlaf ist dein größter Hebel heute",
    text: "Schlechter Schlaf blockiert alles — Fettverbrennung, Energie, Laune. Heute Abend: Handy weg um 21 Uhr, Magnesium nehmen, Zimmer kühler stellen. Morgen wird besser.",
  };
  if (e.energie === 1 && e.hunger === 1) return {
    emoji: "🧂",
    titel: "Elektrolyte — sofort!",
    text: "Müde UND hungrig auf Keto ist fast immer ein Elektrolyt-Mangel. Trinke jetzt ein Glas Wasser mit einer Prise Salz oder mach dir eine Brühe. Dein Körper braucht Natrium.",
  };
  if (e.energie === 1 && e.hunger === 3) return {
    emoji: "🥑",
    titel: "Mehr Fett — du isst zu wenig",
    text: "Kaum Hunger aber wenig Energie: du isst wahrscheinlich zu wenig Kalorien. Keto funktioniert nicht als Crash-Diät. Avocado, Nüsse, Butter — iss mehr Fett heute.",
  };
  if (e.energie === 3 && score >= 8) return {
    emoji: "🔥",
    titel: "Du bist im Flow — nutze es!",
    text: "Perfekter Keto-Tag. Dein Körper läuft auf Ketonen und du merkst es. Nutze die Energie für Sport, wichtige Aufgaben oder einen langen Spaziergang.",
  };
  if (e.schlaf === 1 && e.energie >= 2) return {
    emoji: "☕",
    titel: "Schlechter Schlaf, aber du schaffst das",
    text: "Heute trotzdem Energie — gut! Bulletproof Coffee hilft durch den Tag. Aber heute Abend früher ins Bett. Dein Körper repariert sich nur im Schlaf.",
  };
  if (e.hunger === 1 && e.energie >= 2) return {
    emoji: "⏰",
    titel: "Hunger auf Keto — was steckt dahinter?",
    text: "Wenn du auf Keto sehr hungrig bist: trinke erst Wasser (oft ist es Durst), prüfe ob du genug Fett gegessen hast, und überlege ob Stress oder schlechter Schlaf den Hunger triggert.",
  };
  if (e.energie === 2 && e.schlaf === 2) return {
    emoji: "💧",
    titel: "Mittelmäßiger Tag — Wasser und Bewegung helfen",
    text: "An 'so-lala' Tagen hilft oft: 500 ml Wasser trinken, 10 Minuten spazieren gehen. Das klingt banal, funktioniert aber fast immer. Dein Energielevel wird sich verschieben.",
  };
  if (score <= 4) return {
    emoji: "🌿",
    titel: "Heute sanft mit dir sein",
    text: "Nicht jeder Tag ist ein Hochleistungstag — und das ist okay. Iss sauber keto, trink viel, schlaf heute früh. Morgen fängt neu an.",
  };

  return {
    emoji: "✅",
    titel: "Guter Keto-Tag",
    text: "Du bist auf Kurs. Bleib bei deiner Ernährung, trink genug Wasser und vergiss die Elektrolyte nicht. Konsistenz ist der Schlüssel — nicht Perfektion.",
  };
}

const FRAGEN = [
  {
    key: "energie" as const,
    frage: "Wie ist deine Energie gerade?",
    optionen: [
      { wert: 1, emoji: "😴", label: "Sehr müde" },
      { wert: 2, emoji: "😐", label: "Geht so" },
      { wert: 3, emoji: "⚡", label: "Top!" },
    ],
  },
  {
    key: "schlaf" as const,
    frage: "Wie hast du geschlafen?",
    optionen: [
      { wert: 1, emoji: "😫", label: "Schlecht" },
      { wert: 2, emoji: "😌", label: "Okay" },
      { wert: 3, emoji: "😊", label: "Super" },
    ],
  },
  {
    key: "hunger" as const,
    frage: "Wie ist dein Hunger?",
    optionen: [
      { wert: 1, emoji: "🍽️", label: "Sehr hungrig" },
      { wert: 2, emoji: "😐", label: "Normal" },
      { wert: 3, emoji: "✅", label: "Kaum" },
    ],
  },
];

export default function Home() {
  const [gewicht, setGewicht] = useState<number | null>(null);
  const [today] = useState(new Date().toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" }));
  const [check, setCheck] = useState<Partial<EnergieCheck>>({});
  const [checkGespeichert, setCheckGespeichert] = useState<EnergieCheck | null>(null);

  const heute = new Date().toLocaleDateString("de-DE");

  useEffect(() => {
    const g = localStorage.getItem("ketome_gewicht");
    if (g) { const arr = JSON.parse(g); if (arr.length > 0) setGewicht(arr[arr.length - 1].wert); }
    const c = localStorage.getItem("ketome_energie_check");
    if (c) {
      const gespeichert: EnergieCheck = JSON.parse(c);
      if (gespeichert.datum === heute) setCheckGespeichert(gespeichert);
    }
  }, []);

  function antwortSetzen(key: "energie" | "schlaf" | "hunger", wert: number) {
    const neu = { ...check, [key]: wert };
    setCheck(neu);
    if (neu.energie && neu.schlaf && neu.hunger) {
      const fertig: EnergieCheck = { datum: heute, energie: neu.energie, schlaf: neu.schlaf, hunger: neu.hunger };
      localStorage.setItem("ketome_energie_check", JSON.stringify(fertig));
      setCheckGespeichert(fertig);
    }
  }

  const tipp = getTipp(checkGespeichert ?? { datum: "", energie: 2, schlaf: 2, hunger: 2 });

  return (
    <main className="px-4 py-6 pb-28">
      <div className="mb-5">
        <div className="text-xs mb-1" style={{ color: "#666" }}>{today}</div>
        <h1 className="text-2xl font-bold">KetoMe <span className="text-sm font-normal" style={{ color: "#666" }}>by Carbbye</span></h1>
      </div>

      {/* Gewicht */}
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

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {[
          { href: "/wochenplan", icon: "🥗", label: "Wochenplan", sub: "Fertige Keto-Pläne" },
          { href: "/rezepte", icon: "📖", label: "Rezepte", sub: "Keto-Rezepte" },
          { href: "/fitness", icon: "💪", label: "Fitness", sub: "Übungen ohne Gym" },
          { href: "/info", icon: "📚", label: "Keto Wissen", sub: "Ketose, Biohacking & mehr" },
          { href: "/einkaufsliste", icon: "🛒", label: "Einkaufsliste", sub: "Zum Abhaken" },
          { href: "/lebensmittel", icon: "🍳", label: "Nährwerte", sub: "100+ Lebensmittel" },
          { href: "/scanner", icon: "📷", label: "Barcode", sub: "Produkt scannen" },
        ].map(item => (
          <Link key={item.href} href={item.href} className="rounded-2xl p-4 flex flex-col gap-2"
            style={{ backgroundColor: "#1a1a1a" }}>
            <span className="text-2xl">{item.icon}</span>
            <span className="font-semibold text-sm">{item.label}</span>
            <span className="text-xs" style={{ color: "#666" }}>{item.sub}</span>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: "#0d2018", border: "1px solid #166534" }}>
        <div className="text-xs font-semibold mb-2" style={{ color: "#22c55e" }}>💡 Keto-Tipp des Tages</div>
        <p className="text-sm leading-relaxed" style={{ color: "#ccc" }}>
          {["Trinke mindestens 2-3 Liter Wasser täglich — Keto entwässert.",
            "Salz nicht vergessen! Elektrolyte sind entscheidend auf Keto.",
            "Keto-Grippe? Normal in den ersten Tagen — Magnesium hilft.",
            "Hunger? Oft ist es Durst. Erst ein Glas Wasser trinken.",
            "Bullet Proof Coffee morgens hält stundenlang satt.",
            "Geduld — Ketose braucht 2-7 Tage. Bleib dran!",
            "Mehr Energie kommt nach der Eingewöhnungsphase — versprochen.",
          ][new Date().getDay() % 7]}
        </p>
      </div>

      {/* Energie-Check — ganz unten */}
      {!checkGespeichert ? (
        <div className="rounded-2xl p-4" style={{ backgroundColor: "#1a1a1a" }}>
          <div className="text-xs font-semibold mb-3" style={{ color: "#f59e0b" }}>⚡ Täglicher Energie-Check</div>
          <div className="space-y-4">
            {FRAGEN.map(f => (
              <div key={f.key}>
                <div className="text-sm mb-2" style={{ color: "#ccc" }}>{f.frage}</div>
                <div className="flex gap-2">
                  {f.optionen.map(o => (
                    <button key={o.wert} onClick={() => antwortSetzen(f.key, o.wert)}
                      className="flex-1 py-2.5 rounded-xl flex flex-col items-center gap-1"
                      style={{
                        backgroundColor: check[f.key] === o.wert ? "#f59e0b" : "#2a2a2a",
                        color: check[f.key] === o.wert ? "#000" : "#888",
                      }}>
                      <span className="text-xl">{o.emoji}</span>
                      <span className="text-xs font-medium">{o.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {(check.energie || check.schlaf || check.hunger) && !(check.energie && check.schlaf && check.hunger) && (
            <p className="text-xs mt-3 text-center" style={{ color: "#555" }}>
              Noch {3 - [check.energie, check.schlaf, check.hunger].filter(Boolean).length} Frage(n) übrig…
            </p>
          )}
        </div>
      ) : (
        <div className="rounded-2xl p-4" style={{ backgroundColor: "#1a1a1a", border: "1px solid #854d0e" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-semibold" style={{ color: "#f59e0b" }}>⚡ Dein heutiger Energie-Tipp</div>
            <button onClick={() => { setCheckGespeichert(null); setCheck({}); localStorage.removeItem("ketome_energie_check"); }}
              className="text-xs" style={{ color: "#555" }}>
              Neu
            </button>
          </div>
          <div className="flex gap-3 mb-2">
            <span className="text-3xl">{tipp.emoji}</span>
            <div>
              <div className="font-semibold text-sm mb-1">{tipp.titel}</div>
              <p className="text-xs leading-relaxed" style={{ color: "#aaa" }}>{tipp.text}</p>
            </div>
          </div>
          <div className="flex gap-3 mt-3 text-xs" style={{ color: "#555" }}>
            <span>{["😴","😐","⚡"][checkGespeichert.energie-1]} Energie</span>
            <span>{["😫","😌","😊"][checkGespeichert.schlaf-1]} Schlaf</span>
            <span>{["🍽️","😐","✅"][checkGespeichert.hunger-1]} Hunger</span>
          </div>
        </div>
      )}
    </main>
  );
}
