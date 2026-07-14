"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type EnergieCheck = {
  datum: string;
  energie: number;
  schlaf: number;
  hunger: number;
};

function getTipp(e: EnergieCheck): { emoji: string; titel: string; text: string } {
  const score = e.energie + e.schlaf + e.hunger;
  if (e.energie === 1 && e.schlaf === 1) return { emoji: "😴", titel: "Schlaf ist dein größter Hebel heute", text: "Schlechter Schlaf blockiert alles — Fettverbrennung, Energie, Laune. Heute Abend: Handy weg um 21 Uhr, Magnesium nehmen, Zimmer kühler stellen. Morgen wird besser." };
  if (e.energie === 1 && e.hunger === 1) return { emoji: "🧂", titel: "Elektrolyte — sofort!", text: "Müde UND hungrig auf Keto ist fast immer ein Elektrolyt-Mangel. Trinke jetzt ein Glas Wasser mit einer Prise Salz oder mach dir eine Brühe." };
  if (e.energie === 1 && e.hunger === 3) return { emoji: "🥑", titel: "Mehr Fett — du isst zu wenig", text: "Kaum Hunger aber wenig Energie: du isst wahrscheinlich zu wenig Kalorien. Avocado, Nüsse, Butter — iss mehr Fett heute." };
  if (e.energie === 3 && score >= 8) return { emoji: "🔥", titel: "Du bist im Flow — nutze es!", text: "Perfekter Keto-Tag. Dein Körper läuft auf Ketonen. Nutze die Energie für Sport, wichtige Aufgaben oder einen langen Spaziergang." };
  if (e.schlaf === 1 && e.energie >= 2) return { emoji: "☕", titel: "Schlechter Schlaf, aber du schaffst das", text: "Heute trotzdem Energie — gut! Bulletproof Coffee hilft durch den Tag. Aber heute Abend früher ins Bett." };
  if (e.hunger === 1 && e.energie >= 2) return { emoji: "⏰", titel: "Hunger auf Keto — was steckt dahinter?", text: "Trinke erst Wasser (oft ist es Durst), prüfe ob du genug Fett gegessen hast, und überlege ob Stress den Hunger triggert." };
  if (e.energie === 2 && e.schlaf === 2) return { emoji: "💧", titel: "Mittelmäßiger Tag — Wasser und Bewegung helfen", text: "500 ml Wasser trinken, 10 Minuten spazieren gehen. Klingt banal, funktioniert aber fast immer." };
  if (score <= 4) return { emoji: "🌿", titel: "Heute sanft mit dir sein", text: "Nicht jeder Tag ist ein Hochleistungstag — und das ist okay. Iss sauber keto, trink viel, schlaf heute früh." };
  return { emoji: "✅", titel: "Guter Keto-Tag", text: "Du bist auf Kurs. Bleib bei deiner Ernährung, trink genug Wasser und vergiss die Elektrolyte nicht." };
}

const FRAGEN = [
  { key: "energie" as const, frage: "Wie ist deine Energie?", optionen: [{ wert: 1, emoji: "😴", label: "Müde" }, { wert: 2, emoji: "😐", label: "Okay" }, { wert: 3, emoji: "⚡", label: "Top!" }] },
  { key: "schlaf" as const, frage: "Wie hast du geschlafen?", optionen: [{ wert: 1, emoji: "😫", label: "Schlecht" }, { wert: 2, emoji: "😌", label: "Okay" }, { wert: 3, emoji: "😊", label: "Super" }] },
  { key: "hunger" as const, frage: "Wie ist dein Hunger?", optionen: [{ wert: 1, emoji: "🍽️", label: "Hungrig" }, { wert: 2, emoji: "😐", label: "Normal" }, { wert: 3, emoji: "✅", label: "Kaum" }] },
];

export default function EnergieCheckPage() {
  const heute = new Date().toLocaleDateString("de-DE");
  const [check, setCheck] = useState<Partial<EnergieCheck>>({});
  const [gespeichert, setGespeichert] = useState<EnergieCheck | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("ketome_energie_check");
    if (raw) {
      const g: EnergieCheck = JSON.parse(raw);
      if (g.datum === heute) setGespeichert(g);
    }
  }, [heute]);

  function antworten(key: "energie" | "schlaf" | "hunger", wert: number) {
    const neu = { ...check, [key]: wert };
    setCheck(neu);
    if (neu.energie && neu.schlaf && neu.hunger) {
      const fertig: EnergieCheck = { datum: heute, energie: neu.energie, schlaf: neu.schlaf, hunger: neu.hunger };
      localStorage.setItem("ketome_energie_check", JSON.stringify(fertig));
      setGespeichert(fertig);
    }
  }

  const tipp = gespeichert ? getTipp(gespeichert) : null;

  return (
    <main className="min-h-screen px-4 py-6 pb-28" style={{ backgroundColor: "#0a0a0a" }}>
      <Link href="/" className="text-xs mb-6 inline-block" style={{ color: "#555" }}>← Zurück</Link>

      <div className="mb-6">
        <div className="text-xs mb-1" style={{ color: "#3a5a3a" }}>{heute}</div>
        <h1 className="text-2xl font-black mb-1">⚡ Energie-Check</h1>
        <p className="text-sm" style={{ color: "#555" }}>Wie geht es dir heute — dein täglicher Keto-Puls.</p>
      </div>

      {!gespeichert ? (
        <div className="rounded-2xl p-5" style={{ backgroundColor: "#101410", border: "1px solid #1a2a1a" }}>
          <div className="space-y-5">
            {FRAGEN.map(f => (
              <div key={f.key}>
                <div className="text-sm font-medium mb-3" style={{ color: "#ccc" }}>{f.frage}</div>
                <div className="flex gap-2">
                  {f.optionen.map(o => (
                    <button key={o.wert} onClick={() => antworten(f.key, o.wert)}
                      className="flex-1 py-3 rounded-xl flex flex-col items-center gap-1.5 transition-all"
                      style={{ backgroundColor: check[f.key] === o.wert ? "#f59e0b" : "#1a1a1a", color: check[f.key] === o.wert ? "#000" : "#888", border: check[f.key] === o.wert ? "none" : "1px solid #2a2a2a" }}>
                      <span className="text-2xl">{o.emoji}</span>
                      <span className="text-xs font-semibold">{o.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {(check.energie || check.schlaf || check.hunger) && !(check.energie && check.schlaf && check.hunger) && (
            <p className="text-xs mt-4 text-center" style={{ color: "#555" }}>
              Noch {3 - [check.energie, check.schlaf, check.hunger].filter(Boolean).length} Frage(n)…
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="rounded-2xl p-5 mb-4" style={{ backgroundColor: "#101410", border: "1px solid #854d0e" }}>
            <div className="flex gap-4 mb-4">
              <span className="text-4xl">{tipp!.emoji}</span>
              <div>
                <div className="font-bold text-base mb-1">{tipp!.titel}</div>
                <p className="text-sm leading-relaxed" style={{ color: "#aaa" }}>{tipp!.text}</p>
              </div>
            </div>
            <div className="flex gap-4 pt-3 text-sm" style={{ color: "#555", borderTop: "1px solid #1a1a1a" }}>
              <span>{["😴","😐","⚡"][gespeichert.energie-1]} Energie</span>
              <span>{["😫","😌","😊"][gespeichert.schlaf-1]} Schlaf</span>
              <span>{["🍽️","😐","✅"][gespeichert.hunger-1]} Hunger</span>
            </div>
          </div>
          <button
            onClick={() => { setGespeichert(null); setCheck({}); localStorage.removeItem("ketome_energie_check"); }}
            className="w-full py-3 rounded-xl text-sm font-semibold"
            style={{ backgroundColor: "#1a1a1a", color: "#555" }}>
            Neu beantworten
          </button>
        </>
      )}
    </main>
  );
}
